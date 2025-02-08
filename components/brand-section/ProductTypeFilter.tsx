"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Product_Type_Translations, Most_Used_Types } from "@/constants";

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
  if (slug.toLowerCase() !== "productos-nuevos" && slug.toLowerCase() !== "productos-ofertas") {
    return null;
  }

  const router = useRouter();
  const searchParams = useSearchParams();

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

  const handleTypeChange = (selectedType: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedType) {
      // Establecer solo el tipo de producto y eliminar el cursor
      params.set("productType", encodeURIComponent(selectedType));
    } else {
      params.delete("productType");
    }

    // Eliminar el cursor
    params.delete("cursor");

    // Navegamos a la URL sin el cursor
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
      <select
        id="productType"
        className="border rounded px-2 py-1 text-sm"
        value={decodedSelectedType || ""}
        onChange={(e) => handleTypeChange(e.target.value)}
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
      {decodedSelectedType && (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => handleTypeChange("")}
        >
          Reset
        </button>
      )}
    </div>
  );
}
