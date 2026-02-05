import { Clock, Truck, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  estado: 'en_proceso' | 'enviado' | 'entregado';
}

const styles = {
  en_proceso: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25',
  enviado: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/25',
  entregado: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
};

const labels = {
  en_proceso: 'En Proceso',
  enviado: 'Enviado',
  entregado: 'Entregado',
};

const icons = {
  en_proceso: Clock,
  enviado: Truck,
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
