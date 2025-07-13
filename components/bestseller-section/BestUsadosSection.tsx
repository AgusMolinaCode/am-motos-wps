"use client";

import { getLatestUsedItems } from "@/lib/actions";
import ProductDetailsSheet from "../shared/ProductDetailsSheet";
import FavoriteButton from "../shared/FavoriteButton";
import { SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

const USED_CACHE_KEY = 'latest_used_items_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

const UsedProductsSkeleton = () => (
  <div className="py-4 md:py-10">
    <Skeleton className="h-10 w-1/4 mb-4" />
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {[...Array(3)].map((_, i) => (
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

const BestUsadosSection = () => {
  const [usedItems, setUsedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsedItems = async () => {
      try {
        // Obtener productos usados del caché
        const cachedUsed = localStorage.getItem(USED_CACHE_KEY);
        
        if (cachedUsed) {
          const { items, timestamp } = JSON.parse(cachedUsed);
          const isExpired = Date.now() - timestamp > CACHE_DURATION;
          
          if (!isExpired) {
            setUsedItems(items);
            setLoading(false);
            return;
          }
        }

        // Si no hay caché o está expirado, obtener nuevos datos
        const items = await getLatestUsedItems();
        
        // Guardar en caché
        localStorage.setItem(USED_CACHE_KEY, JSON.stringify({
          items,
          timestamp: Date.now()
        }));
        
        setUsedItems(items);
      } catch (error) {
        console.error("Error fetching used items:", error);
        
        // En caso de error, intentar usar caché aunque esté expirado
        const cachedUsed = localStorage.getItem(USED_CACHE_KEY);
        if (cachedUsed) {
          const { items } = JSON.parse(cachedUsed);
          setUsedItems(items);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsedItems();
  }, []);

  const UsedProductCard = ({ item }: { item: any }) => (
    <ProductDetailsSheet key={item.id} item={item} isUsedItem={true}>
      <SheetTrigger asChild>
        <div className="border rounded-lg p-2 hover:shadow-lg transition-shadow flex flex-col relative animate-fade-in cursor-pointer">
          <div className="absolute top-2 right-2">
            <FavoriteButton item={item} />
          </div>
          <div className="relative w-full h-48 mb-2">
            {item.imagenes && item.imagenes.length > 0 ? (
              <Image
                src={item.imagenes[0]}
                alt={item.titulo || item.name}
                fill
                className="object-contain rounded-md"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                <span className="text-gray-500 text-sm">Sin imagen</span>
              </div>
            )}
          </div>
          <h2 className="text-sm font-semibold truncate">{item.titulo || item.name}</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {item.marca} - {item.modelo}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {item.condicion} | {item.origen}
          </p>

          <div className="flex flex-col gap-1 mt-2">
            <div className="flex justify-between items-center gap-1">
              <span className="text-md font-bold text-green-600">
                {(item.preciopagina * 1000).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>
        </div>
      </SheetTrigger>
    </ProductDetailsSheet>
  );

  if (loading) {
    return <UsedProductsSkeleton />;
  }

  // No mostrar la sección si no hay productos usados
  if (usedItems.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto pt-4 md:pt-10">
      <div className="flex justify-between gap-2 items-center mb-4">
        <h1 className="text-2xl font-bold underline uppercase dark:text-gray-300 text-gray-800">
          Últimos Agregados
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {usedItems.map((item) => (
          <UsedProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default BestUsadosSection;