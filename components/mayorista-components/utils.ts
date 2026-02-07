import type { Order, ShippingStatus, ShippingCompany } from '@/types/interface';

// Mapeo de códigos de empresa a nombres legibles
const shippingCompanyLabels: Record<ShippingCompany, string> = {
  OCA: 'OCA',
  ANDREANI: 'Andreani',
  VAIA_CARGO: 'Vaia Cargo',
  BUSPACK: 'Buspack',
  MD_CARGAS: 'MD Cargas',
  CUCRERO_EXPRESS: 'Cucrero Express',
};

export const formatShippingCompany = (company: ShippingCompany | null | undefined): string => {
  if (!company) return 'No especificada';
  return shippingCompanyLabels[company] || company;
};

export const mapOrderStatus = (status: string): ShippingStatus => {
  switch (status) {
    case 'approved':
    case 'processing':
      return 'en_proceso';
    case 'shipped':
      return 'en_camino';
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

export const mapPaymentStatus = (status: string): 'aprobado' | 'por_aprobar' => {
  switch (status) {
    case 'approved':
    case 'processing':
    case 'shipped':
    case 'delivered':
      return 'aprobado';
    case 'pending_transfer':
      return 'por_aprobar';
    default:
      return 'aprobado';
  }
};

export const transformOrders = (orders: Order[]): import('./types').PedidoReciente[] => {
  return orders.slice(0, 5).map(order => {
    const { fecha, hora } = formatOrderDate(order.created_at);
    // Usar shipping_status si existe, sino default a 'en_proceso'
    const shippingStatus = order.shipping_status || 'en_proceso';
    return {
      id: order.payment_id,
      fecha,
      hora,
      productos: order.items.length,
      subtotal: order.subtotal,
      total: order.total,
      discount_code: order.discount_code,
      discount_amount: order.discount_amount,
      estado: shippingStatus,
      estadoPago: mapPaymentStatus(order.status),
      items: order.items.map(item => ({
        id: item.id,
        sku: item.sku,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        brand_id: item.brand_id,
        product_type: item.product_type,
      })),
      // Campos de envío (vienen de la DB, el usuario los carga manualmente)
      shipping_company: order.shipping_company,
      tracking_number: order.tracking_number,
      tracking_url: order.tracking_url,
    };
  });
};
