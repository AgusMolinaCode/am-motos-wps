import React from "react";
import { getCollectionByProductType } from "@/lib/brands";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: {
    slug: string;
  };
  searchParams?: { cursor?: string };
}

export default async function CollectionPage({
  params,
  searchParams,
}: PageProps) {
  const cursor = searchParams?.cursor || null;
  const { data, meta } = await getCollectionByProductType(params.slug, cursor);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        Colección de {params.slug.replace("-", " ")}
      </h1>

      {data.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 rounded-lg">
          <p className="text-xl text-gray-600">
            No se encontraron productos para esta categoría
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
                <p className="text-sm text-gray-600 mb-1">SKU: {item.sku}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">
                    ${item.list_price}
                  </span>
                  {item.inventory && (
                    <span className="text-sm text-blue-600">
                      Inventario: {item.inventory.data.total}
                    </span>
                  )}
                </div>
                {item.images?.data?.length > 0 ? (
                  <Image
                    src={`https://${item.images.data[0].domain}${item.images.data[0].path}1000_max/${item.images.data[0].filename}`}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-contain"
                  />
                ) : (
                  <Image
                    src="https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                    alt={item.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-contain"
                  />
                )}
                <Link
                  href={`/product/${item.id}`}
                  className="mt-2 inline-block text-sm text-indigo-600 hover:underline"
                >
                  Ver detalles
                </Link>
              </div>
            ))}
          </div>

          {meta?.cursor?.next && (
            <div className="flex justify-center mt-6">
              <Link
                href={`/coleccion/${params.slug}?cursor=${meta.cursor.next}`}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Cargar más productos
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
