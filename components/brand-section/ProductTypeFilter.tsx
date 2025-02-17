"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Product_Type_Translations, Most_Used_Types } from "@/constants";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ProductTypeFilterProps {
  slug: string;
  currentBrandProductTypes: string[];
  selectedProductType?: string | null;
}

export default function ProductTypeFilter({
  slug,
  currentBrandProductTypes,
  selectedProductType,
}: ProductTypeFilterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Efecto para detectar cambios en la URL y desactivar el loading
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  // Si no hay tipos de productos, no mostrar el filtro
  if (!currentBrandProductTypes.length) return null;

  // Función para obtener la traducción de un tipo de producto
  const getTranslation = (type: string) => {
    return Product_Type_Translations[type] || type;
  };

  // Ordenar los tipos por su traducción
  const sortedTypes = [...currentBrandProductTypes].sort((a, b) =>
    getTranslation(a).localeCompare(getTranslation(b), "es")
  );

  // Separar los tipos más usados y los demás
  const mostUsedTypes = sortedTypes.filter(type => Most_Used_Types.includes(type));
  const otherTypes = sortedTypes.filter(type => !Most_Used_Types.includes(type));

  const handleTypeChange = async (selectedType: string) => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());

    if (selectedType) {
      params.set("productType", encodeURIComponent(selectedType));
    } else {
      params.delete("productType");
    }

    params.delete("cursor");

    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  // Decodificar el tipo de producto seleccionado
  const decodedSelectedType = selectedProductType ? decodeURIComponent(selectedProductType) : "";

  return (
    <div className="mb-6 flex items-center space-x-4">
      <label htmlFor="productType" className="text-sm font-medium">
        Filtrar por Tipo de Producto:
      </label>
      <div className="flex items-center gap-2 flex-1">
        <select
          id="productType"
          className="w-full md:w-[380px] p-2 border rounded-lg bg-white dark:bg-gray-800"
          value={decodedSelectedType || ""}
          onChange={(e) => handleTypeChange(e.target.value)}
          disabled={isLoading}
        >
          <option value="">Todos los Tipos</option>
          {mostUsedTypes.length > 0 && (
            <optgroup label="Tipos más usados">
              {mostUsedTypes.map((type) => (
                <option key={type} value={type}>
                  {getTranslation(type)}
                </option>
              ))}
            </optgroup>
          )}
          {otherTypes.length > 0 && (
            <optgroup label="Otros tipos">
              {otherTypes.map((type) => (
                <option key={type} value={type}>
                  {getTranslation(type)}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
      </div>
      {decodedSelectedType && (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
          onClick={() => handleTypeChange("")}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Reset
        </button>
      )}
    </div>
  );
}
