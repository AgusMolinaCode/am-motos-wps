"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Product_Type_Translations, Most_Used_Types } from "@/constants";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

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

    if (selectedType === "all") {
      params.delete("productType");
    } else {
      params.set("productType", encodeURIComponent(selectedType));
    }

    // Resetear página a 1 al cambiar filtro
    params.delete("cursor");
    params.delete("page");

    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  // Decodificar el tipo de producto seleccionado
  const currentValue = selectedProductType ? decodeURIComponent(selectedProductType) : "all";

  return (
    <div className="mb-6 flex items-center space-x-4">
      <label htmlFor="productType" className="text-sm font-medium">
        Filtrar por Tipo de Producto:
      </label>
      <div className="flex items-center gap-2 flex-1">
        <Select value={currentValue} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full md:w-[380px]">
            <SelectValue placeholder="Todos los Tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Tipos</SelectItem>
            {mostUsedTypes.length > 0 && (
              <SelectGroup>
                <SelectLabel>Tipos más usados</SelectLabel>
                {mostUsedTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {getTranslation(type)}
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
            {otherTypes.length > 0 && (
              <SelectGroup>
                <SelectLabel>Otros tipos</SelectLabel>
                {otherTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {getTranslation(type)}
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
          </SelectContent>
        </Select>
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
      </div>
    </div>
  );
}
