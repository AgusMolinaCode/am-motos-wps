import { featuredBrands } from "@/constants";
import Link from "next/link";
import React from "react";

// Interfaz para definir la estructura de una marca
interface Brand {
  id: string | number;
  name: string;
}

const BrandMenuContent = ({
  featuredBrands,
  allBrands,
}: {
  featuredBrands: Brand[];
  allBrands: Brand[];
}) => {
  return (
    <ul className="grid gap-6 p-6 w-[800px]">
      <div className="grid grid-cols-4 gap-6">
        {/* Featured Brands */}
        <div className="col-span-2 bg-gray-200 dark:bg-zinc-900 p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-4 text-black dark:text-white">
            Mejores Marcas
          </h3>
          <div className="grid grid-cols-2 gap-2 text-base">
            {featuredBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.id}`}
                className="hover:bg-gray-300 font-normal dark:hover:bg-gray-800 p-2 rounded text-black dark:text-white"
              >
                {brand.name}
              </Link>
            ))}
          </div>
          {/* View All Brands Link */}
        </div>

        {/* All Brands */}
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-1">
            {allBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.id}`}
                className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded text-xs"
              >
                {brand.name}
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="/brands"
              className="text-black dark:text-white hover:text-gray-800 hover:dark:text-gray-200 font-semibold text-sm"
            >
              Ver todas las marcas →
            </Link>
          </div>
        </div>
      </div>
    </ul>
  );
};

export default BrandMenuContent;
