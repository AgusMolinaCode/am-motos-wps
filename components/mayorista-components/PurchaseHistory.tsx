import { TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from './utils';
import type { HistorialCompra } from './types';

interface PurchaseHistoryProps {
  historial: HistorialCompra[];
}

export function PurchaseHistory({ historial }: PurchaseHistoryProps) {
  const maxMonto = historial.length > 0 
    ? Math.max(...historial.map(h => h.monto)) 
    : 0;

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-foreground">Historial de Compras</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {historial.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <TrendingDown className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay historial de compras</p>
            <p className="text-sm mt-1">Tus compras aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-4">
            {historial.map((mes) => {
              const percentage = maxMonto > 0 ? (mes.monto / maxMonto) * 100 : 0;
              return (
                <div key={mes.mes} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm font-medium">{mes.mes}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground text-xs">{mes.pedidos} pedidos</span>
                      <span className="text-foreground font-semibold text-sm">
                        {formatPrice(mes.monto)}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 group-hover:from-orange-400 group-hover:to-amber-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
