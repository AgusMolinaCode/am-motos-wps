import React from "react";
import { createClient } from "@/utils/supabase/server";
import ProductDetailsSheet from "../shared/ProductDetailsSheet";
import { SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default async function BestUsadosSection() {
  const supabase = await createClient();
  const { data: ItemsUsados } = await supabase
    .from("productos")
    .select()
    .limit(4)
    .order("id", { ascending: false });

  // Transformar los datos para que sean compatibles con ItemSheet
  const transformedItems =
    ItemsUsados?.map((item) => ({
      ...item,
      name: item.titulo,
      brand: item.marca,
      brand_id: 0, // Los productos usados no tienen brand_id
      supplier_product_id: item.id.toString(),
      standard_dealer_price: "0",
      list_price: "0",
      weight: 1, // Peso por defecto para productos usados
      images: { data: [] }, // Estructura compatible
    })) || [];

  // No mostrar la sección si no hay productos
  if (!ItemsUsados || ItemsUsados.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto pt-4 md:pt-10">
      <div className="flex justify-between gap-2 items-center mb-4">
        <h1 className="text-xl font-bold underline uppercase dark:text-gray-300 text-gray-800">
          Últimos Agregados
        </h1>
        <Link href="/usados-alternativos">
          <Button>Ver todos los usados</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {transformedItems.map((item) => (
          <ProductDetailsSheet key={item.id} item={item} isUsedItem={true}>
            <SheetTrigger asChild>
              <div className="border rounded-lg p-2 hover:shadow-lg transition-shadow flex flex-col relative animate-fade-in cursor-pointer">
                <div className="relative w-full h-[300px] mb-2">
                  {item.imagenes && item.imagenes.length > 0 ? (
                    <Image
                      src={item.imagenes[0]}
                      alt={item.titulo || item.name}
                      fill
                      className="object-contain rounded-md"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Sin imagen</span>
                    </div>
                  )}
                </div>
                <h2 className="text-sm font-semibold truncate">
                  {item.titulo || item.name}
                </h2>

                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex justify-between items-center gap-1">
                    <span className="text-md font-bold text-green-600">
                      {(item.preciopagina * 1000).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </SheetTrigger>
          </ProductDetailsSheet>
        ))}
      </div>
    </div>
  );
}
