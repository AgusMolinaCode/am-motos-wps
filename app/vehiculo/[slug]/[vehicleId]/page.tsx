import React, { Suspense } from "react";
import { getVehicleItems } from "@/lib/brands";
import ColeccionImage from "@/components/category-section/ColeccionImage";
import ProductDetailsSheet from "@/components/shared/ProductDetailsSheet";
import CursorPage from "@/components/cursor-page/CursorPage";
import PopularProductsTypes from "@/components/vehiculo/PopularProductsTypes";
import OfferBanner from "@/components/vehiculo/OfferBanner";
import SortBy from "@/components/vehiculo/SortBy";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Importar ProductList de manera dinámica
const ProductList = dynamic(() => import("@/components/vehiculo/ProductList"), {
  loading: () => <ProductListSkeleton />
});

// Componente Skeleton para la carga
const ProductListSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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

interface PageProps {
  params: {
    slug: string;
    vehicleId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params, searchParams }: PageProps) {
  const [make, model, year] = params.slug
    .split("-")
    .map((part) => part.replace(/\b\w/g, (c) => c.toUpperCase()));
  const cursor =
    typeof searchParams["cursor"] === "string" ? searchParams["cursor"] : null;
  const productType =
    typeof searchParams["filter[product_type]"] === "string"
      ? searchParams["filter[product_type]"]
      : null;
  const sort = 
    typeof searchParams["sort"] === "string"
      ? searchParams["sort"]
      : null;

  const result = await getVehicleItems(params.vehicleId, cursor, productType, sort);
  const vehicleItems = result.data;
  const meta = result.meta;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold capitalize">
          {make} {model} {year}
        </h1>
        <SortBy />
      </div>

      <div className="flex gap-6">
        <PopularProductsTypes />

        <div className="flex-1">
          {/* <OfferBanner /> */}

          {vehicleItems.length === 0 ? (
            <div className="text-center py-10 bg-gray-100 rounded-lg">
              <p className="text-xl text-gray-600">
                No se encontraron productos
              </p>
            </div>
          ) : (
            <>
              <Suspense fallback={<ProductListSkeleton />}>
                <ProductList data={vehicleItems} />
              </Suspense>

              <CursorPage
                meta={meta}
                slug={params.slug}
                vehicleId={params.vehicleId}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
