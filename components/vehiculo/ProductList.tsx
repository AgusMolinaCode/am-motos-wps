import React from "react";
import { BrandStatus, BrandId } from "@/types/interface";
import ColeccionImage from "@/components/category-section/ColeccionImage";
import ProductDetailsSheet from "@/components/shared/ProductDetailsSheet";
import FavoriteButton from "@/components/shared/FavoriteButton";
import { SheetTrigger } from "@/components/ui/sheet";

interface ProductListProps {
  data: BrandStatus[] | BrandId[];
}

export default function ProductList({ data }: ProductListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {data.map((item: BrandStatus | BrandId) => (
        <ProductDetailsSheet key={item.id} item={item}>
          <SheetTrigger asChild>
            <div className="border rounded-lg p-2 hover:shadow-lg transition-shadow flex flex-col relative animate-fade-in cursor-pointer">
              <div className="absolute top-2 right-2"></div>
              <ColeccionImage item={item} />
              <h2 className="text-sm font-semibold truncate">{item.name}</h2>
              {/* convertimos item.weight a kg */}
              {item.weight ? `${(item.weight / 2.205).toFixed(2)} kg` : ""}
              <div className="flex justify-between items-center ">
                <span className="text-md font-bold text-green-600">
                  ${item.standard_dealer_price}
                </span>
                <FavoriteButton item={item} />
              </div>
            </div>
          </SheetTrigger>
        </ProductDetailsSheet>
      ))}
    </div>
  );
}
