"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "../ui/images-slider";
import Image from "next/image";
import { FlipWordsDemo } from "./FlipWordsDemo";

export function ImagesSliderDemo() {
  const images = [
    "/images/fmf.webp",
    "/images/moto22.jpg",
    "/images/moto33.jpg",
  ];
  return (
    <ImagesSlider className="h-[26rem] rounded-xl" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <div className="flex gap-2 items-center justify-center mx-auto">
          <Image
            src="/images/escudo.png"
            alt="AM Motos Logo"
            width={500}
            height={500}
          />
          <FlipWordsDemo />
        </div>
      </motion.div>
    </ImagesSlider>
  );
}
