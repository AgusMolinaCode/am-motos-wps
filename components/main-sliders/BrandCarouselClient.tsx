"use client";

import { useState, useRef, useCallback } from "react";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useAuth } from "@clerk/nextjs";
import { BrandStatus, ItemSheet } from "@/types/interface";
import { SheetTrigger } from "@/components/ui/sheet";
import ProductDetailsSheet from "@/components/shared/ProductDetailsSheet";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BrandCarouselClientProps {
  items: BrandStatus[];
  productType: string;
  direction?: "left" | "right";
}

// Ancho de cada tarjeta + gap
const ITEM_WIDTH = 224; // 208px + 16px gap

export function BrandCarouselClient({ 
  items, 
  productType
}: BrandCarouselClientProps) {
  const { calculateTotalPrice, formatPrice } = usePriceCalculation();
  const { isSignedIn } = useAuth();
  const [selectedItem, setSelectedItem] = useState<BrandStatus | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);

  // Convertir BrandStatus a ItemSheet
  const toItemSheet = (item: BrandStatus): ItemSheet => ({
    id: item.id,
    name: item.name,
    brand_id: item.brand_id,
    supplier_product_id: item.supplier_product_id,
    standard_dealer_price: item.standard_dealer_price,
    list_price: item.list_price,
    weight: item.weight,
    product_type: item.product_type,
    inventory: item.inventory,
    images: item.images,
  });

  // Calcular el scroll máximo
  const getMaxScroll = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return 0;
    const containerWidth = containerRef.current.offsetWidth;
    const trackWidth = trackRef.current.scrollWidth;
    return Math.max(0, trackWidth - containerWidth);
  }, []);

  // Aplicar scroll con transform
  const applyScroll = useCallback((position: number) => {
    const maxScroll = getMaxScroll();
    const clampedPosition = Math.max(0, Math.min(position, maxScroll));
    scrollPositionRef.current = clampedPosition;
    
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-clampedPosition}px)`;
    }
  }, [getMaxScroll]);

  // Navegación con flechas
  const scroll = useCallback((direction: "left" | "right") => {
    const scrollAmount = ITEM_WIDTH * 2;
    const newPosition = direction === "left" 
      ? scrollPositionRef.current - scrollAmount 
      : scrollPositionRef.current + scrollAmount;
    
    // Animación suave
    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.3s ease-out';
      applyScroll(newPosition);
      
      setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = '';
        }
      }, 300);
    }
  }, [applyScroll]);

  // Drag handlers - Mouse
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startScrollRef.current = scrollPositionRef.current;
    
    if (trackRef.current) {
      trackRef.current.style.transition = '';
      trackRef.current.style.cursor = 'grabbing';
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    const delta = startXRef.current - e.clientX;
    const newPosition = startScrollRef.current + delta;
    applyScroll(newPosition);
  }, [applyScroll]);

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    
    if (trackRef.current) {
      trackRef.current.style.cursor = 'grab';
    }
  }, []);

  // Drag handlers - Touch (para móvil)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
    startScrollRef.current = scrollPositionRef.current;
    
    if (trackRef.current) {
      trackRef.current.style.transition = '';
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    
    const delta = startXRef.current - e.touches[0].clientX;
    const newPosition = startScrollRef.current + delta;
    applyScroll(newPosition);
  }, [applyScroll]);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  if (items.length === 0) {
    return (
      <div className="py-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 ml-4">
          {productType}
        </h3>
        <p className="text-slate-500 text-center">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="py-6 w-full">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 ml-4">
        {productType}
      </h3>
      
      <div className="relative w-full max-w-[90%] mx-auto">
        {/* Flecha izquierda */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 shadow-md border-slate-200 dark:border-slate-700"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Flecha derecha */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 shadow-md border-slate-200 dark:border-slate-700"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Contenedor del carousel */}
        <div 
          ref={containerRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Track con items */}
          <div 
            ref={trackRef}
            className="flex gap-4"
            style={{ width: 'max-content' }}
          >
            {items.map((item, index) => {
              const retailCalc = calculateTotalPrice(item, false);
              const wholesaleCalc = calculateTotalPrice(item, true);
              const hasStock = retailCalc.hasStock;
              const finalPrice = isSignedIn ? wholesaleCalc.finalTotalArs : retailCalc.finalTotalArs;
              const listPriceWithMarkup = retailCalc.listPriceWithMarkup;

              const images = item.images?.data || [];
              const imageUrl =
                images.length > 0
                  ? `https://${images[0].domain || "cdn.wpsstatic.com"}${images[0].path || ""}${images[0].filename || ""}`
                  : "";

              return (
                <div
                  key={`${item.id}-${index}`}
                  className="w-[208px] flex-shrink-0 select-none"
                >
                  <ProductDetailsSheet
                    item={toItemSheet(item)}
                    openAutomatically={selectedItem?.id === item.id}
                    onOpenChange={(open) => {
                      if (!open) setSelectedItem(null);
                    }}
                  >
                    <SheetTrigger asChild>
                      <div className="cursor-pointer">
                        <Card className="overflow-hidden border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                          <CardContent className="flex flex-col aspect-[3/4] p-3">
                            <div className="relative flex-1 min-h-0">
                              <Image
                                src={imageUrl}
                                alt={item.name}
                                fill
                                className="object-contain pointer-events-none"
                                sizes="208px"
                                draggable={false}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-2">
                              {item.name}
                            </p>
                            <div className="mt-1">
                              {!hasStock ? (
                                <div className="flex flex-col">
                                  <span className="text-lg font-bold text-green-600">
                                    {formatPrice(listPriceWithMarkup || 0)}
                                  </span>
                                </div>
                              ) : isSignedIn ? (
                                <div className="flex flex-col">
                                  <span className="text-lg font-bold text-green-600">
                                    {formatPrice(finalPrice)}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-col">
                                  <span className="text-lg font-bold text-green-600">
                                    {formatPrice(finalPrice)}
                                  </span>
                                  <span className="text-xs text-slate-400 line-through">
                                    {formatPrice(listPriceWithMarkup || 0)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </SheetTrigger>
                  </ProductDetailsSheet>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BrandCarouselSkeleton({ productType }: { productType: string }) {
  return (
    <div className="py-6 w-full">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 ml-4">
        {productType}
      </h3>
      <div className="h-[280px] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
          <p className="text-slate-500 text-sm">Cargando...</p>
        </div>
      </div>
    </div>
  );
}
