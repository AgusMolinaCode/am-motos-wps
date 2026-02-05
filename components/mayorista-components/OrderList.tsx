import { Package, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderItem } from './OrderItem';
import type { PedidoReciente } from './types';

interface OrderListProps {
  pedidos: PedidoReciente[];
}

export function OrderList({ pedidos }: OrderListProps) {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
              <Package className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-foreground">Pedidos Recientes</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Ver todos <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {pedidos.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No tenés pedidos todavía</p>
            <p className="text-sm mt-1">Hacé tu primer pedido para verlo aquí</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50 max-h-[600px] overflow-y-auto">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="hover:bg-accent/20 transition-colors">
                <OrderItem pedido={pedido} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
