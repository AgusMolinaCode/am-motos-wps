"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import brandData from "@/public/csv/brand2.json";

interface CollectionFilterButtonsProps {
  slug: string;
  productType?: string;
  associatedBrands: string[];
}

const CollectionFilterButtons: React.FC<CollectionFilterButtonsProps> = ({ 
  slug, 
  productType, 
  associatedBrands 
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
    
    // Establecer el brandId
    params.set('brandId', brandId);
    
    // Si hay un productType, también lo incluimos
    if (encodedProductType) {
      params.set('productType', encodedProductType);
    }

    // Eliminar el cursor para comenzar desde el principio
    params.delete('cursor');

    // Navegar a la nueva URL sin recargar la página
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {associatedBrands.map((brandName: string) => {
        const brandId = brandMap[brandName];
        return brandId ? (
          <button
            key={brandId}
            onClick={() => handleBrandFilter(brandId)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            {brandName}
          </button>
        ) : null;
      })}
    </div>
  );
};

export default CollectionFilterButtons; 