import { MercadoPagoConfig, Payment } from "mercadopago";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveOrder } from "@/app/payment/_actions/save-order";
import type { CreateOrderInput, OrderItem } from "@/types/interface";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
});

/**
 * Webhook para recibir notificaciones de Mercado Pago
 *
 * Este endpoint recibe notificaciones cuando hay cambios en los pagos.
 * Verifica la autenticidad del pago y actualiza el estado del pedido.
 *
 * IMPORTANTE: Siempre retornar 200 para indicar que la notificación fue recibida,
 * excepto cuando queremos que Mercado Pago reintente la notificación.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verificar que sea una notificación de pago
    if (body.type !== "payment" && !body.data?.id) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const paymentId = body.data.id;

    // Obtener detalles del pago para verificar autenticidad
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });

    // Solo procesar pagos aprobados
    if (paymentData.status === "approved") {
      // Obtener datos de la metadata
      const metadata = paymentData.metadata;

      // Marcar código de descuento como usado si existe (usando SQL directo)
      const discountCode = metadata?.discount_code;
      if (discountCode) {
        try {
          const result = await prisma.$queryRaw<Array<{id: string; used_count: number; max_uses: number | null}>>`
            SELECT id, used_count, max_uses FROM discount_codes 
            WHERE UPPER(code) = UPPER(${discountCode})
            LIMIT 1
          `;
          
          const codeData = result[0];
          if (codeData) {
            const newUsedCount = codeData.used_count + 1;
            const shouldDeactivate = codeData.max_uses !== null && newUsedCount >= codeData.max_uses;
            
            await prisma.$executeRaw`
              UPDATE discount_codes 
              SET used_count = ${newUsedCount}, is_active = ${!shouldDeactivate}, updated_at = NOW()
              WHERE id = ${codeData.id}
            `;
          }
        } catch (err) {
          // Silenciar error de descuento, no es crítico
          console.error("[Webhook] Error updating discount code:", err);
        }
      }

      // Guardar el pedido en la base de datos
      try {
        // Extraer items de los additional_info o metadata
        const items: OrderItem[] = metadata?.items?.map((item: any) => ({
          id: item.id,
          sku: item.sku || item.id,
          name: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })) || [];

        // Construir datos del cliente
        const customer = metadata?.customer || {
          firstName: paymentData.payer?.first_name || "",
          lastName: paymentData.payer?.last_name || "",
          email: paymentData.payer?.email || "",
          phone: paymentData.payer?.phone?.number || "",
          dni: metadata?.customer?.dni || "",
        };

        // Construir datos de envío
        const shipping = metadata?.shipping || {
          address: "",
          city: "",
          province: "",
          zipCode: "",
          notes: "",
        };

        // DEBUG: Verificar metadata recibida
        console.log("[DEBUG Webhook] metadata:", JSON.stringify(metadata, null, 2));
        console.log("[DEBUG Webhook] clerk_user_id from metadata:", metadata?.clerk_user_id);
        
        const orderData: CreateOrderInput = {
          payment_id: paymentId.toString(),
          preference_id: (paymentData as any).preference_id || metadata?.preference_id,
          external_ref: paymentData.external_reference || metadata?.external_reference,
          clerk_user_id: metadata?.clerk_user_id,
          customer: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            dni: customer.dni,
          },
          shipping: {
            address: shipping.address,
            city: shipping.city,
            province: shipping.province,
            zipCode: shipping.zipCode,
            notes: shipping.notes,
          },
          items,
          subtotal: metadata?.subtotal || paymentData.transaction_amount || 0,
          discount_code: metadata?.discount?.code,
          discount_amount: metadata?.discount?.discount_amount || 0,
          total: paymentData.transaction_amount || 0,
          metadata: {
            mp_payment_method_id: paymentData.payment_method_id,
            mp_payment_type_id: paymentData.payment_type_id,
            mp_installments: paymentData.installments,
            mp_processing_mode: paymentData.processing_mode,
            mp_merchant_order_id: paymentData.order?.id,
          },
        };

        const result = await saveOrder(orderData);
        
        if (result.success) {
          console.log(`[Webhook] Order saved successfully: ${result.orderId}`);
        } else {
          console.error("[Webhook] Failed to save order:", result.error);
        }
      } catch (orderError) {
        console.error("[Webhook] Error creating order:", orderError);
        // No fallamos el webhook si falla el guardado del pedido,
        // ya que el pago sí fue procesado correctamente
      }

      // Revalidar las páginas para mostrar datos actualizados
      revalidatePath("/");
      revalidatePath("/checkout");
      revalidatePath("/payment/success");
    }

    // Siempre responder 200 para confirmar recepción
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    // Error silenciado - considerar logging externo para producción
    console.error("[Webhook] Error processing webhook:", error);

    // En caso de error, podemos retornar 500 para que MP reintente
    // o 200 si no queremos que reintente (depende de tu lógica)
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 200 }, // Cambiar a 500 si quieres que MP reintente
    );
  }
}

/**
 * Mercado Pago puede hacer GET para verificar el webhook
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const challenge = searchParams.get("challenge");

  if (challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ status: "Webhook active" }, { status: 200 });
}
