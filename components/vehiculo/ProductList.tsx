"use client";

import React from "react";
import { BrandStatus, BrandId } from "@/types/interface";
import ColeccionImage from "@/components/category-section/ColeccionImage";
import ProductDetailsSheet from "@/components/shared/ProductDetailsSheet";
import FavoriteButton from "@/components/shared/FavoriteButton";
import { SheetTrigger } from "@/components/ui/sheet";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useAuth } from "@clerk/nextjs";

interface ProductListProps {
  data: BrandStatus[] | BrandId[];
  sort?: string | null;
  slug?: string;
  productType?: string | null;
  selectedItem?: BrandStatus | BrandId | null;
}

export default function ProductList({
  data,
  sort,
  slug,
  selectedItem,
}: ProductListProps) {
  const { calculateTotalPrice, formatPrice } = usePriceCalculation();
  const { isSignedIn } = useAuth();

  // Calcular precios para todos los items
  const itemsWithPrices = data.map((item) => {
    // Calcular precios para retail y wholesale
    const retailCalc = calculateTotalPrice(item, false);
    const wholesaleCalc = calculateTotalPrice(item, true);

    return {
      ...item,
      calculatedPrices: retailCalc,
      hasStock: retailCalc.hasStock,
      retailPrice: retailCalc.finalTotalArs,
      wholesalePrice: wholesaleCalc.finalTotalArs,
      listPriceWithMarkup: retailCalc.listPriceWithMarkup,
    };
  });

  // Ordenar items según el parámetro sort
  const sortedItems = [...itemsWithPrices].sort((a, b) => {
    if (!sort) return 0;

    // Usar precio según autenticación para ordenar
    const priceA = isSignedIn ? a.wholesalePrice : a.retailPrice;
    const priceB = isSignedIn ? b.wholesalePrice : b.retailPrice;

    if (sort === "sort[asc]=finalTotalArs") {
      return (priceA || 0) - (priceB || 0);
    }
    if (sort === "sort[desc]=finalTotalArs") {
      return (priceB || 0) - (priceA || 0);
    }
    return 0;
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-4">
      {sortedItems.map((item) => (
        <ProductDetailsSheet
          key={item.id}
          item={item}
          slug={slug}
          openAutomatically={
            selectedItem?.supplier_product_id === item.supplier_product_id
          }
        >
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
                {!item.hasStock ? (
                  // Sin stock: mostrar precio list_price +50% en verde
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(item.listPriceWithMarkup || 0)}
                    </span>
                  </div>
                ) : isSignedIn ? (
                  // Autenticado: mostrar precio mayorista (+20%)
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(item.wholesalePrice || 0)}
                    </span>
                  </div>
                ) : (
                  // No autenticado: precio retail (+40%) con precio lista tachado
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(item.retailPrice || 0)}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(item.listPriceWithMarkup || 0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </SheetTrigger>
        </ProductDetailsSheet>
      ))}
    </div>
  );
}
