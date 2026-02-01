"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
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
  productType, 
  direction = "left" 
}: BrandCarouselClientProps) {
  const { calculateTotalPrice, formatPrice } = usePriceCalculation();
  const { isSignedIn } = useAuth();
  const [selectedItem, setSelectedItem] = useState<BrandStatus | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const positionRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startPositionRef = useRef(0);

  // Convertir BrandStatus a ItemSheet
  const toItemSheet = (item: BrandStatus): ItemSheet => ({
    id: item.id,
    name: item.name,
    brand_id: item.brand_id,
    supplier_product_id: item.supplier_product_id,
    standard_dealer_price: item.standard_dealer_price,
    list_price: item.list_price,
    weight: item.weight,
    inventory: item.inventory,
    images: item.images,
  });

  // Calcular cuántas copias necesitamos (mínimo 4 para loop fluido)
  const copiesNeeded = useMemo(() => {
    return Math.max(4, Math.ceil((typeof window !== 'undefined' ? window.innerWidth : 1200) / (items.length * ITEM_WIDTH)) + 2);
  }, [items.length]);

  // Duplicar items
  const duplicatedItems = useMemo(() => {
    const result = [];
    for (let i = 0; i < copiesNeeded; i++) {
      result.push(...items);
    }
    return result;
  }, [items, copiesNeeded]);

  const singleSetWidth = items.length * ITEM_WIDTH;

  // Aplicar transform
  const applyTransform = useCallback((pos: number) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-pos}px)`;
    }
  }, []);

  // Normalizar posición para loop infinito
  const normalizePosition = useCallback((pos: number) => {
    // Si nos pasamos del segundo set, volver al primero
    if (pos >= singleSetWidth * 2) {
      return pos - singleSetWidth;
    }
    // Si vamos antes del primer set, ir al segundo
    if (pos < singleSetWidth) {
      return pos + singleSetWidth;
    }
    return pos;
  }, [singleSetWidth]);

  // Animación continua
  useEffect(() => {
    if (!trackRef.current || duplicatedItems.length === 0) return;
    
    // Iniciar en el segundo set
    if (positionRef.current === 0) {
      positionRef.current = singleSetWidth;
      applyTransform(positionRef.current);
    }

    const animate = () => {
      if (!isPaused && !isDraggingRef.current) {
        const speed = direction === "right" ? -0.8 : 0.8;
        positionRef.current += speed;
        positionRef.current = normalizePosition(positionRef.current);
        applyTransform(positionRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [duplicatedItems.length, isPaused, direction, normalizePosition, applyTransform, singleSetWidth]);

  // Navegación con flechas
  const scroll = useCallback((dir: "left" | "right") => {
    const scrollAmount = ITEM_WIDTH * 2;
    if (dir === "left") {
      positionRef.current -= scrollAmount;
    } else {
      positionRef.current += scrollAmount;
    }
    positionRef.current = normalizePosition(positionRef.current);
    
    // Animación suave
    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.5s ease-out';
      applyTransform(positionRef.current);
      setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = '';
        }
      }, 500);
    }
  }, [normalizePosition, applyTransform]);

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startPositionRef.current = positionRef.current;
    setIsPaused(true);
    
    if (trackRef.current) {
      trackRef.current.style.transition = '';
      trackRef.current.style.cursor = 'grabbing';
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    const delta = startXRef.current - e.clientX;
    positionRef.current = startPositionRef.current + delta;
    applyTransform(positionRef.current);
  }, [applyTransform]);

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    
    // Normalizar y reanudar
    positionRef.current = normalizePosition(positionRef.current);
    applyTransform(positionRef.current);
    setIsPaused(false);
    
    if (trackRef.current) {
      trackRef.current.style.cursor = 'grab';
    }
  }, [normalizePosition, applyTransform]);

  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) {
      handleMouseUp();
    }
  }, [handleMouseUp]);

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
        {/* Flecha izquierda - SIEMPRE VISIBLE */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 shadow-md border-slate-200 dark:border-slate-700"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Flecha derecha - SIEMPRE VISIBLE */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 shadow-md border-slate-200 dark:border-slate-700"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Contenedor */}
        <div 
          ref={containerRef}
          className="overflow-hidden"
          onMouseEnter={() => !isDraggingRef.current && setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            handleMouseLeave();
          }}
        >
          {/* Track con transform */}
          <div 
            ref={trackRef}
            className="flex gap-4 cursor-grab"
            style={{ width: 'max-content', willChange: 'transform' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {duplicatedItems.map((item, index) => {
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
                      <div className="cursor-pointer" onClick={() => setIsPaused(true)}>
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
