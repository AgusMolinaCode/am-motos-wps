import React from "react";
import Link from "next/link";
import { TiresBrands } from "@/constants";
import brandsWithIds from "@/public/csv/brands_with_ids.json";

interface BrandData {
  id: number;
  product_types: string[];
}

const CubiertasMenuContent = () => {
  // Filtrar marcas para cada categoría
  const tubesBrands = Object.entries(brandsWithIds as Record<string, BrandData>)
    .filter(([_, brandData]) => brandData.product_types.includes("Tubes"))
    .map(([name, brandData]) => ({ name, id: brandData.id }))
    .slice(0, 8);

  const rimsBrands = Object.entries(brandsWithIds as Record<string, BrandData>)
    .filter(([_, brandData]) => brandData.product_types.includes("Rims"))
    .map(([name, brandData]) => ({ name, id: brandData.id }))
    .slice(0, 8);

  const wheelsBrands = Object.entries(
    brandsWithIds as Record<string, BrandData>
  )
    .filter(
      ([_, brandData]) =>
        brandData.product_types.includes("Wheels") ||
        brandData.product_types.includes("Wheel Components")
    )
    .map(([name, brandData]) => ({ name, id: brandData.id }))
    .slice(0, 8);

  return (
    <ul className="grid gap-6 p-6 md:w-[600px]">
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-2 bg-gray-200 dark:bg-zinc-900 p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-4 text-black dark:text-white">
            Marcas de Cubiertas
          </h3>
          <div className="grid grid-cols-2 gap-2 text-base">
            {TiresBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.id}`}
                className="hover:bg-gray-300 font-normal dark:hover:bg-gray-800 p-2 rounded text-black dark:text-white"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <div className="w-full rounded-xl">
            <h3 className="font-bold text-lg mb-2 text-black dark:text-white">
              Mousse / Camaras
            </h3>
            <div className="grid grid-cols-3 gap-1 text-base pb-2">
              {tubesBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brand/${brand.id}?productType=Tubes`}
                  className="hover:bg-gray-300 font-normal dark:hover:bg-gray-800 p-1 rounded text-black dark:text-white text-xs"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="w-full rounded-xl">
            <h3 className="font-bold text-lg mb-2 text-black dark:text-white">
              Aros / Llantas
            </h3>
            <div className="grid grid-cols-3 gap-1 text-base pb-2">
              {rimsBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brand/${brand.id}?productType=Rims`}
                  className="hover:bg-gray-300 font-normal dark:hover:bg-gray-800 p-1 rounded text-black dark:text-white text-xs"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="w-full rounded-xl">
            <h3 className="font-bold text-lg mb-2 text-black dark:text-white">
              Llantas ATV-UTV / Rayos
            </h3>
            <div className="grid grid-cols-3 gap-1 text-base pb-2">
              {wheelsBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brand/${brand.id}?productType=Wheels,Wheel Components`}
                  className="hover:bg-gray-300 font-normal dark:hover:bg-gray-800 p-1 rounded text-black dark:text-white text-xs"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ul>
  );
};

export default CubiertasMenuContent;
