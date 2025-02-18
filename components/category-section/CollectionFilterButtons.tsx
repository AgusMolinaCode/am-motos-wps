"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import brandData from "@/public/csv/brand2.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CollectionFilterButtonsProps {
  slug: string;
  productType?: string;
  associatedBrands: string[];
}

const CollectionFilterButtons: React.FC<CollectionFilterButtonsProps> = ({
  slug,
  productType,
  associatedBrands,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mapear los nombres de marcas a sus IDs
  const brandMap = Object.fromEntries(
    brandData.map(brand => [brand.name, brand.id.toString()])
  );

  // Mapa de tipos de producto para colecciones específicas
  const productTypeMap: Record<string, string> = {
    'motor': 'Engine,Piston kits & Components',
    'accesorios': 'Accessories',
    'indumentaria': 'Pants,Jerseys,Footwear,Gloves,Eyewear',
    'cascos': 'Helmets',
    'proteccion': 'Protective/Safety,Luggage',
    'herramientas': 'Tools',
    'casual': 'Vests,Sweaters,Suits,Socks,Shorts,Shoes,Jackets,Hoodies,Bags,Luggage'
  };

  // Si productType es undefined, usar el tipo de producto de la colección
  const encodedProductType = productType 
    ? encodeURIComponent(productType)
    : productTypeMap[slug.toLowerCase()] 
      ? encodeURIComponent(productTypeMap[slug.toLowerCase()])
      : undefined;

  const handleBrandFilter = (brandId: string) => {
    // Crear un nuevo objeto URLSearchParams
    const params = new URLSearchParams(searchParams.toString());
    
    if (brandId === "all") {
      // Si seleccionamos "Todas las Marcas", eliminar el filtro
      params.delete('brandId');
    } else {
      // Establecer el brandId
      params.set('brandId', brandId);
      
      // Si hay un productType, también lo incluimos
      if (encodedProductType) {
        params.set('productType', encodedProductType);
      }
    }

    // Eliminar el cursor para comenzar desde el principio
    params.delete('cursor');

    // Navegar a la nueva URL sin recargar la página
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Ordenar las marcas alfabéticamente
  const sortedBrands = [...associatedBrands].sort((a, b) => a.localeCompare(b));

  // Obtener el brandId actual de los parámetros de búsqueda
  const currentBrandId = searchParams.get('brandId') || 'all';

  return (
    <div className="mb-6 flex items-center space-x-4">
      <label htmlFor="brandFilter" className="text-sm font-medium">
        Filtrar por Marca:
      </label>
      <div className="flex items-center gap-2 flex-1">
        <Select value={currentBrandId} onValueChange={handleBrandFilter}>
          <SelectTrigger className="w-full md:w-[380px]">
            <SelectValue placeholder="Todas las Marcas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Marcas</SelectItem>
            {sortedBrands.map((brandName: string) => {
              const brandId = brandMap[brandName];
              return brandId ? (
                <SelectItem key={brandId} value={brandId}>
                  {brandName}
                </SelectItem>
              ) : null;
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CollectionFilterButtons; 