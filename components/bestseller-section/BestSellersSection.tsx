import { getRecommendedItems } from "@/lib/brands";
import ColeccionImage from "../category-section/ColeccionImage";
import ProductDetailsSheet from '../shared/ProductDetailsSheet';

export default async function BestSellersSection() {
  const recommendedItems = await getRecommendedItems();

  return (
    <div className="mx-auto pt-4 md:pt-10">
      <div className="flex justify-between gap-2 items-center">
        <h1 className="text-2xl font-bold underline uppercase dark:text-gray-300 text-gray-800">
          Recomendados
        </h1>
      </div>

      {recommendedItems.data.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 rounded-lg mt-4">
          <p className="text-xl text-gray-600">
            No se encontraron productos recomendados
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
          {recommendedItems.data.map((item) => (
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
      )}
    </div>
  );
}
