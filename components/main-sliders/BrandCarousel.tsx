import { getSliderProducts, getBrandName } from "@/lib/brands";
import { BrandCarouselClient } from "./BrandCarouselClient";
import { Product_Type_Translations } from "@/constants";

// Revalidar cada 24 horas (86400 segundos)
export const revalidate = 86400;

interface BrandCarouselProps {
  brandId: number;
  productType: string;
  limit?: number;
  direction?: "left" | "right";
}

export async function BrandCarousel({
  brandId,
  productType,
  limit = 10,
  direction = "left",
}: BrandCarouselProps) {
  // Calcular offset basado en el día actual para rotar productos cada 24 horas
  const now = new Date();
  const daySeed = now.getDate() + now.getMonth() * 31 + now.getFullYear() * 365;
  
  const [products, brandName] = await Promise.all([
    getSliderProducts(brandId, productType, limit, daySeed),
    getBrandName(brandId.toString()),
  ]);

  const title = `${brandName}`;

  if (products.length === 0) {
    return (
      <div className="py-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 ml-4">
          {title}
        </h3>
        <p className="text-slate-500 text-center">
          No hay productos disponibles
        </p>
      </div>
    );
  }

  // Pasar los productos BrandStatus completos al cliente
  return <BrandCarouselClient items={products} productType={title} direction={direction} />;
}

export default BrandCarousel;
