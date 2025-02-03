import BestSellersSection from "@/components/bestseller-section/BestSellersSection";
import BrandLink from "@/components/brand-section/BrandLink";
import CategorySection from "@/components/category-section/CategorySection";
import DealSection from "@/components/deal-section/DealSection";
import { ImagesSliderDemo } from "@/components/hero/ImagesSliderDemo";

export default function Home() {
  return (
    <div className="mt-10 max-w-7xl mx-auto px-2">
      <ImagesSliderDemo />
      <CategorySection />
      <DealSection />
      <BrandLink />
      <BestSellersSection />
    </div>
  );
}
