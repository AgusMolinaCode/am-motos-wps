"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import popularProductTypes from "@/public/csv/PopularProductTypes.json";
import productTypes from "@/public/csv/ProductTypes.json";
import { Separator } from "@/components/ui/Separator";

const PopularProductsTypes = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentProductType = searchParams.get("filter[product_type]");

  const handleProductTypeClick = (productType: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get("filter[product_type]") === productType) {
      params.delete("filter[product_type]");
    } else {
      params.set("filter[product_type]", productType);
    }

    params.delete("cursor");
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Filtrar los tipos de productos que no están en popularProductTypes
  const otherProductTypes = productTypes.filter(
    (type) =>
      !popularProductTypes.some((popularType) => popularType.name === type.name)
  );

  return (
    <div className="w-64 h-full bg-gray-100 dark:bg-gray-800 p-2">
      <div className="sticky h-[calc(100vh-1rem)]">
        <div className="flex flex-col h-full">
          {/* Contenedor scrolleable */}
          <div className="flex-1 overflow-y-auto pr-2">
            {/* Tipos populares */}
            {/* Botón de limpiar filtro fijo en la parte inferior */}
            {currentProductType && (
              <div className="">
                <button
                  onClick={() => handleProductTypeClick(currentProductType)}
                  className="w-full px-4 py-1 text-sm bg-red-500/50 text-white rounded-lg hover:bg-red-600/80 transition-colors"
                >
                  Limpiar filtro
                </button>
              </div>
            )}
            <h2 className="text-lg font-bold mb-4">Tipos Populares</h2>
            <div className="flex flex-col gap-2 mb-2">
              {popularProductTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleProductTypeClick(type.name)}
                  className={`text-left px-3 py-1 rounded-lg text-sm transition-colors ${
                    currentProductType === type.name
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {type.name_translated}
                </button>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Otros tipos */}
            <h2 className="text-lg font-bold mb-4">Otros Tipos</h2>
            <div className="flex flex-col gap-2">
              {otherProductTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleProductTypeClick(type.name)}
                  className={`text-left px-3 py-1 rounded-lg text-sm transition-colors ${
                    currentProductType === type.name
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {type.name_translated}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularProductsTypes;
