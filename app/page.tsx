import BrandLink from "@/components/brand-section/BrandLink";
import { FlipWordsDemo } from "@/components/hero/FlipWordsDemo";
import { ImagesSliderDemo } from "@/components/hero/ImagesSliderDemo";
import Image from "next/image";

export default function Home() {
  return (
    <div className="mt-10 max-w-7xl mx-auto">
      <ImagesSliderDemo />

      <div className="px-2">
        <BrandLink />
      </div>
    </div>
  );
}
