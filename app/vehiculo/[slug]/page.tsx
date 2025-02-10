import React from 'react'
import { getVehicleItems, getVehicleItemsId } from '@/lib/brands';
import ColeccionImage from '@/components/category-section/ColeccionImage';
import ProductDetailsSheet from '@/components/shared/ProductDetailsSheet';
import CursorPage from '@/components/cursor-page/CursorPage';

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params, searchParams }: PageProps) {

  const makeId = typeof searchParams['makeId'] === 'string' ? searchParams['makeId'] : '';
  const modelId = typeof searchParams['modelId'] === 'string' ? searchParams['modelId'] : '';
  const yearId = typeof searchParams['yearId'] === 'string' ? searchParams['yearId'] : '';

  // Obtener el vehicleId usando el modelo y año
  const vehicleData = await getVehicleItemsId(modelId, yearId);
  let vehicleItems = [];
  let meta = {};

  if (vehicleData.length > 0) {
    const vehicleId = vehicleData[0].id.toString();
    const result = await getVehicleItems(vehicleId);
    vehicleItems = result.data;
    meta = result.meta;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">Vehículo: {params.slug.replace(/-/g, ' ')}</h1>

      {vehicleItems.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 rounded-lg">
          <p className="text-xl text-gray-600">No se encontraron productos</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {vehicleItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col">
                <h2 className="text-lg font-semibold mb-2 truncate">{item.name}</h2>
                <p className="text-sm text-gray-600 mb-1">SKU: {item.supplier_product_id}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-green-600">${item.standard_dealer_price}</span>
                  <span className="text-sm text-blue-600">Inventario: {item.inventory?.data?.total || 0}</span>
                </div>
                <ColeccionImage item={item} />
                <ProductDetailsSheet item={item} />
              </div>
            ))}
          </div>

          <CursorPage meta={meta} slug={params.slug} />
        </>
      )}
    </div>
  )
}

