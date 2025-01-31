import { getBrandsItems } from "@/lib/brands";
import { BrandId } from "@/types/interface";
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: {
    slug: string;
  };
  searchParams?: { cursor?: string };
}

export default async function BrandPage({ 
  params,
  searchParams
}: PageProps) {
  const cursor = searchParams?.cursor || null;
  const { data, meta } = await getBrandsItems(params.slug, cursor);
  // const uniqueBrands = await getUniqueBrands();

  return (
    <div>
      <h1>Brand Details for {params.slug}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {data.map((item: BrandId) => (
          <div key={item.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p>SKU: {item.supplier_product_id}</p>
            <p>Dealer Price: {item.standard_dealer_price}</p>
            {item.images?.data?.[0]?.domain && (
              <Image
                src={`https://${item.images.data[0].domain}${item.images.data[0].path}1000_max/${item.images.data[0].filename}`}
                alt={item.name}
                width={200}
                height={200}
                className="w-full h-48 object-contain"
              />
            )}
          </div>
        ))}
      </div>
      {meta?.cursor?.next && (
        <Link 
          href={`/coleccion/${params.slug}?cursor=${meta.cursor.next}`}
          className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Cargar más
        </Link>
      )}
      
    </div>
  );
}
