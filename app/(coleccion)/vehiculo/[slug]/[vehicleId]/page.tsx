import { getVehicleItems } from "@/lib/brands";
import React, { Suspense } from "react";
import CursorPage from "@/components/cursor-page/CursorPage";
import PopularProductsTypes from "@/components/vehiculo/PopularProductsTypes";
import SortBy from "@/components/vehiculo/SortBy";
import dynamic from "next/dynamic";
import Loading from "./loading";
import { Metadata } from "next";

// Importar ProductList de manera dinámica con suspense
const ProductList = dynamic(() => import("@/components/vehiculo/ProductList"), {
  loading: () => <Loading />,
});

interface PageProps {
  params: {
    slug: string;
    vehicleId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || "";
  const [make, model, year] = slug
    .split("-")
    .map((part) => part.replace(/\b\w/g, (c) => c.toUpperCase()));

  return {
    title: `AM MOTOS - ${make} ${model} ${year}`,
    description: `Venta de repuestos, accesorios e indumentaria para ${make} ${model} ${year}`,
    openGraph: {
      title: `AM MOTOS - ${make} ${model} ${year}`,
      description: `Venta de repuestos, accesorios e indumentaria para ${make} ${model} ${year}`,
      images: "/favicon.ico",
    },
  };
};

export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || "";
  const [make, model, year] = slug
    .split("-")
    .map((part) => part.replace(/\b\w/g, (c) => c.toUpperCase()));

  const cursor =
    typeof searchParams["cursor"] === "string" ? searchParams["cursor"] : null;
  const productType =
    typeof searchParams["filter[product_type]"] === "string"
      ? searchParams["filter[product_type]"]
      : null;
  const sort =
    typeof searchParams["sort"] === "string" ? searchParams["sort"] : null;

  return (
    <div className="container mx-auto md:px-4 py-4 md:py-8">
      <div className="flex justify-center mx-auto md:justify-between items-center mb-6">
        <h1 className="text-xl md:text-3xl font-bold text-center md:text-left capitalize">
          {make} {model} {year}
        </h1>
        <div className="hidden md:flex">
          <SortBy />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex justify-between gap-2">
          <PopularProductsTypes />
          <div className="flex md:hidden">
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

// Componente separado para el contenido que requiere datos
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
  // Solo usar el parámetro sort para ordenamiento en el servidor si no es finalTotalArs
  const sortParam = sort?.includes("finalTotalArs") ? null : sort;
  const { data: vehicleItems, meta } = await getVehicleItems(
    vehicleId,
    cursor,
    productType,
    sortParam
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
      <ProductList data={vehicleItems} sort={sort} />
      <CursorPage meta={meta} slug={slug} vehicleId={vehicleId} />
    </>
  );
}
