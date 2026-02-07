"use server";

import { prisma } from "@/lib/prisma";
import type { Order, OrderItem } from "@/types/interface";

/**
 * Obtiene todos los pedidos de un usuario por su Clerk User ID
 */
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  try {
    const orders = await prisma.order.findMany({
      where: { 
        clerk_user_id: userId
        // Incluir todos los estados, incluyendo pending_transfer
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
      // Campos de envío (tracking) - cargados manualmente por admin
      shipping_status: order.shipping_status,
      shipping_company: order.shipping_company,
      tracking_number: order.tracking_number,
      tracking_url: order.tracking_url,
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
  totalDiscounted: number;
  wholesaleSavings: number;
  averageOrderValue: number;
  lastPurchaseDate: string | null;
  // Estados basados en shipping_status
  activeOrders: number;      // en_proceso + en_camino
  inTransitOrders: number;   // en_camino
  deliveredOrders: number;   // entregado
}> {
  try {
    const orders = await prisma.order.findMany({
      where: { clerk_user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.subtotal), 0);
    const totalDiscounted = orders.reduce((sum, order) => sum + Number(order.discount_amount), 0);

    // Calcular ahorro por ser mayorista vs retail
    const wholesaleSavings = orders.reduce((sum, order) => {
      const items = (order.items as unknown) as OrderItem[];

      const orderSavings = items.reduce((itemSum, item) => {
        if (item.retail_unit_price && item.retail_unit_price > item.unit_price) {
          const savingPerUnit = item.retail_unit_price - item.unit_price;
          return itemSum + (savingPerUnit * item.quantity);
        }
        return itemSum;
      }, 0);

      return sum + orderSavings;
    }, 0);

    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    const lastOrder = orders[0];
    const lastPurchaseDate = lastOrder
      ? new Date(lastOrder.created_at).toLocaleDateString('es-AR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      : null;

    // Conteos basados en shipping_status
    const activeOrders = orders.filter(o =>
      ['en_proceso', 'en_camino'].includes(o.shipping_status || '')
    ).length;

    const inTransitOrders = orders.filter(o =>
      o.shipping_status === 'en_camino'
    ).length;

    const deliveredOrders = orders.filter(o =>
      o.shipping_status === 'entregado'
    ).length;

    return {
      totalOrders,
      totalSpent,
      totalDiscounted,
      wholesaleSavings,
      averageOrderValue,
      lastPurchaseDate,
      activeOrders,
      inTransitOrders,
      deliveredOrders,
    };
  } catch (error) {
    console.error("[getWholesaleStats] Error:", error);
    return {
      totalOrders: 0,
      totalSpent: 0,
      totalDiscounted: 0,
      wholesaleSavings: 0,
      averageOrderValue: 0,
      lastPurchaseDate: null,
      activeOrders: 0,
      inTransitOrders: 0,
      deliveredOrders: 0,
    };
  }
}

/**
 * Obtiene el historial de compras mensual para el usuario
 * Agrupa pedidos por mes y suma subtotales originales (sin descuento)
 */
export async function getMonthlyPurchaseHistory(userId: string): Promise<{
  mes: string;
  monto: number;
  pedidos: number;
}[]> {
  try {
    const orders = await prisma.order.findMany({
      where: { clerk_user_id: userId },
      orderBy: { created_at: "desc" },
    });

    if (orders.length === 0) return [];

    // Agrupar por mes (formato: "Ene 2024")
    const grouped = new Map<string, { monto: number; pedidos: number }>();

    orders.forEach(order => {
      const date = new Date(order.created_at);
      const mes = date.toLocaleDateString('es-AR', {
        month: 'short',
        year: 'numeric',
      }).replace('.', ''); // "ene. 2024" -> "ene 2024"

      // Capitalizar primera letra
      const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);

      if (!grouped.has(mesCapitalizado)) {
        grouped.set(mesCapitalizado, { monto: 0, pedidos: 0 });
      }

      const current = grouped.get(mesCapitalizado)!;
      current.monto += Number(order.subtotal); // Usar subtotal original
      current.pedidos += 1;
    });

    // Convertir a array y ordenar cronológicamente (más reciente primero)
    const result = Array.from(grouped.entries()).map(([mes, data]) => ({
      mes,
      monto: Math.round(data.monto * 100) / 100,
      pedidos: data.pedidos,
    }));

    return result;
  } catch (error) {
    console.error("[getMonthlyPurchaseHistory] Error:", error);
    return [];
  }
}
