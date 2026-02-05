"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SheetTrigger } from "@/components/ui/sheet";
import { StatusBadge } from './StatusBadge';
import { formatPrice } from './utils';
import type { PedidoReciente } from './types';
import type { ItemSheet } from "@/types/interface";
import ProductDetailsSheet from "@/components/shared/ProductDetailsSheet";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderItemProps {
  pedido: PedidoReciente;
}

interface ItemConProducto {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unit_price: number;
  producto: ItemSheet | null;
}

export function OrderItem({ pedido }: OrderItemProps) {
  const [itemsConProductos, setItemsConProductos] = useState<ItemConProducto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [intentadoCargar, setIntentadoCargar] = useState(false);
  const [abierto, setAbierto] = useState(false);

  const cargarProductos = useCallback(async () => {
    if (cargando || intentadoCargar) return;
    
    setCargando(true);
    setIntentadoCargar(true);
    
    try {
      const { getProductBySku } = await import("@/lib/brands");
      
      const itemsConData: ItemConProducto[] = [];
      
      for (const item of pedido.items) {
        try {
          const producto = await getProductBySku(item.sku);
          itemsConData.push({
            ...item,
            producto,
          });
        } catch {
          itemsConData.push({
            ...item,
            producto: null,
          });
        }
      }
      
      setItemsConProductos(itemsConData);
    } catch {
      // Silenciar error
    } finally {
      setCargando(false);
    }
  }, [pedido.items, cargando, intentadoCargar]);

  useEffect(() => {
    if (abierto) {
      cargarProductos();
    }
  }, [abierto, cargarProductos]);

  // Si no se ha intentado cargar y no está abierto, mostrar items básicos
  const mostrarBasicos = !intentadoCargar && !abierto;

  return (
    <Accordion 
      type="single" 
      collapsible 
      className="w-full"
      onValueChange={(value) => setAbierto(value === pedido.id)}
    >
      <AccordionItem value={pedido.id} className="border-0">
        <AccordionTrigger className="hover:no-underline py-0 hover:bg-accent/30 [&[data-state=open]]:bg-accent/20 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full text-left pr-4 py-5 px-5">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-foreground font-bold">orden-{pedido.id}</span>
                <StatusBadge estado={pedido.estado} />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{pedido.fecha}</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">{pedido.hora}</span>
                <span className="w-1 h-1 rounded-full bg-border hidden sm:block" />
                <span>{pedido.productos} productos</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-foreground">
                {formatPrice(pedido.subtotal)}
              </span>
            </div>
          </div>
        </AccordionTrigger>
        
        <AccordionContent className="pb-5 px-5">
          <div className="space-y-4 border-t border-border/50 pt-4">
            {/* Items Detail */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground mb-3">Productos comprados</h4>
              
              {cargando && (
                <div className="space-y-2">
                  {pedido.items.map((_, idx) => (
                    <Skeleton key={idx} className="h-14 w-full rounded-lg" />
                  ))}
                </div>
              )}
              
              {!cargando && mostrarBasicos && pedido.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 px-4 bg-muted/30 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground whitespace-nowrap">
                      {formatPrice(item.unit_price)} × {item.quantity}
                    </span>
                    <span className="font-semibold text-foreground min-w-[80px] text-right">
                      {formatPrice(item.unit_price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
              
              {!cargando && !mostrarBasicos && itemsConProductos.map((item) => {
                const itemContent = (
                  <div className="flex justify-between items-center py-3 px-4 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        SKU: {item.sku}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground whitespace-nowrap">
                        {formatPrice(item.unit_price)} × {item.quantity}
                      </span>
                      <span className="font-semibold text-foreground min-w-[80px] text-right">
                        {formatPrice(item.unit_price * item.quantity)}
                      </span>
                    </div>
                  </div>
                );

                if (!item.producto) {
                  return <div key={item.id}>{itemContent}</div>;
                }

                return (
                  <ProductDetailsSheet 
                    key={item.id}
                    item={item.producto}
                    openAutomatically={false}
                  >
                    <SheetTrigger asChild>
                      {itemContent}
                    </SheetTrigger>
                  </ProductDetailsSheet>
                );
              })}
            </div>
            
            {/* Order Totals */}
            <div className="border-t border-border/50 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-medium">
                  {formatPrice(pedido.subtotal)}
                </span>
              </div>
              
              {pedido.discount_code && pedido.discount_amount > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      Descuento
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium">
                        {pedido.discount_code}
                      </span>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      -{formatPrice(pedido.discount_amount)}
                    </span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between text-base pt-2 border-t border-border/30">
                <span className="text-foreground font-semibold">Total</span>
                <span className="text-foreground font-bold">
                  {formatPrice(pedido.total)}
                </span>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
