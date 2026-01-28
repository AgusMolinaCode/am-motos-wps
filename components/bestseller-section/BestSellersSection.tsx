"use client";

import { getRecommendedItems } from "@/lib/brands";
import ColeccionImage from "../category-section/ColeccionImage";
import ProductDetailsSheet from "../shared/ProductDetailsSheet";
import FavoriteButton from "../shared/FavoriteButton";
import { SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { BrandStatus } from "@/types/interface";
import { Skeleton } from "@/components/ui/skeleton";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";

const CACHE_KEY = 'recommended_items_cache';
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutos

const ProductListSkeleton = () => (
  <div className="py-4 md:py-10">
    <Skeleton className="h-10 w-1/4" />
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  </div>
);

export default function BestSellersSection() {
  const [recommendedItems, setRecommendedItems] = useState<BrandStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const { calculateTotalPrice, formatPrice } = usePriceCalculation();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Intentar obtener datos del caché
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { items, timestamp } = JSON.parse(cachedData);
          const isExpired = Date.now() - timestamp > CACHE_DURATION;
          
          if (!isExpired) {
            setRecommendedItems(items);
            setLoading(false);
            return;
          }
        }

        // Si no hay caché o está expirado, obtener nuevos datos
        const items = await getRecommendedItems();
        
        // Guardar en caché
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          items: items.data,
          timestamp: Date.now()
        }));
        
        setRecommendedItems(items.data);
      } catch (error) {
        console.error("Error fetching recommended items:", error);
        
        // En caso de error, intentar usar caché aunque esté expirado
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { items } = JSON.parse(cachedData);
          setRecommendedItems(items);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  

  if (loading) {
    return <ProductListSkeleton />;
  }

  return (
    <div className="mx-auto pt-4 md:pt-10">
      <div className="flex justify-between gap-2 items-center mb-4">
        <h1 className="text-xl font-bold underline uppercase dark:text-gray-300 text-gray-800">
          Recomendados
        </h1>
      </div>

      {recommendedItems.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xl text-gray-600 dark:text-gray-300">
            No se encontraron productos recomendados
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {recommendedItems.map((item) => (
            <ProductDetailsSheet key={item.id} item={item}>
              <SheetTrigger asChild>
                <div className="border rounded-lg p-2 hover:shadow-lg transition-shadow flex flex-col relative animate-fade-in cursor-pointer">
                  <div className="absolute top-2 right-2">
                    <FavoriteButton item={item} />
                  </div>
                  <ColeccionImage item={item} />
                  <h2 className="text-sm font-semibold truncate">{item.name}</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    SKU: {item.supplier_product_id}
                  </p>

                  <div className="flex flex-col gap-1 mt-2">
                    {item.weight === 0 ? (
                      <div className="flex justify-between items-center gap-1">
                        <span className="text-sm font-bold text-green-600">
                          Consultar Precio
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="text-md font-bold text-green-600">
                          {formatPrice(calculateTotalPrice(item).finalTotalArs)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </SheetTrigger>
            </ProductDetailsSheet>
          ))}
        </div>
      )}
    </div>
  );
}
