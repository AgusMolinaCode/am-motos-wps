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

  if (slug.toLowerCase() !== "productos-nuevos" && slug.toLowerCase() !== "productos-ofertas") {
    return null;
  }

  // Función para obtener la traducción de un tipo de producto
  const getTranslation = (type: string) => {
    return (
      Product_Type_Translations[
        type as keyof typeof Product_Type_Translations
      ] || type
    );
  };

  // Ordenar los tipos más usados por su traducción
  const sortedMostUsedTypes = [...Most_Used_Types].sort((a, b) =>
    getTranslation(a).localeCompare(getTranslation(b), "es")
  );

  // Obtener y ordenar los tipos restantes por su traducción
  const remainingTypes = Object.keys(Product_Type_Translations)
    .filter((type) => !Most_Used_Types.includes(type))
    .sort((a, b) => getTranslation(a).localeCompare(getTranslation(b), "es"));

  const handleTypeChange = async (selectedType: string) => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());

    if (selectedType) {
      params.set("productType", encodeURIComponent(selectedType));
    } else {
      params.delete("productType");
    }

    params.delete("cursor");

    router.push(
      `/coleccion/${slug}${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  // Decodificar el tipo de producto seleccionado
  const decodedSelectedType = selectedProductType ? decodeURIComponent(selectedProductType) : "";

  return (
    <div className="mb-6 flex items-center space-x-4">
      <h1 className="text-3xl font-bold">
        {decodedSelectedType ? getTranslation(decodedSelectedType) : "Todos los Productos"}
      </h1>
      <label htmlFor="productType" className="text-sm font-medium">
        Filtrar por Tipo de Producto:
      </label>
      <div className="flex items-center gap-2">
        <select
          id="productType"
          className="border rounded px-2 py-1 text-sm"
          value={decodedSelectedType || ""}
          onChange={(e) => handleTypeChange(e.target.value)}
          disabled={isLoading}
        >
          {!decodedSelectedType && (
            <option value="">Todos los Tipos</option>
          )}
          {sortedMostUsedTypes.length > 0 && (
            <optgroup label="Tipos más usados">
              {sortedMostUsedTypes.map((type) => (
                <option key={type} value={type}>
                  {getTranslation(type)}
                </option>
              ))}
            </optgroup>
          )}
          {remainingTypes.length > 0 && (
            <optgroup label="Otros tipos">
              {remainingTypes.map((type) => (
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
