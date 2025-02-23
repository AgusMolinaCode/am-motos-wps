"use client";

import React from "react";
import { BrandStatus, BrandId } from "@/types/interface";
import ColeccionImage from "@/components/category-section/ColeccionImage";
import ProductDetailsSheet from "@/components/shared/ProductDetailsSheet";
import FavoriteButton from "@/components/shared/FavoriteButton";
import { SheetTrigger } from "@/components/ui/sheet";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";

interface ProductListProps {
  data: BrandStatus[] | BrandId[];
  sort?: string | null;
}

export default function ProductList({ data, sort }: ProductListProps) {
  const { calculateTotalPrice, formatPrice } = usePriceCalculation();

  // Calcular precios para todos los items
  const itemsWithPrices = data.map((item) => ({
    ...item,
    calculatedPrices: calculateTotalPrice(item),
  }));

  // Ordenar items según el parámetro sort
  const sortedItems = [...itemsWithPrices].sort((a, b) => {
    if (!sort) return 0;

    if (sort === "sort[asc]=finalTotalArs") {
      return (
        (a.calculatedPrices?.finalTotalArs || 0) -
        (b.calculatedPrices?.finalTotalArs || 0)
      );
    }
    if (sort === "sort[desc]=finalTotalArs") {
      return (
        (b.calculatedPrices?.finalTotalArs || 0) -
        (a.calculatedPrices?.finalTotalArs || 0)
      );
    }
    return 0;
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 md:gap-4">
      {sortedItems.map((item) => {
        const hasInventory =
          item.inventory?.data?.total && item.inventory.data.total > 0;

        return (
          <ProductDetailsSheet key={item.id} item={item}>
            <SheetTrigger asChild>
              <div className="border rounded-lg p-2 hover:shadow-lg transition-shadow flex flex-col relative animate-fade-in cursor-pointer">
                <div className="absolute top-2 right-2">
                  <FavoriteButton item={item} />
                </div>
                <ColeccionImage item={item} />
                <h2 className="text-sm font-semibold truncate">{item.name}</h2>
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
  );
}
