'use client';

import { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";

const GrainOverlay = ({ isLight = false }: { isLight?: boolean }) => (
  <div className={`pointer-events-none fixed inset-0 ${isLight ? 'opacity-10' : 'opacity-20'}`}>
    <div className={`absolute inset-0 ${isLight ? 'bg-slate-200' : 'bg-slate-950'}`}>
      <div className="h-full w-full">
        <svg className="h-full w-full">
          <filter id={isLight ? "grainyLight" : "grainyDark"}>
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect 
            width="100%" 
            height="100%" 
            filter={`url(#${isLight ? "grainyLight" : "grainyDark"})`} 
            opacity={isLight ? "0.3" : "0.4"} 
          />
        </svg>
      </div>
    </div>
  </div>
);

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen w-full bg-white dark:bg-slate-950"></div>;
  }

  return (
    <div className="relative min-h-screen w-full">
      <div className="pointer-events-none absolute inset-0">
        {theme === 'dark' ? (
          <>
            <div className="absolute top-0 z-[-2]  w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            <GrainOverlay />
          </>
        ) : (
          <>
            <div className="absolute top-0 z-[-2] w-screen rotate-180 transform bg-gray-100 bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]" />
            <GrainOverlay isLight />
          </>
        )}
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}