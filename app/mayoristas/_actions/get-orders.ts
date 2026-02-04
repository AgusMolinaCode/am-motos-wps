"use server";

import { prisma } from "@/lib/prisma";
import type { Order } from "@/types/interface";

/**
 * Obtiene todos los pedidos de un usuario por su Clerk User ID
 */
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  try {
    const orders = await prisma.order.findMany({
      where: { 
        clerk_user_id: userId 
      },
      orderBy: { 
        created_at: "desc" 
      },
    });
    
    // Transformar los resultados de Prisma al tipo Order
    return orders.map(order => ({
      id: order.id,
      payment_id: order.payment_id,
      preference_id: order.preference_id,
      external_ref: order.external_ref,
      clerk_user_id: order.clerk_user_id,
      status: order.status as Order["status"],
      customer: {
        firstName: order.customer_first_name,
        lastName: order.customer_last_name,
        email: order.customer_email,
        phone: order.customer_phone,
        dni: order.customer_dni,
      },
      shipping: {
        address: order.shipping_address,
        city: order.shipping_city,
        province: order.shipping_province,
        zipCode: order.shipping_zip_code,
        notes: order.shipping_notes,
      },
      items: order.items as any,
      subtotal: Number(order.subtotal),
      discount_code: order.discount_code,
      discount_amount: Number(order.discount_amount),
      total: Number(order.total),
      metadata: order.metadata as any,
      created_at: order.created_at.toISOString(),
      updated_at: order.updated_at.toISOString(),
    }));
  } catch (error) {
    console.error("[getOrdersByUserId] Error:", error);
    return [];
  }
}

/**
 * Obtiene estadísticas de pedidos para el dashboard de mayoristas
 */
export async function getWholesaleStats(userId: string): Promise<{
  totalOrders: number;
  totalSpent: number;
  activeOrders: number;
  pendingShipments: number;
}> {
  try {
    const orders = await prisma.order.findMany({
      where: { clerk_user_id: userId },
    });
    
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const activeOrders = orders.filter(o => 
      ["approved", "processing"].includes(o.status)
    ).length;
    const pendingShipments = orders.filter(o => 
      o.status === "shipped"
    ).length;
    
    return {
      totalOrders,
      totalSpent,
      activeOrders,
      pendingShipments,
    };
  } catch (error) {
    console.error("[getWholesaleStats] Error:", error);
    return {
      totalOrders: 0,
      totalSpent: 0,
      activeOrders: 0,
      pendingShipments: 0,
    };
  }
}
