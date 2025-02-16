"use client";

import React, { useState, useEffect } from "react";
import { BrandStatus, BrandId } from "@/types/interface";
import ColeccionImage from "@/components/category-section/ColeccionImage";
import ProductDetailsSheet from "@/components/shared/ProductDetailsSheet";
import FavoriteButton from "@/components/shared/FavoriteButton";
import { SheetTrigger } from "@/components/ui/sheet";

interface ProductListProps {
  data: BrandStatus[] | BrandId[];
  sort?: string | null;
}

export default function ProductList({ data, sort }: ProductListProps) {
  const [dolarBlue, setDolarBlue] = useState<number>(
    parseFloat(process.env.NEXT_PUBLIC_DOLAR_BLUE!) || 1300
  );

  const calculateTotalPrice = (item: BrandStatus | BrandId) => {
    if (!dolarBlue) return null;

    const weightInKg = item.weight ? item.weight / 2.205 : 0;
    const weightCost = weightInKg * 50;

    // Seleccionar el precio basado en el inventario
    const dealerPrice =
      item.inventory?.data?.total && item.inventory.data.total > 0
        ? parseFloat(item.standard_dealer_price) || 0
        : parseFloat(item.list_price) || 0;

    const totalUsd = weightCost + dealerPrice;
    const totalArs = totalUsd * dolarBlue;

    // Calcular recargo adicional según el rango de precio
    let additionalCharge = 0;
    if (totalArs < 50000) {
      additionalCharge = 12000;
    } else if (totalArs >= 50000 && totalArs < 100000) {
      additionalCharge = 20000;
    } else if (totalArs >= 100000 && totalArs < 150000) {
      additionalCharge = 30000;
    } else if (totalArs >= 150000 && totalArs < 200000) {
      additionalCharge = 40000;
    } else if (totalArs >= 200000) {
      additionalCharge = 50000;
    }

    // Shipping fijo en ARS
    const shippingCharge = 14500;

    const finalTotalArs = totalArs + additionalCharge + shippingCharge;

    return {
      weightInKg,
      weightCost,
      dealerPrice,
      totalUsd,
      totalArs,
      additionalCharge,
      shippingCharge,
      finalTotalArs,
    };
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calcular precios para todos los items
  const itemsWithPrices = data.map(item => ({
    ...item,
    calculatedPrices: calculateTotalPrice(item)
  }));

  // Ordenar items según el parámetro sort
  const sortedItems = [...itemsWithPrices].sort((a, b) => {
    if (!sort) return 0;

    if (sort === 'sort[asc]=finalTotalArs') {
      return (a.calculatedPrices?.finalTotalArs || 0) - (b.calculatedPrices?.finalTotalArs || 0);
    }
    if (sort === 'sort[desc]=finalTotalArs') {
      return (b.calculatedPrices?.finalTotalArs || 0) - (a.calculatedPrices?.finalTotalArs || 0);
    }
    return 0;
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {sortedItems.map((item) => {
        return (
          <ProductDetailsSheet key={item.id} item={item}>
            <SheetTrigger asChild>
              <div className="border rounded-lg p-2 hover:shadow-lg transition-shadow flex flex-col relative animate-fade-in cursor-pointer">
                <div className="absolute top-2 right-2"></div>
                <ColeccionImage item={item} />
                <h2 className="text-sm font-semibold truncate">{item.name}</h2>

                <div className="flex flex-col gap-1">
                  {item.weight === 0 ? (
                    <div className="flex justify-between items-center gap-1">
                      <span className="text-sm font-bold text-green-600">
                        Consultar Precio
                      </span>
                      <FavoriteButton item={item} />
                    </div>
                  ) : (
                    <div className="flex justify-between items-center gap-1">
                      <span className="text-md font-bold">
                        {formatPrice(item.calculatedPrices?.finalTotalArs || 0)}
                      </span>
                      <FavoriteButton item={item} />
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
