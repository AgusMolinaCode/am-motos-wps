import BestSellersSection from "@/components/bestseller-section/BestSellersSection";
import BrandLink from "@/components/brand-section/BrandLink";
import CategorySection from "@/components/category-section/CategorySection";
import DealSection from "@/components/deal-section/DealSection";
import { GridSection } from "@/components/grid-section/GridSection";
import { InfiniteSliderBasic } from "@/components/header/InfiniteSliderBasic";
import { ImagesSliderDemo } from "@/components/hero/ImagesSliderDemo";

export default function Home() {
  return (
    <div className="mt-4 md:mt-8">
      <InfiniteSliderBasic />
      <ImagesSliderDemo />
      <CategorySection />
      <DealSection />
      <BrandLink />
      <BestSellersSection />
      <GridSection />
    </div>
  );
}
