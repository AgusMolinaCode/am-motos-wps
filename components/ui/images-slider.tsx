"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";

interface ImagesSliderProps {
  images: string[];
  children: React.ReactNode;
  overlay?: boolean;
  overlayClassName?: string;
  className?: string;
  autoplay?: boolean;
  direction?: "up" | "down";
}

/**
 * ImagesSlider Optimizado para LCP
 * 
 * CRÍTICO: La primera imagen NUNCA debe tener opacity-0
 * porque es el elemento LCP (Largest Contentful Paint)
 */
export const ImagesSlider = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
  direction = "up",
}: ImagesSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === images.length ? 0 : prevIndex + 1
    );
  }, [images.length]);

  // Autoplay - solo después de que todo esté listo
  useEffect(() => {
    if (!autoplay || !isReady) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, isReady, handleNext]);

  const slideVariants = {
    initial: {
      opacity: 0,
      scale: 1.05,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.645, 0.045, 0.355, 1.0],
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div
      className={cn(
        "overflow-hidden h-full w-full relative flex items-center justify-center",
        className
      )}
    >
      {/* 
        IMAGEN LCP - SIEMPRE VISIBLE
        No usar opacity-0/100 toggle que retrasa el LCP
      */}
      <div className="absolute inset-0">
        <Image
          src={images[0]}
          alt="Hero background"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={80}
          className="object-cover object-center"
          onLoad={() => setIsReady(true)}
        />
      </div>

      {/* 
        IMÁGENES RESTANTES - Con animación de fade
        Solo se muestran cuando currentIndex > 0
      */}
      <AnimatePresence mode="wait">
        {currentIndex > 0 && (
          <motion.div
            key={currentIndex}
            initial="initial"
            animate="visible"
            exit="exit"
            variants={slideVariants}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]}
              alt={`Hero background ${currentIndex + 1}`}
              fill
              sizes="100vw"
              quality={75}
              className="object-cover object-center"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay - siempre presente */}
      {overlay && (
        <div
          className={cn("absolute inset-0 bg-black/60 z-40", overlayClassName)}
        />
      )}

      {/* Children (logo y texto) - aparecen cuando la imagen está lista */}
      <motion.div 
        className="relative z-50 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>

      {/* Loading skeleton - solo mientras carga la primera imagen */}
      {!isReady && (
        <div className="absolute inset-0 bg-gray-900 z-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};
