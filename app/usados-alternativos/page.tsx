import React from "react";
import { createClient } from "@/utils/supabase/server";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import FavoriteButton from "@/components/shared/FavoriteButton";
import Image from "next/image";
import ProductDetailsSheet from "@/components/shared/ProductDetailsSheet";
import { SheetTrigger } from "@/components/ui/sheet";

export default async function page() {
  const supabase = await createClient();
  const { data: ItemsUsados } = await supabase.from("ItemsUsados").select();

  const { formatPrice } = usePriceCalculation();

  // formateamos price a ARS pesos argentinos y adaptamos al formato esperado por ProductDetailsSheet
  const formattedItemsUsados = ItemsUsados?.map((item) => ({
    ...item,
    id: item.id,
    name: item.name,
    supplier_product_id: item.product_id,
    brand: item.brand,
    weight: 1, // Para asegurar que se muestre el precio
    // Adaptamos el formato de imágenes para que coincida con lo esperado por ProductDetailsSheet
    images: {
      data: item.images?.map((url: string) => {
        // Si la URL ya comienza con http:// o https://, la dividimos para extraer solo la parte del dominio y la ruta
        if (url.startsWith('http')) {
          // Eliminar el protocolo (http:// o https://)
          const urlWithoutProtocol = url.replace(/^https?:\/\//, '');
          // Encontrar la primera barra después del dominio
          const firstSlashIndex = urlWithoutProtocol.indexOf('/');
          
          if (firstSlashIndex !== -1) {
            // Dividir en dominio y ruta+archivo
            const domain = urlWithoutProtocol.substring(0, firstSlashIndex);
            const pathWithFilename = urlWithoutProtocol.substring(firstSlashIndex);
            
            // Encontrar la última barra para separar la ruta del nombre del archivo
            const lastSlashIndex = pathWithFilename.lastIndexOf('/');
            const path = pathWithFilename.substring(0, lastSlashIndex + 1); // Incluir la barra
            const filename = pathWithFilename.substring(lastSlashIndex + 1);
            
            return {
              domain,
              path,
              filename
            };
          }
        }
        
        // Si no podemos procesar la URL correctamente, la dejamos como está
        return {
          domain: "",
          path: "",
          filename: url
        };
      }) || []
    },
    // Añadimos calculatedPrices para que el componente pueda mostrar el precio
    calculatedPrices: {
      finalTotalArs: item.price
    },
    // Precio formateado para mostrar en la tarjeta
    priceFormatted: formatPrice(item.price || 0)
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Productos Usados y Alternativos</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
        {formattedItemsUsados?.map((item) => (
          <ProductDetailsSheet key={item.id} item={item} isUsedItem={true}>
            <SheetTrigger asChild>
              <div
                className="border rounded-lg p-2 hover:shadow-lg transition-shadow flex flex-col relative animate-fade-in cursor-pointer"
              >
                <div className="absolute top-2 right-2">
                  <FavoriteButton item={item} />
                </div>
                {item.images.data && item.images.data.length > 0 ? (
                  <Image
                    src={
                      item.images.data[0].domain 
                        ? `https://${item.images.data[0].domain}${item.images.data[0].path}${item.images.data[0].filename}`
                        : item.images.data[0].filename
                    }
                    alt={item.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-contain rounded-lg mb-2"
                  />
                ) : (
                  <Image
                    src="https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                    alt="Placeholder Image"
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                )}
                <h2 className="text-sm font-semibold truncate">{item.name}</h2>
                <p className="text-xs text-gray-600">SKU: {item.supplier_product_id}</p>

                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-md font-bold text-green-600">
                      {item.priceFormatted}
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
