import BestSellersSection from "@/components/bestseller-section/BestSellersSection";
import BrandLink from "@/components/brand-section/BrandLink";
import CategorySection from "@/components/category-section/CategorySection";
import DealSection from "@/components/deal-section/DealSection";
import { GridSection } from "@/components/grid-section/GridSection";
import { InfiniteSliderBasic } from "@/components/header/InfiniteSliderBasic";
import { ImagesSliderDemo } from "@/components/hero/ImagesSliderDemo";
import MercadoLibreBanner from "@/components/shared/MercadoLibreBanner";
import UsadosSection from "@/components/usados-section/UsadosSection";
import BestUsadosSection from "@/components/usados-section/BestUsadosSection";

export default function Home() {
  return (
    <div className="mt-4 md:mt-8">
      <InfiniteSliderBasic />
      <ImagesSliderDemo />
      <CategorySection />
      <BestUsadosSection /> 
      <DealSection />
      <BrandLink />
      <BestSellersSection />
      <GridSection />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-10">
        <MercadoLibreBanner />
        <UsadosSection />
      </div>
    </div>
  );
}
