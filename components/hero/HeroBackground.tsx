import React from "react";
import Image from "next/image";
import { FlipWordsDemo } from "./FlipWordsDemo";
const WebsiteBackground = () => {
  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      {/* Background image container with opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('/images/fmf.webp')`,
        }}
      />

      {/* Logo container */}
      <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-72 z-10">
        <Image
          src="/images/escudo.png"
          alt="AM Motos Logo"
          width={500}
          height={500}
        />
        <div className="flex gap-2 items-center justify-center mx-auto">
          <FlipWordsDemo />
        </div>
      </div>
    </div>
  );
};

export default WebsiteBackground;
