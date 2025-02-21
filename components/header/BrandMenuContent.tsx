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
    <div className="w-[700px] p-6">
      <div className="grid grid-cols-4 gap-6">
        {/* Featured Brands */}
        <div className="col-span-2 bg-gray-100 dark:bg-zinc-900 p-6 rounded-xl">
          <h3 className="font-bold text-lg mb-4 text-black dark:text-white">
            Mejores Marcas
          </h3>
          <div className="grid grid-cols-2 gap-2 text-base">
            {featuredBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded text-black dark:text-white transition-colors"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>

        {/* All Brands */}
        <div className="col-span-2">
          <h3 className="font-bold text-lg mb-4 text-black dark:text-white">
            Todas las Marcas
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {allBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded text-sm text-black dark:text-white transition-colors"
              >
                {brand.name}
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="/brands"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-sm"
            >
              Ver todas las marcas →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandMenuContent;
