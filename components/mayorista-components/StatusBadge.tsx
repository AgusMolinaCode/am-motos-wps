import { Clock, Truck, CheckCircle2 } from 'lucide-react';
import type { ShippingStatus } from './types';

interface StatusBadgeProps {
  estado: ShippingStatus;
}

const styles = {
  en_proceso: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25',
  en_camino: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/25',
  entregado: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
};

const labels = {
  en_proceso: 'En Proceso',
  en_camino: 'En camino',
  entregado: 'Entregado',
};

const icons = {
  en_proceso: Clock,
  en_camino: Truck,
  entregado: CheckCircle2,
};

export function StatusBadge({ estado }: StatusBadgeProps) {
  const Icon = icons[estado];
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[estado]}`}>
      <Icon className="w-3.5 h-3.5" />
      {labels[estado]}
    </span>
  );
}
