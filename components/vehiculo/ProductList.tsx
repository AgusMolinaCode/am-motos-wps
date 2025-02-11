import React from "react";
import { BrandStatus, BrandId } from "@/types/interface";
import ColeccionImage from "@/components/category-section/ColeccionImage";
import ProductDetailsSheet from "@/components/shared/ProductDetailsSheet";
import FavoriteButton from "@/components/shared/FavoriteButton";

interface ProductListProps {
  data: BrandStatus[] | BrandId[];
}

export default function ProductList({ data }: ProductListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {data.map((item: BrandStatus | BrandId) => (
        <div
          key={item.id}
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col relative animate-fade-in"
        >
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton item={item} />
          </div>
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
  );
} 