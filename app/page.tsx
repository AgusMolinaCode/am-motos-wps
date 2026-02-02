import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { ImagesSliderDemo } from "@/components/hero/ImagesSliderDemo";
import { InfiniteSliderBasic } from "@/components/header/InfiniteSliderBasic";
import { GridSection } from "@/components/grid-section/GridSection";
import CategorySection from "@/components/category-section/CategorySection";
import BrandLink from "@/components/brand-section/BrandLink";
import MercadoLibreBanner from "@/components/shared/MercadoLibreBanner";

// Dynamic imports para componentes pesados
const BestSellersSection = dynamic(
  () => import("@/components/bestseller-section/BestSellersSection"),
  { ssr: true }
);

const BrandCarousel = dynamic(
  () => import("@/components/main-sliders/BrandCarousel"),
  { ssr: true }
);

const DealSection = dynamic(
  () => import("@/components/deal-section/DealSection"),
  { ssr: true }
);

const UsadosSection = dynamic(
  () => import("@/components/usados-section/UsadosSection"),
  { ssr: true }
);

const BestUsadosSection = dynamic(
  () => import("@/components/usados-section/BestUsadosSection"),
  { ssr: true }
);

// Componente de loading simple
const SectionLoading = () => (
  <div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
);

/**
 * Home Page - Optimizada con Suspense boundaries
 * 
 * Las secciones que hacen data fetching están envueltas en Suspense
 * para permitir streaming progresivo del contenido.
 * 
 * Reglas aplicadas:
 * - async-suspense-boundaries: Suspense para streaming
 * - server-parallel-fetching: Cada sección carga sus datos en paralelo
 */
export default function Home() {
  return (
    <div className="mt-4 md:mt-8">
      {/* Header - No requiere data fetching */}
      <InfiniteSliderBasic />
      <ImagesSliderDemo /> 
      
      {/* Categorías - Sin data fetching pesado */}
      <CategorySection />
      
      {/* Brand Carousel 1 - Suspense para streaming */}
      <Suspense fallback={<SectionLoading />}>
        <BrandCarousel
          brandId={454}
          productType="Piston kits & Components"
        />
      </Suspense>
      
      {/* Brand Carousel 2 - Suspense para streaming */}
      <Suspense fallback={<SectionLoading />}>
        <BrandCarousel brandId={46} productType="Engine" />
      </Suspense>

      {/* Best Usados - Suspense */}
      <Suspense fallback={<SectionLoading />}>
        <BestUsadosSection />
      </Suspense>

      {/* Deal Section - Suspense */}
      <Suspense fallback={<SectionLoading />}>
        <DealSection />
      </Suspense>
      
      {/* Brand Link - Sin data fetching pesado */}
      <BrandLink />
      
      {/* Best Sellers - Suspense */}
      <Suspense fallback={<SectionLoading />}>
        <BestSellersSection />
      </Suspense>
      
      {/* Grid Section - Sin data fetching pesado */}
      <GridSection />
      
      {/* Footer Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-10">
        <MercadoLibreBanner />
        <Suspense fallback={<SectionLoading />}>
          <UsadosSection />
        </Suspense>
      </div>
    </div>
  );
}
