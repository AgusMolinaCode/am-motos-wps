import { getBrandsItems, getBrandName } from "@/lib/brands";
import { BrandId } from "@/types/interface";
import React, { Suspense } from "react";
import Link from "next/link";
import { getCatalogProductTypes } from "@/lib/actions";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import brandData from "@/public/csv/brand2.json";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Importar ProductList de manera dinámica
const ProductList = dynamic(() => import("@/components/vehiculo/ProductList"), {
  loading: () => <ProductListSkeleton />
});

// Componente Skeleton para la carga
const ProductListSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="border rounded-lg p-4 space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    ))}
  </div>
);

export const fetchCache = "force-dynamic";

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BrandPage({ params, searchParams }: PageProps) {
  const slug = params.slug;

  // Función para obtener el ID de la marca desde el slug
  const getBrandIdFromSlug = (slug: string) => {
    // Si el slug es un número, es un ID directo
    if (!isNaN(Number(slug))) {
      return slug;
    }

    // Buscar la marca por nombre en el archivo brand2.json
    const brand = brandData.find(
      (brand) =>
        brand.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
    );

    return brand ? brand.id.toString() : slug;
  };

  const brandId = getBrandIdFromSlug(slug);

  // Codificar correctamente el productType
  const productType =
    typeof searchParams.productType === "string"
      ? searchParams.productType.replace(/&/g, "%26")
      : undefined;

  // Codificar correctamente el cursor
  const cursor =
    typeof searchParams.cursor === "string"
      ? searchParams.cursor.replace(/&/g, "%26")
      : null;

  // Obtener el nombre de la marca
  const brandName = await getBrandName(brandId);

  // Obtener los datos de la marca
  const { data, meta } = await getBrandsItems(brandId, cursor, productType);

  // Obtener todos los product types
  const brandProductTypes = await getCatalogProductTypes();

  // Obtener los product types del brand actual usando el ID
  const currentBrandProductTypes = brandProductTypes[Number(brandId)] || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">Marca: {brandName}</h1>

      {currentBrandProductTypes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Tipos de Productos</h2>
          <div className="flex flex-col gap-2">
            {currentBrandProductTypes.map((type) => (
              <Link
                href={`/brand/${slug}?productType=${encodeURIComponent(type)}`}
                key={type}
              >
                {type}
              </Link>
            ))}
          </div>
        </div>
      )}

      {data.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 rounded-lg">
          <p className="text-xl text-gray-600">
            No se encontraron productos en stock para esta marca
          </p>
        </div>
      ) : (
        <>
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList data={data} />
          </Suspense>

          <div className="flex justify-center mt-6 gap-4">
            {meta?.cursor?.prev && (
              <div className="flex justify-center mt-6">
                <Link
                  href={`/brand/${slug}${
                    productType ? `?productType=${productType}&` : "?"
                  }cursor=${meta.cursor.prev.replace(/&/g, "%26")}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                </Link>
              </div>
            )}

            {meta?.cursor?.next && (
              <div className="flex justify-center mt-6">
                <Link
                  href={`/brand/${slug}${
                    productType ? `?productType=${productType}&` : "?"
                  }cursor=${meta.cursor.next.replace(/&/g, "%26")}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
