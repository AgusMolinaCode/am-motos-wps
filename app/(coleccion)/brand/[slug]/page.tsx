import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { getBrandsItems, getBrandName, getProductByPartNumber } from "@/lib/brands";
import { getCatalogProductTypes } from "@/lib/actions";
import brandData from "@/public/csv/brand2.json";
import ProductTypeFilter from "@/components/brand-section/ProductTypeFilter";
import { SimplePagination } from "@/components/cursor-page/SimplePagination";

// Dynamic import para ProductList
const ProductList = dynamic(() => import("@/components/vehiculo/ProductList"), {
  loading: () => <ProductListSkeleton />,
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

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Función para obtener el ID de la marca desde el slug
const getBrandIdFromSlug = (slug: string) => {
  if (!isNaN(Number(slug))) {
    return slug;
  }

  const brand = brandData.find(
    (brand) =>
      brand.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
  );

  return brand ? brand.id.toString() : slug;
};

/**
 * Generate metadata - Optimizado con caché
 */
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const brandId = getBrandIdFromSlug(slug);
  const brandName = await getBrandName(brandId);
  
  return {
    title: `AM MOTOS - ${brandName}`,
    description: `Venta de repuestos, accesorios e indumentaria para motos - ATV de la marca ${brandName}`,
    openGraph: {
      title: `AM MOTOS - ${brandName}`,
      description: `Venta de repuestos, accesorios e indumentaria para motos - ATV de la marca ${brandName}`,
      images: "/favicon.ico",
    },
  };
};

/**
 * Revalidar cada 5 minutos (300 segundos)
 * Los datos de productos no cambian constantemente,
 * pero queremos un balance entre fresh data y performance.
 * 
 * Regla aplicada: server-cache-lru
 */
export const revalidate = 300;

/**
 * Brand Page - Optimizada
 * 
 * - Suspense boundaries para streaming
 * - Paralelización de fetches independientes
 * - Caché con revalidate
 */
export default async function BrandPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const brandId = getBrandIdFromSlug(slug);

  // Codificar correctamente el productType
  const productType =
    typeof resolvedSearchParams.productType === "string"
      ? resolvedSearchParams.productType.replace(/&/g, "%26")
      : undefined;

  // Obtener página actual
  const page = typeof resolvedSearchParams.page === "string"
    ? parseInt(resolvedSearchParams.page)
    : 1;

  // Paralelizar fetches independientes
  // Regla aplicada: async-parallel
  const [brandName, { data: rawData, total }, brandProductTypes] = await Promise.all([
    getBrandName(brandId),
    getBrandsItems(brandId, productType, page),
    getCatalogProductTypes(),
  ]);

  // Obtener los product types del brand actual usando el ID
  const currentBrandProductTypes = brandProductTypes[Number(brandId)] || [];

  // Verificar si hay un producto seleccionado por query param
  const selectedPartNumber = typeof resolvedSearchParams.item === "string"
    ? resolvedSearchParams.item
    : undefined;

  // Obtener item seleccionado si existe (lazy - solo si es necesario)
  let selectedItem = null;
  if (selectedPartNumber) {
    selectedItem = await getProductByPartNumber(selectedPartNumber);
  }

  // Crear una copia de los datos para poder modificarlos
  let data = [...rawData];

  // Si hay un item seleccionado y no está en la lista, agregarlo
  if (selectedItem) {
    const itemExists = data.some(
      (item) => item.supplier_product_id === selectedItem?.supplier_product_id
    );
    if (!itemExists) {
      data.unshift(selectedItem);
    }
  }

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 uppercase">{brandName}</h1>

      {currentBrandProductTypes.length > 0 && (
        <ProductTypeFilter
          slug={slug}
          currentBrandProductTypes={currentBrandProductTypes}
          selectedProductType={productType}
        />
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
            <ProductList
              data={data}
              slug={slug}
              selectedItem={selectedItem || undefined}
            />
          </Suspense>
          <SimplePagination
            currentPage={page}
            totalPages={Math.ceil(total / 30)}
            basePath={`/brand/${slug}`}
            productType={productType}
          />
        </>
      )}
    </div>
  );
}
