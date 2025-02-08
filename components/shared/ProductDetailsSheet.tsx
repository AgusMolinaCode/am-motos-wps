"use client"

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CarouselComponent } from "./CarouselComponent";

interface ImageData {
  domain: string;
  path: string;
  filename: string;
}

interface Item {
  id: number;
  name: string;
  supplier_product_id: string;
  standard_dealer_price: string;
  inventory?: {
    data?: {
      total?: number;
    };
  };
  images?: {
    data?: ImageData[];
  };
}

interface ProductDetailsSheetProps {
  item: Item;
}

const ProductDetailsSheet: React.FC<ProductDetailsSheetProps> = ({ item }) => {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);

  return (
    <Sheet>
      <SheetTrigger className="mt-auto inline-block text-sm text-indigo-600 hover:underline text-center">
        Ver detalles
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{item.name}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              SKU: {item.supplier_product_id}
            </div>
            <div className="text-lg font-bold text-green-600">
              Precio: ${item.standard_dealer_price}
            </div>
            <div className="text-sm text-blue-600">
              Inventario: {item.inventory?.data?.total || 0}
            </div>
          </div>
          <div className="space-y-4">
            {!item.images?.data || item.images.data.length === 0 ? (
              <Image
                priority
                src="https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                alt="Imagen no disponible"
                width={300}
                height={300}
                className="w-full object-contain rounded-lg h-64"
              />
            ) : (
              <>
                <button 
                  onClick={() => setIsCarouselOpen(true)}
                  className="w-full focus:outline-none"
                >
                  <Image
                    priority
                    src={`https://${item.images.data[0].domain}${item.images.data[0].path}${item.images.data[0].filename}`}
                    alt={item.name}
                    width={300}
                    height={300}
                    className="w-full object-contain rounded-lg h-64 hover:opacity-90 transition-opacity"
                  />
                </button>
                {item.images.data.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {item.images.data.slice(1).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setIsCarouselOpen(true)}
                        className="focus:outline-none"
                      >
                        <Image
                          src={`https://${image.domain}${image.path}${image.filename}`}
                          alt={`${item.name} - imagen ${index + 2}`}
                          width={100}
                          height={100}
                          className="w-full object-contain rounded-md hover:opacity-80 transition-opacity cursor-pointer h-24"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          <Link
            href={`/product/${item.supplier_product_id}`}
            className="inline-block w-full text-center py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Ver página completa
          </Link>
        </div>
      </SheetContent>
      {item.images?.data && item.images.data.length > 0 && (
        <CarouselComponent
          images={item.images.data}
          isOpen={isCarouselOpen}
          onClose={() => setIsCarouselOpen(false)}
          title={item.name}
        />
      )}
    </Sheet>
  );
};

export default ProductDetailsSheet; 