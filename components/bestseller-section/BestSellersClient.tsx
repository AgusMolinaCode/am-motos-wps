"use client";

import ColeccionImage from "../category-section/ColeccionImage";
import ProductDetailsSheet from "../shared/ProductDetailsSheet";
import FavoriteButton from "../shared/FavoriteButton";
import { SheetTrigger } from "@/components/ui/sheet";
import { BrandStatus } from "@/types/interface";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useAuth } from "@clerk/nextjs";

interface BestSellersClientProps {
  recommendedItems: BrandStatus[];
}

export default function BestSellersClient({
  recommendedItems,
}: BestSellersClientProps) {
  const { calculateTotalPrice, formatPrice } = usePriceCalculation();
  const { isSignedIn } = useAuth();

  // Calcular precios para todos los items
  const itemsWithPrices = recommendedItems.map((item) => {
    const retailCalc = calculateTotalPrice(item, false);
    const wholesaleCalc = calculateTotalPrice(item, true);

    return {
      ...item,
      hasStock: retailCalc.hasStock,
      retailPrice: retailCalc.finalTotalArs,
      wholesalePrice: wholesaleCalc.finalTotalArs,
      listPriceWithMarkup: retailCalc.listPriceWithMarkup,
    };
  });

  return (
    <div className="mx-auto pt-4 md:pt-10">
      <div className="flex justify-between gap-2 items-center mb-4">
        <h1 className="text-xl font-bold underline uppercase dark:text-gray-300 text-gray-800">
          Recomendados
        </h1>
      </div>

      {recommendedItems.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xl text-gray-600 dark:text-gray-300">
            No se encontraron productos recomendados
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {itemsWithPrices.map((item) => (
            <ProductDetailsSheet key={item.id} item={item}>
              <SheetTrigger asChild>
                <div className="border rounded-lg p-2 hover:shadow-lg transition-shadow flex flex-col relative animate-fade-in cursor-pointer">
                  <div className="absolute top-2 right-2">
                    <FavoriteButton item={item} />
                  </div>
                  <ColeccionImage item={item} />
                  <h2 className="text-sm font-semibold truncate">{item.name}</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    SKU: {item.supplier_product_id}
                  </p>

                  <div className="flex flex-col gap-1 mt-2">
                    {!item.hasStock ? (
                      // Sin stock: mostrar precio list_price +50% en verde
                      <div className="flex flex-col gap-1">
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(item.listPriceWithMarkup || 0)}
                        </span>
                      </div>
                    ) : isSignedIn ? (
                      // Autenticado: mostrar precio mayorista (+20%)
                      <div className="flex flex-col gap-1">
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(item.wholesalePrice || 0)}
                        </span>
                      </div>
                    ) : (
                      // No autenticado: precio retail (+40%) con precio lista tachado
                      <div className="flex flex-col gap-1">
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(item.retailPrice || 0)}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(item.listPriceWithMarkup || 0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </SheetTrigger>
            </ProductDetailsSheet>
          ))}
        </div>
      )}
    </div>
  );
}
