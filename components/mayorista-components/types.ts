import type { LucideIcon } from 'lucide-react';

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
  estado: 'en_proceso' | 'enviado' | 'entregado';
  items: PedidoItem[];
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
