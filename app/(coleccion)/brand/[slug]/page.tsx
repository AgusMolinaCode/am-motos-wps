import { getBrands, getBrandsItems, getBrandName } from "@/lib/brands";
import { BrandId } from "@/types/interface";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getCatalogProductTypes } from "@/lib/actions";

interface PageProps {
  params: {
    slug: string;
  };
  searchParams?: { cursor?: string };
}

export default async function BrandPage({ 
  params,
  searchParams
}: PageProps) {
  const cursor = searchParams?.cursor || null;
  const { data, meta } = await getBrandsItems(params.slug, cursor);
  
  // Obtener el nombre de la marca
  const brandName = await getBrandName(params.slug);
  
  // Obtener todos los product types
  const brandProductTypes = await getCatalogProductTypes();
  
  // Buscar los product types del brand actual
  const currentBrandProductTypes = brandProductTypes[brandName] || [];

  const inventoryFilter = data.filter(item => item.inventory?.data?.total && item.inventory?.data?.total > 0);

  console.log(inventoryFilter);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        Marca: {brandName}
      </h1>
      
      {/* Mostrar los product types del brand actual */}
      {currentBrandProductTypes.length > 0 && (
        <div className="mb-6 bg-gray-900 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Tipos de Productos:</h2>
          <div className="flex flex-wrap gap-2">
            {currentBrandProductTypes.map((type, index) => (
              <span 
                key={index} 
                className="bg-zinc-700 text-blue-300 px-2 py-1 rounded-full text-sm"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 rounded-lg">
          <p className="text-xl text-gray-600">
            No se encontraron productos para esta marca
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {data.map((item: BrandId) => (
              <div 
                key={item.id} 
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col"
              >
                <h2 className="text-lg font-semibold mb-2 truncate">{item.name}</h2>
                <p className="text-sm text-gray-600 mb-1">SKU: {item.supplier_product_id}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-green-600">
                    ${item.standard_dealer_price}
                  </span>
                  <span className="text-sm text-blue-600">
                    Inventario: {item.inventory?.data?.total || 0}
                  </span>
                </div>
                {(item.images?.data?.length > 0) ? (
                  <Image
                    loading="lazy"
                    src={`https://${item.images.data[0].domain}${item.images.data[0].path}1000_max/${item.images.data[0].filename}`}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-contain mb-2"
                  />
                ) : (
                  <Image
                    loading="lazy"
                    src="https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                    alt={item.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-contain mb-2"
                  />
                )}
                <Link 
                  href={`/product/${item.id}`} 
                  className="mt-auto inline-block text-sm text-indigo-600 hover:underline text-center"
                >
                  Ver detalles
                </Link>
              </div>
            ))}
          </div>

          {meta?.cursor?.next && (
            <div className="flex justify-center mt-6">
              <Link 
                href={`/brand/${params.slug}?cursor=${meta.cursor.next}`}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Cargar más productos
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
