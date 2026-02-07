import { CheckCircle2, MinusCircle } from 'lucide-react';

interface PaymentStatusBadgeProps {
  estado: 'aprobado' | 'por_aprobar';
}

const styles = {
  aprobado: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
  por_aprobar: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25',
};

const labels = {
  aprobado: 'Aprobado',
  por_aprobar: 'Por aprobar',
};

const icons = {
  aprobado: CheckCircle2,
  por_aprobar: MinusCircle,
};

export function PaymentStatusBadge({ estado }: PaymentStatusBadgeProps) {
  const Icon = icons[estado];
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[estado]}`}>
      <Icon className="w-3.5 h-3.5" />
      {labels[estado]}
    </span>
  );
}
