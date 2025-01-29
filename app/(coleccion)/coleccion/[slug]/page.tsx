import { getBrandsItems } from "@/lib/brands";
import { BrandId } from "@/types/interface";
import React from "react";
import Image from "next/image";
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BrandPage({ params }: PageProps) {
  const item = await params;
  const { data } = await getBrandsItems(item.slug);

  return (
    <div>
      <h1>Brand Details for {item.slug}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {data.map((item: BrandId) => (
          <div key={item.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p>SKU: {item.supplier_product_id}</p>
            <p>Dealer Price: {item.standard_dealer_price}</p>
            <Image
              src={`https://${item.images.data[0].domain}${item.images.data[0].path}${item.images.data[0].filename}`}
              alt={item.name}
              width={200}
              height={200}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
