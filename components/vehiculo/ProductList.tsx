"use client";

import React, { useState, useEffect } from "react";
import { BrandStatus, BrandId } from "@/types/interface";
import ColeccionImage from "@/components/category-section/ColeccionImage";
import ProductDetailsSheet from "@/components/shared/ProductDetailsSheet";
import FavoriteButton from "@/components/shared/FavoriteButton";
import { SheetTrigger } from "@/components/ui/sheet";
import { getValorDolar } from "@/lib/brands";

interface ProductListProps {
  data: BrandStatus[] | BrandId[];
}

export default function ProductList({ data }: ProductListProps) {
  const [dolarBlue, setDolarBlue] = useState<number>(0);

  useEffect(() => {
    const fetchDolarValue = async () => {
      const value = await getValorDolar();
      setDolarBlue(value);
    };
    fetchDolarValue();
  }, []);

  const calculateTotalPrice = (item: BrandStatus | BrandId) => {
    if (!dolarBlue) return null;

    const weightInKg = item.weight ? item.weight / 2.205 : 0;
    const weightCost = weightInKg * 50;
    
    // Seleccionar el precio basado en el inventario
    const dealerPrice = item.inventory?.data?.total && item.inventory.data.total > 0 
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

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {data.map((item: BrandStatus | BrandId) => {
        const prices = calculateTotalPrice(item);
        const hasInventory = item.inventory?.data?.total && item.inventory.data.total > 0;
        
        return (
          <ProductDetailsSheet key={item.id} item={item}>
            <SheetTrigger asChild>
              <div className="border rounded-lg p-2 hover:shadow-lg transition-shadow flex flex-col relative animate-fade-in cursor-pointer">
                <div className="absolute top-2 left-2">
                  <div 
                    className={`w-3 h-3 rounded-full animate-pulse ${
                      hasInventory ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                </div>
                <div className="absolute top-2 right-2"></div>
                <ColeccionImage item={item} />
                <h2 className="text-sm font-semibold truncate">{item.name}</h2>
                {prices?.weightInKg > 0 && (
                  <span className="text-xs text-gray-600">
                    Peso: {prices.weightInKg.toFixed(2)} kg
                  </span>
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-green-600">
                    {hasInventory ? "$" : "$"}{prices.dealerPrice.toFixed(2)}
                  </span>
                  {prices?.weightInKg > 0 && (
                    <span className="text-xs text-orange-600">
                      Envío USD: ${prices.weightCost.toFixed(2)}
                    </span>
                  )}
                  {prices?.additionalCharge > 0 && (
                    <span className="text-xs text-red-600">
                      Recargo: {formatPrice(prices.additionalCharge)}
                    </span>
                  )}
                  <span className="text-xs text-red-600">
                    Shipping: {formatPrice(prices.shippingCharge)}
                  </span>
                  <span className="text-xs font-bold text-blue-600">
                    Total: {formatPrice(prices.finalTotalArs)}
                  </span>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Dólar Blue: ${dolarBlue}
                    </span>
                    <FavoriteButton item={item} />
                  </div>
                </div>
              </div>
            </SheetTrigger>
          </ProductDetailsSheet>
        );
      })}
    </div>
  );
}
