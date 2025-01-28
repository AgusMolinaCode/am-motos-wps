import BrandLink from "@/components/brand-section/BrandLink";
import { FlipWordsDemo } from "@/components/hero/FlipWordsDemo";
import Image from "next/image";

export default function Home() {
  return (
    <div className="mt-10">
      <div className="flex gap-2 items-center justify-center mx-auto">
        <Image
          src="/images/escudo.png"
          alt="AM Motos Logo"
          width={500}
          height={500}
        />
        {/* <FlipWordsDemo /> */}
      </div>
      <div className="px-2">
        <BrandLink />
      </div>
    </div>
  );
}
