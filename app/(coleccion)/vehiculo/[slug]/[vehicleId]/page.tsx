import { getVehicleItems } from "@/lib/brands";
import React, { Suspense } from "react";
import PopularProductsTypes from "@/components/vehiculo/PopularProductsTypes";
import SortBy from "@/components/vehiculo/SortBy";
import Loading from "./loading";
import { Metadata } from "next";
import { CursorPagination } from "@/components/cursor-page/CursorPagination";
import ProductList from "./ProductList";

// Disable cache for Turbopack
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
    vehicleId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || "";
  const [make, model, year] = slug
    .split("-")
    .map((part) => part.replace(/\b\w/g, (c) => c.toUpperCase()));

  return {
    title: `AM MOTOS - ${make} ${model} ${year}`,
    description: `Venta de repuestos para ${make} ${model} ${year}`,
    openGraph: {
      title: `AM MOTOS - ${make} ${model} ${year}`,
      description: `Venta de repuestos para ${make} ${model} ${year}`,
      images: ["/favicon.ico"],
    },
  };
};

export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams.slug || "";
  const [make, model, year] = slug
    .split("-")
    .map((part) => part.replace(/\b\w/g, (c) => c.toUpperCase()));

  const cursor =
    typeof resolvedSearchParams["cursor"] === "string"
      ? resolvedSearchParams["cursor"]
      : null;
  const productType =
    typeof resolvedSearchParams["filter[product_type]"] === "string"
      ? resolvedSearchParams["filter[product_type]"]
      : null;
  const sort =
    typeof resolvedSearchParams["sort"] === "string"
      ? resolvedSearchParams["sort"]
      : null;

  return (
    <div className="container mx-auto md:px-4 py-4 md:py-8">
      <div className="flex justify-center mx-auto md:justify-between items-center mb-6">
        <h1 className="text-xl md:text-3xl font-bold text-center md:text-left capitalize">
          {make} {model} {year}
        </h1>
        <div className="hidden lg:flex">
          <SortBy />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="flex justify-between gap-2">
          <PopularProductsTypes />
          <div className="flex lg:hidden">
            <SortBy />
          </div>
        </div>

        <div className="flex-1">
          <Suspense fallback={<Loading />}>
            <ProductListContent
              vehicleId={resolvedParams.vehicleId}
              cursor={cursor}
              productType={productType}
              sort={sort}
              slug={slug}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function ProductListContent({
  vehicleId,
  cursor,
  productType,
  sort,
  slug,
}: {
  vehicleId: string;
  cursor: string | null;
  productType: string | null;
  sort: string | null;
  slug: string;
}) {
  const { data: vehicleItems, meta } = await getVehicleItems(
    vehicleId,
    cursor,
    productType,
    sort,
  );

  if (vehicleItems.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-100 rounded-lg">
        <p className="text-xl text-gray-600">No se encontraron productos</p>
      </div>
    );
  }

  return (
    <>
      <ProductList
        data={vehicleItems}
        sort={sort}
        slug={slug}
        productType={productType}
      />
      <CursorPagination
        cursor={meta.cursor || null}
        slug={slug}
        vehicleId={vehicleId}
        productType={productType}
        sort={sort}
      />
    </>
  );
}
