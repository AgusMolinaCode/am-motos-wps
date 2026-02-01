"use client";

import React, { useState } from "react";
import FavoriteButton from "@/components/shared/FavoriteButton";
import Image from "next/image";
import { SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupabaseProductItem } from "@/app/usados-alternativos/page";

export function UsadosAlternativosContent({
  initialItems,
  categorias,
}: {
  initialItems: SupabaseProductItem[];
  categorias: string[];
}) {
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(
    null
  );
  const [filteredItems, setFilteredItems] = useState(initialItems);

  const handleCategoriaChange = (categoria: string | null) => {
    setSelectedCategoria(categoria);

    if (categoria) {
      const filtered = initialItems.filter(
        (item) => item.category === categoria
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(initialItems);
    }
  };

  const placeholderUrl =
    "https://media.istockphoto.com/id/1396814518/es/vector/imagen-pr%C3%B3ximamente-sin-foto-sin-imagen-en-miniatura-disponible-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=aA0kj2K7ir8xAey-SaPc44r5f-MATKGN0X0ybu_A774=";

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
        {filteredItems && filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-2 hover:shadow-lg transition-shadow flex flex-col relative animate-fade-in">
              <div className="absolute top-2 right-2 z-10">
                <FavoriteButton item={item} />
              </div>
              {item.imagenes && item.imagenes[0] ? (
                <Image
                  src={item.imagenes[0]}
                  alt={item.titulo}
                  width={300}
                  height={300}
                  className="w-full h-48 object-contain rounded-lg mb-2"
                  unoptimized={true}
                />
              ) : (
                <Image
                  src={placeholderUrl}
                  alt={item.titulo || "Imagen no disponible"}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
              )}
              <h2 className="text-sm font-semibold truncate">
                {item.titulo}
              </h2>
              <p className="text-xs text-gray-600">
                SKU:{" "}
                {item.modelo?.toString().length > 32
                  ? `${item.modelo.toString().slice(0, 32)}...`
                  : item.modelo?.toString() || "N/A"}
              </p>
              <p className="text-xs text-gray-500">
                Categoría: {item.category}
              </p>

              <div className="flex flex-col gap-1 mt-2">
                <div className="flex flex-col gap-1">
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
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No hay productos disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
}
