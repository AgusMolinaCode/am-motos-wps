"use client";

import React, { useEffect, useState } from "react";
import ColeccionImage from "@/components/category-section/ColeccionImage";
import ProductDetailsSheet from "@/components/shared/ProductDetailsSheet";
import FavoriteButton from "@/components/shared/FavoriteButton";
import { useRouter } from "next/navigation";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { SheetTrigger } from "@/components/ui/sheet";

interface Item {
  id: number;
  name: string;
  brand_id: number;
  supplier_product_id: string;
  standard_dealer_price: string;
  list_price: string;
  weight: number;
  inventory?: {
    data?: {
      total?: number;
    };
  };
  images?: {
    data?: {
      domain: string;
      path: string;
      filename: string;
    }[];
  };
}

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<Item[]>([]);
  const router = useRouter();
  const { calculateTotalPrice, formatPrice } = usePriceCalculation();

  const itemsWithPrices = favorites.map((item) => ({
    ...item,
    calculatedPrices: calculateTotalPrice(item as any),
  }));

  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );
      const processedFavorites = storedFavorites.map((item: any) => ({
        ...item,
        brand_id: Number(item.brand_id),
      }));
      setFavorites(processedFavorites);
    };

    loadFavorites();

    const handleFavoriteChange = () => {
      loadFavorites();
      router.refresh();
    };

    window.addEventListener("favoriteChange", handleFavoriteChange);
    return () =>
      window.removeEventListener("favoriteChange", handleFavoriteChange);
  }, [router]);

  if (favorites.length === 0) {
    return (
      <div className="mx-auto px-4 py-8 min-h-[30vh]">
        <h1 className="text-3xl font-bold mb-6">Mis Favoritos</h1>
        <div className="text-center py-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xl text-gray-600 dark:text-gray-300">
            No tienes productos favoritos guardados
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mis Favoritos</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {itemsWithPrices.map((item) => {
          return (
            <ProductDetailsSheet key={item.id} item={item}>
              <SheetTrigger asChild>
                <div className="border rounded-lg p-2 hover:shadow-lg transition-shadow flex flex-col relative animate-fade-in cursor-pointer">
                  <div className="absolute top-2 right-2">
                    <FavoriteButton item={item} />
                  </div>
                  <ColeccionImage item={item} />
                  <h2 className="text-sm font-semibold truncate">
                    {item.name}
                  </h2>
                  <p className="text-xs text-gray-600">
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
                          {formatPrice(item.calculatedPrices?.finalTotalArs || 0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </SheetTrigger>
            </ProductDetailsSheet>
          );
        })}
      </div>
    </div>
  );
}
