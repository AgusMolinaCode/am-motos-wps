import React, { Suspense } from "react";
import { getStatusItems, getCollectionByProductType } from "@/lib/brands";
import { BrandStatus, Meta } from "@/types/interface";
import ProductTypeFilter from "@/components/brand-section/ProductTypeFilter";
import productBrands from "@/public/csv/product_brands.json";
import BrandFilterButtons from "../../../../components/category-section/CollectionFilterButtons";
import { productTypeMap, ProductTypeUrlReverseMap } from "@/constants";
import CursorPage from "@/components/cursor-page/CursorPage";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";

const ProductList = dynamic(() => import("@/components/vehiculo/ProductList"), {
  loading: () => <ProductListSkeleton />,
});

// Componente Skeleton para la carga
const ProductListSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="border rounded-lg p-4 space-y-4 bg-red-100">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    ))}
  </div>
);

export const revalidate = 0;

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const slug = params.slug;
  const collectionName = slug === "productos-nuevos"
    ? "Productos Nuevos"
    : slug === "productos-ofertas"
    ? "Ofertas Especiales"
    : slug.replace(/-/g, " ");

  return {
    title: `AM MOTOS - ${collectionName}`,
    description: `Venta de repuestos, accesorios e indumentaria para motos - ATV en la colección ${collectionName}`,
    openGraph: {
      title: `AM MOTOS - ${collectionName}`,
      description: `Venta de repuestos, accesorios e indumentaria para motos - ATV en la colección ${collectionName}`,
      images: "/favicon.ico",
    },
  };
};

export default async function CollectionPage({
  params,
  searchParams,
}: PageProps) {
  const slug = params.slug;

  // Obtener el tipo de producto original en inglés si existe una traducción
  const originalProductType =
    ProductTypeUrlReverseMap[
      slug.toLowerCase() as keyof typeof ProductTypeUrlReverseMap
    ] || slug;

  // Codificar correctamente el productType
  const productType =
    typeof searchParams.productType === "string"
      ? searchParams.productType.replace(/&/g, "%26")
      : "";

  // Obtener el brandId de los searchParams
  const brandId =
    typeof searchParams.brandId === "string" ? searchParams.brandId : undefined;

  // Codificar correctamente el cursor
  const cursor =
    typeof searchParams.cursor === "string"
      ? searchParams.cursor.replace(/&/g, "%26")
      : null;

  let data: BrandStatus[] = [];
  let meta: Meta = {
    cursor: {
      current: '',
      prev: null,
      next: null,
      count: 0,
    },
  };
  let availableProductTypes: string[] = [];

  if (slug === "productos-nuevos" || slug === "productos-ofertas") {
    // Obtener los datos de la colección NEW o CLO
    const result = await getStatusItems(
      slug === "productos-nuevos" ? "NEW" : "CLO",
      cursor,
      productType || undefined
    );
    data = result.data;
    meta = result.meta;
    // Obtener los tipos de productos disponibles
    availableProductTypes = meta.productTypes || [];
  } else {
    // Obtener los datos de una colección específica usando el tipo de producto original
    const result = await getCollectionByProductType(
      originalProductType,
      cursor,
      brandId
    );
    data = result.data;
    meta = result.meta;
  }

  // Obtener las marcas asociadas a los tipos de producto actuales
  const currentProductTypes = (
    productTypeMap[slug.toLowerCase()] || originalProductType
  ).split(",");
  const associatedBrands = currentProductTypes.reduce<string[]>((acc, type) => {
    const brands = productBrands[type as keyof typeof productBrands] || [];
    return [...acc, ...brands];
  }, []);

  // Eliminar duplicados en la lista de marcas
  const uniqueAssociatedBrands = Array.from(new Set(associatedBrands));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {slug === "productos-nuevos"
          ? "Productos Nuevos"
          : slug === "productos-ofertas"
          ? "Ofertas Especiales"
          : slug.replace(/-/g, " ")}
      </h1>

      {/* Mostrar siempre el selector de tipos de producto */}
      <ProductTypeFilter
        slug={slug}
        currentBrandProductTypes={availableProductTypes}
        selectedProductType={productType}
      />

      {/* Mostrar botones para filtrar por brand_id si no es NEW o CLO */}
      {slug !== "productos-nuevos" &&
        slug !== "productos-ofertas" &&
        uniqueAssociatedBrands.length > 0 && (
          <BrandFilterButtons
            slug={slug}
            productType={productType}
            associatedBrands={uniqueAssociatedBrands}
          />
        )}

      {data.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 rounded-lg">
          <p className="text-xl text-gray-600">No se encontraron productos</p>
        </div>
      ) : (
        <>
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList data={data} />
          </Suspense>

          <CursorPage
            meta={meta}
            slug={slug}
            productType={productType}
            brandId={brandId}
            vehicleId={""}
          />
        </>
      )}
    </div>
  );
}
