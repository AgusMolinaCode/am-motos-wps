import { createClient } from "@/utils/supabase/server";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import FavoriteButton from "@/components/shared/FavoriteButton";
import Image from "next/image";
import ProductDetailsSheet from "@/components/shared/ProductDetailsSheet";
import { SheetTrigger } from "@/components/ui/sheet";
import { UsadosAlternativosContent } from "@/components/usados-section/UsadosAlternativosContent";

export default async function page() {
  const supabase = await createClient();
  const { data: ItemsUsados } = await supabase.from("ItemsUsados").select();
  console.log(ItemsUsados);

  const { formatPrice } = usePriceCalculation();

  // Obtener categorías únicas
  const categorias = [...new Set(ItemsUsados?.map(item => item.categoria))];

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
    <UsadosAlternativosContent 
      initialItems={formattedItemsUsados || []} 
      categorias={categorias || []} 
    />
  );
}
