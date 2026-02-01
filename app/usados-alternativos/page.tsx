import { UsadosAlternativosContent } from "@/components/usados-section/UsadosAlternativosContent";

// Tipo para items usados
interface UsedItem {
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
}

export default async function page() {
  // Por ahora retorna datos vacíos -有待实现从PostgreSQL获取二手商品
  const ItemsUsados: UsedItem[] = [];
  const categorias: string[] = [];

  return (
    <UsadosAlternativosContent
      initialItems={ItemsUsados}
      categorias={categorias}
    />
  );
}
