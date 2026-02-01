"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import popularProductTypes from "@/public/csv/PopularProductTypes.json";
import productTypes from "@/public/csv/ProductTypes.json";
import { Separator } from "@/components/ui/Separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";

const PopularProductsTypes = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentProductType = searchParams.get("filter[product_type]");

  const handleProductTypeClick = (productType: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (productType === "clear" || params.get("filter[product_type]") === productType) {
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

  // Vista móvil (select)
  const MobileView = () => (
    <div className="block lg:hidden">
      <Select value={currentProductType || "default"} onValueChange={handleProductTypeClick}>
        <SelectTrigger className="w-[238px]">
          <SelectValue placeholder="Filtrar por tipo" />
        </SelectTrigger>
        <SelectContent>
          {currentProductType && (
            <>
              <SelectItem value="clear">Limpiar filtro</SelectItem>
              <SelectSeparator />
            </>
          )}
          <SelectGroup>
            <SelectLabel>Tipos Populares</SelectLabel>
            <SelectItem value="default">Seleccionar</SelectItem>
            {popularProductTypes.map((type) => (
              <SelectItem key={type.id} value={type.name}>
                {type.name_translated}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Otros Tipos</SelectLabel>
            {otherProductTypes.map((type) => (
              <SelectItem key={type.id} value={type.name}>
                {type.name_translated}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );

  // Vista desktop
  const DesktopView = () => (
    <div className="hidden lg:block w-48 lg:w-72 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
      <div className="flex flex-col">
        {currentProductType && (
          <button
            onClick={() => handleProductTypeClick(currentProductType)}
            className="w-full px-4 py-1 text-sm bg-red-500/50 text-white rounded-lg hover:bg-red-600/80 transition-colors mb-2"
          >
            Limpiar filtro
          </button>
        )}
        <h2 className="text-lg font-bold mb-4">Tipos Populares</h2>
        <div className="flex flex-col gap-2 mb-4">
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
  );

  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  );
};

export default PopularProductsTypes;
