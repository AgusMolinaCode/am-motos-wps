"use client";

import dynamic from "next/dynamic";

// Lazy loading del Orb (WebGL pesado) - no es crítico para LCP
const Orb = dynamic(() => import("@/app/Orb"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-green-500/20 rounded-full animate-pulse" />
  ),
});

interface OrbWrapperProps {
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  hue?: number;
  forceHoverState?: boolean;
}

export function OrbWrapper({
  hoverIntensity = 0.5,
  rotateOnHover = true,
  hue = 3,
  forceHoverState = false,
}: OrbWrapperProps) {
  return (
    <Orb
      hoverIntensity={hoverIntensity}
      rotateOnHover={rotateOnHover}
      hue={hue}
      forceHoverState={forceHoverState}
    />
  );
}
