"use server";

import { prisma } from "@/lib/prisma";

interface TransferOrderInput {
  clerk_user_id?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dni: string;
  };
  shipping: {
    address: string;
    city: string;
    province: string;
    zipCode: string;
    notes?: string;
    deliveryType: "home" | "branch";
    branchOffice?: string;
  };
  items: Array<{
    id: string;
    sku: string;
    name: string;
    quantity: number;
    unit_price: number;
    retail_unit_price?: number;
    brand_id?: number;
    product_type?: string;
  }>;
  brand_ids: number[];
  product_types: string[];
  subtotal: number;
  discount_code?: string;
  discount_amount: number;
  shipping_cost: number;
  transfer_discount: number;
  total: number;
}

/**
 * Guarda un pedido por transferencia bancaria con estado pendiente
 * El admin debe aprobarlo manualmente desde la base de datos
 */
export async function saveTransferOrder(input: TransferOrderInput): Promise<{ 
  success: boolean; 
  orderId?: string; 
  paymentId?: string;
  error?: string 
}> {
  try {
    // Generar un payment_id único corto para transferencias (T- + 12 dígitos random)
    const generateRandomDigits = (length: number): string => {
      let result = '';
      for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
      }
      return result;
    };
    
    // Generar ID único y verificar que no exista
    let paymentId = '';
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      const randomDigits = generateRandomDigits(12);
      paymentId = `T-${randomDigits}`;
      
      // Verificar si ya existe
      const existing = await prisma.order.findUnique({
        where: { payment_id: paymentId },
      });
      
      if (!existing) {
        break; // ID único encontrado
      }
      
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      return { 
        success: false, 
        error: "No se pudo generar un ID único para el pedido. Intentá de nuevo." 
      };
    }

    // Verificar si ya existe un pedido idéntico pendiente (mismo email, mismo total, últimos 5 minutos)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const existingOrder = await prisma.order.findFirst({
      where: {
        customer_email: input.customer.email,
        total: input.total,
        status: "pending_transfer",
        created_at: {
          gte: fiveMinutesAgo,
        },
      },
    });

    if (existingOrder) {
      console.log(`[saveTransferOrder] Duplicate order detected: ${existingOrder.id}`);
      return { 
        success: true, 
        orderId: existingOrder.id,
        paymentId: existingOrder.payment_id 
      };
    }

    // Crear el pedido con estado pending_transfer
    const order = await prisma.order.create({
      data: {
        payment_id: paymentId,
        preference_id: null,
        external_ref: `TRANSFER-${input.customer.dni}`,
        clerk_user_id: input.clerk_user_id || null,
        status: "pending_transfer", // Estado especial para transferencias pendientes
        customer_first_name: input.customer.firstName,
        customer_last_name: input.customer.lastName,
        customer_email: input.customer.email,
        customer_phone: input.customer.phone,
        customer_dni: input.customer.dni,
        shipping_address: input.shipping.address,
        shipping_city: input.shipping.city,
        shipping_province: input.shipping.province,
        shipping_zip_code: input.shipping.zipCode,
        shipping_notes: input.shipping.notes || null,
        items: input.items as any,
        brand_ids: input.brand_ids || [],
        product_types: input.product_types || [],
        subtotal: input.subtotal,
        discount_code: input.discount_code || null,
        discount_amount: input.discount_amount,
        total: input.total,
        metadata: {
          payment_method: "bank_transfer",
          transfer_discount: input.transfer_discount,
          shipping_cost: input.shipping_cost,
          delivery_type: input.shipping.deliveryType,
          branch_office: input.shipping.branchOffice || null,
        } as any,
      },
    });

    console.log(`[saveTransferOrder] Order created: ${order.id} with payment_id: ${paymentId}`);
    return { 
      success: true, 
      orderId: order.id,
      paymentId: paymentId 
    };
  } catch (error) {
    console.error("[saveTransferOrder] Error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}
