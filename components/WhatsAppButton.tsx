"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

/**
 * WhatsApp Button - Versión optimizada sin WebGL
 * 
 * Reglas aplicadas:
 * - bundle-defer-third-party: No carga JS pesado
 * - rendering-hydration-no-flicker: Logo estático inmediato
 * - rerender-memo: Componente memoizado (no tiene props)
 */
export const WhatsAppButton = React.memo(function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/+5491161607732"
      target="_blank"
      rel="noopener noreferrer"
      className="w-full h-full flex items-center justify-center bg-green-500 hover:bg-green-600 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
      aria-label="Contactar por WhatsApp"
    >
      <Image
        src="/svg/whatsapp.svg"
        alt="WhatsApp"
        width={55}
        height={55}
        className="w-12 h-12 md:w-14 md:h-14"
        priority
      />
    </Link>
  );
});
