"use client";

import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";
import { ImagesSlider } from "../ui/images-slider";
import { FlipWordsDemo } from "./FlipWordsDemo";

/**
 * ImagesSliderDemo Optimizado para LCP
 * 
 * Reglas aplicadas:
 * - rendering-hoist-jsx: Array de imágenes fuera del componente
 * - bundle-dynamic-imports: Componente estático optimizado
 */

// Hoisted constant - no se recrea en cada render
const HERO_IMAGES = [
  "/images/fmf.webp",
  "/images/moto22.jpg", 
  "/images/moto33.jpg",
] as const;

export function ImagesSliderDemo() {
  return (
    <div className="relative z-[0]">
      <ImagesSlider className="h-[26rem] rounded-xl mt-2" images={[...HERO_IMAGES]}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="z-50 flex flex-col justify-center items-center"
        >
          <div className="flex flex-col lg:flex-row gap-2 items-center justify-center mx-auto">
            {/* Logo: priority para LCP */}
            <Image
              src="/images/escudo.png"
              alt="AM Motos Logo"
              width={500}
              height={500}
              priority
              fetchPriority="high"
              quality={85}
              className="w-full md:w-1/2 lg:w-1/3"
            />
            <FlipWordsDemo />
          </div>
        </motion.div>
      </ImagesSlider>
    </div>
  );
}
