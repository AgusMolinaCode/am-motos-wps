import { createClient } from "@/utils/supabase/server";
import { UsadosAlternativosContent } from "@/components/usados-section/UsadosAlternativosContent";

export interface SupabaseProductItem {
  id: number;
  titulo: string;
  descripcion: string;
  marca: string;
  modelo: string;
  condicion: string;
  origen: string;
  preciopagina: number;
  priceFormatted: string;
  imagenes: string[];
  category: string;
  weight: number;
  calculatedPrices: Record<string, any>;
  images: {
    data: any[];
  };
  // Required properties for ItemSheet compatibility
  name: string;
  brand_id: number;
  supplier_product_id: string;
  standard_dealer_price: string;
  list_price: string;
  brand?: string;
}

export default async function page() {
  const supabase = await createClient();
  const { data: ItemsUsados } = await supabase.from("productos").select();

  // Obtener categorías únicas
  const categorias = [...new Set(ItemsUsados?.map(item => item.category))];


 
  return (
    <UsadosAlternativosContent 
      initialItems={ItemsUsados as SupabaseProductItem[]} 
      categorias={categorias || []} 
    />
  );
}
