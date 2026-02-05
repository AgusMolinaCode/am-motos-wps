import type { Order } from '@/types/interface';

export const mapOrderStatus = (status: string): 'en_proceso' | 'enviado' | 'entregado' => {
  switch (status) {
    case 'approved':
    case 'processing':
      return 'en_proceso';
    case 'shipped':
      return 'enviado';
    case 'delivered':
      return 'entregado';
    default:
      return 'en_proceso';
  }
};

export const formatOrderDate = (dateString: string): { fecha: string; hora: string } => {
  const date = new Date(dateString);
  
  const fecha = date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  
  const hora = date.toLocaleTimeString('es-AR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase();
  
  return { fecha, hora };
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price);
};

export const transformOrders = (orders: Order[]): import('./types').PedidoReciente[] => {
  return orders.slice(0, 5).map(order => {
    const { fecha, hora } = formatOrderDate(order.created_at);
    return {
      id: order.payment_id,
      fecha,
      hora,
      productos: order.items.length,
      subtotal: order.subtotal,
      total: order.total,
      discount_code: order.discount_code,
      discount_amount: order.discount_amount,
      estado: mapOrderStatus(order.status),
      items: order.items.map(item => ({
        id: item.id,
        sku: item.sku,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        brand_id: item.brand_id,
        product_type: item.product_type,
      })),
    };
  });
};
