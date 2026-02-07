"use client";

import { useState, useCallback } from 'react';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderItem } from './OrderItem';
import type { PedidoReciente } from './types';

interface OrderListProps {
  pedidos: PedidoReciente[];
}

export function OrderList({ pedidos }: OrderListProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const handleItemOpenChange = useCallback((pedidoId: string, isOpen: boolean) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (isOpen) {
        newSet.add(pedidoId);
      } else {
        newSet.delete(pedidoId);
      }
      return newSet;
    });
  }, []);

  const allOpen = pedidos.length > 0 && openItems.size === pedidos.length;

  const toggleAll = useCallback(() => {
    if (allOpen) {
      // Cerrar todos
      setOpenItems(new Set());
    } else {
      // Abrir todos
      setOpenItems(new Set(pedidos.map(p => p.id)));
    }
  }, [allOpen, pedidos]);

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
          {pedidos.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAll}
              className="text-muted-foreground hover:text-foreground"
            >
              {allOpen ? (
                <>
                  Cerrar compras <ChevronUp className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  Abrir compras <ChevronDown className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          )}
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
                <OrderItem
                  pedido={pedido}
                  isOpen={openItems.has(pedido.id)}
                  onOpenChange={(isOpen) => handleItemOpenChange(pedido.id, isOpen)}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
