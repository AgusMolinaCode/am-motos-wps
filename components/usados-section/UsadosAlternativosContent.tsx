"use client";

import React, { useState } from "react";
import FavoriteButton from "@/components/shared/FavoriteButton";
import Image from "next/image";
import ProductDetailsSheet from "@/components/shared/ProductDetailsSheet";
import { SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UsadosAlternativosContentProps {
  initialItems: any[];
  categorias: string[];
}

export function UsadosAlternativosContent({
  initialItems,
  categorias,
}: UsadosAlternativosContentProps) {
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(
    null
  );
  const [filteredItems, setFilteredItems] = useState(initialItems);

  const handleCategoriaChange = (categoria: string | null) => {
    setSelectedCategoria(categoria);

    if (categoria) {
      const filtered = initialItems.filter(
        (item) => item.categoria === categoria
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(initialItems);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-3xl font-bold">Usados y Alternativos</h1>

        <div className="flex items-center space-x-2 w-[112px] md:w-[200px]">
          <Select
            value={selectedCategoria || "all"}
            onValueChange={(value) =>
              handleCategoriaChange(value === "all" ? null : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="text-sm" key="all" value="all">
                Todas
              </SelectItem>
              {categorias.map((categoria) => (
                <SelectItem
                  className="text-sm"
                  key={categoria}
                  value={categoria}
                >
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
        {filteredItems.map((item) => (
          <ProductDetailsSheet key={item.id} item={item} isUsedItem={true}>
            <SheetTrigger asChild>
              <div className="border rounded-lg p-2 hover:shadow-lg transition-shadow flex flex-col relative animate-fade-in cursor-pointer">
                <div className="absolute top-2 right-2">
                  <FavoriteButton item={item} isUsedItem={true} />
                </div>
                {item.images.data && item.images.data.length > 0 ? (
                  <Image
                    src={
                      item.images.data[0].domain
                        ? `https://${item.images.data[0].domain}${item.images.data[0].path}${item.images.data[0].filename}`
                        : item.images.data[0].filename
                    }
                    alt={item.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-contain rounded-lg mb-2"
                  />
                ) : (
                  <Image
                    src="https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                    alt="Placeholder Image"
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                )}
                <h2 className="text-sm font-semibold truncate">{item.name}</h2>
                <p className="text-xs text-gray-600">
                  SKU:{" "}
                  {item.supplier_product_id.length > 32
                    ? `${item.supplier_product_id.slice(0, 32)}...`
                    : item.supplier_product_id}
                </p>
                <p className="text-xs text-gray-500">
                  Categoría: {item.categoria}
                </p>

                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-md font-bold text-green-600">
                      {item.priceFormatted}
                    </span>
                  </div>
                </div>
              </div>
            </SheetTrigger>
          </ProductDetailsSheet>
        ))}
      </div>
    </div>
  );
}
