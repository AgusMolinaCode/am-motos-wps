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
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { formatPrice } from './utils';
import type { PedidoReciente } from './types';
import type { ItemSheet } from "@/types/interface";
import ProductDetailsSheet from "@/components/shared/ProductDetailsSheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Truck, ExternalLink } from "lucide-react";
import { formatShippingCompany } from './utils';

interface OrderItemProps {
  pedido: PedidoReciente;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

interface ItemConProducto {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unit_price: number;
  producto: ItemSheet | null;
}

export function OrderItem({ pedido, isOpen = false, onOpenChange }: OrderItemProps) {
  const [itemsConProductos, setItemsConProductos] = useState<ItemConProducto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [intentadoCargar, setIntentadoCargar] = useState(false);
  const [abierto, setAbierto] = useState(isOpen);

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

  // Sincronizar estado local con prop externa
  useEffect(() => {
    setAbierto(isOpen);
    if (isOpen && !intentadoCargar) {
      cargarProductos();
    }
  }, [isOpen, cargarProductos, intentadoCargar]);

  useEffect(() => {
    if (abierto && !intentadoCargar) {
      cargarProductos();
    }
  }, [abierto, cargarProductos, intentadoCargar]);

  // Si no se ha intentado cargar y no está abierto, mostrar items básicos
  const mostrarBasicos = !intentadoCargar && !abierto;

  const handleValueChange = (value: string) => {
    const newOpenState = value === pedido.id;
    setAbierto(newOpenState);
    onOpenChange?.(newOpenState);
  };

  return (
    <Accordion
      type="single"
      collapsible
      value={abierto ? pedido.id : ""}
      className="w-full"
      onValueChange={handleValueChange}
    >
      <AccordionItem value={pedido.id} className="border-0">
        <AccordionTrigger className="hover:no-underline py-0 hover:bg-accent/30 [&[data-state=open]]:bg-accent/20 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full text-left pr-4 py-5 px-5">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-foreground font-bold">orden-{pedido.id}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge estado={pedido.estado} />
                  <PaymentStatusBadge estado={pedido.estadoPago} />
                </div>
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
                    <p className="text-base font-semibold text-foreground truncate leading-tight">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">SKU: {item.sku}</p>
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
                      <p className="text-base font-semibold text-foreground truncate leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">
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

            {/* Información de Envío */}
            {(pedido.estado === 'en_camino' || pedido.estado === 'entregado') &&
              pedido.shipping_company &&
              pedido.tracking_number && (
              <div className="border-t border-border/50 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Información de Envío
                </h4>
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Empresa</span>
                    <span className="text-sm font-medium text-foreground">
                      {formatShippingCompany(pedido.shipping_company)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Número de seguimiento</span>
                    <span className="text-sm font-medium text-foreground font-mono">
                      {pedido.tracking_number}
                    </span>
                  </div>
                  {pedido.tracking_url && (
                    <div className="pt-2">
                      <a
                        href={pedido.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Seguir envío
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
