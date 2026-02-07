import type { LucideIcon } from 'lucide-react';

export type ShippingStatus = 'en_proceso' | 'en_camino' | 'entregado';

export type ShippingCompany = 'OCA' | 'ANDREANI' | 'VAIA_CARGO' | 'BUSPACK' | 'MD_CARGAS' | 'CUCRERO_EXPRESS';

export interface PedidoItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unit_price: number;
  brand_id: number;
  product_type: string;
}

export interface PedidoReciente {
  id: string;
  fecha: string;
  hora: string;
  productos: number;
  subtotal: number;
  total: number;
  discount_code?: string | null;
  discount_amount: number;
  estado: ShippingStatus; // shipping_status del pedido
  estadoPago: 'aprobado' | 'por_aprobar';
  items: PedidoItem[];
  // Campos de envío (shipping_status controla si se muestran)
  shipping_company?: ShippingCompany | null;  // Requerido cuando estado es 'en_camino' o 'entregado'
  tracking_number?: string | null;   // Requerido cuando estado es 'en_camino' o 'entregado'
  tracking_url?: string | null;      // Opcional, para rastrear el envío
}

export interface StatData {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: 'up' | 'neutral';
  color: string;
  featured?: boolean;
}

export interface OfertaEspecial {
  id: number;
  titulo: string;
  descripcion: string;
  vigencia: string;
  stock: string;
  tag: string;
  tagColor: string;
  icon: LucideIcon;
}

export interface HistorialCompra {
  mes: string;
  monto: number;
  pedidos: number;
}
