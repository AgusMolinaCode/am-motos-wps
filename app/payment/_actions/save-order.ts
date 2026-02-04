"use server";

import { prisma } from "@/lib/prisma";
import type { CreateOrderInput, OrderItem } from "@/types/interface";

/**
 * Guarda un pedido exitoso en la base de datos
 * Se ejecuta cuando Mercado Pago confirma el pago aprobado
 */
export async function saveOrder(input: CreateOrderInput): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // Verificar si el pedido ya existe (idempotencia)
    const existingOrder = await prisma.order.findUnique({
      where: { payment_id: input.payment_id },
    });

    if (existingOrder) {
      console.log(`[saveOrder] Order already exists for payment ${input.payment_id}`);
      return { success: true, orderId: existingOrder.id };
    }

    // Crear el pedido
    const order = await prisma.order.create({
      data: {
        payment_id: input.payment_id,
        preference_id: input.preference_id,
        external_ref: input.external_ref,
        clerk_user_id: input.clerk_user_id,
        status: "approved",
        customer_first_name: input.customer.firstName,
        customer_last_name: input.customer.lastName,
        customer_email: input.customer.email,
        customer_phone: input.customer.phone,
        customer_dni: input.customer.dni,
        shipping_address: input.shipping.address,
        shipping_city: input.shipping.city,
        shipping_province: input.shipping.province,
        shipping_zip_code: input.shipping.zipCode,
        shipping_notes: input.shipping.notes,
        items: input.items as any,
        subtotal: input.subtotal,
        discount_code: input.discount_code,
        discount_amount: input.discount_amount,
        total: input.total,
        metadata: input.metadata as any,
      },
    });

    console.log(`[saveOrder] Order created successfully: ${order.id}`);
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("[saveOrder] Error saving order:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error saving order" 
    };
  }
}

/**
 * Obtiene un pedido por su ID de pago de Mercado Pago
 */
export async function getOrderByPaymentId(paymentId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { payment_id: paymentId },
    });
    return order;
  } catch (error) {
    console.error("[getOrderByPaymentId] Error:", error);
    return null;
  }
}

/**
 * Obtiene todos los pedidos de un cliente por email
 */
export async function getOrdersByEmail(email: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { customer_email: email },
      orderBy: { created_at: "desc" },
    });
    return orders;
  } catch (error) {
    console.error("[getOrdersByEmail] Error:", error);
    return [];
  }
}
