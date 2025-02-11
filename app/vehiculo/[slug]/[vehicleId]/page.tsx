import React from "react";
import { getVehicleItems } from "@/lib/brands";
import ColeccionImage from "@/components/category-section/ColeccionImage";
import ProductDetailsSheet from "@/components/shared/ProductDetailsSheet";
import CursorPage from "@/components/cursor-page/CursorPage";
import PopularProductsTypes from "@/components/vehiculo/PopularProductsTypes";
import OfferBanner from "@/components/vehiculo/OfferBanner";
import SortBy from "@/components/vehiculo/SortBy";

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {vehicleItems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col"
                  >
                    <h2 className="text-lg font-semibold mb-2 truncate">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-600 mb-1">
                      SKU: {item.supplier_product_id}
                    </p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold text-green-600">
                        ${item.standard_dealer_price}
                      </span>
                      <span className="text-sm text-blue-600">
                        Inventario: {item.inventory?.data?.total || 0}
                      </span>
                    </div>
                    <ColeccionImage item={item} />
                    <ProductDetailsSheet item={item} />
                  </div>
                ))}
              </div>

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
