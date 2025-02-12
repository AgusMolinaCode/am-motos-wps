"use client";

import Image from "next/image";
import React from "react";
import { WobbleCard } from "../ui/wobble-card";
import Link from "next/link";

export function GridSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-10 mx-auto w-full">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-black min-h-[600px] lg:min-h-[300px] relative overflow-hidden rounded-2xl"
        className="z-10 relative"
      >
        <div className="max-w-xs relative z-30">
          <h2 className="text-left md:text-2xl lg:text-6xl font-bold tracking-[-0.015em] text-white">
            Athena
          </h2>
          <p className="mt-4 text-left text-xl text-neutral-100 font-semibold">
            Kit pistones - Kit cilindros - Kit juntas
          </p>
          <Link
            className="mt-4 inline-block bg-white text-black px-4 py-2 rounded-md"
            href="/products/athena"
          >
            Ver productos 
          </Link>
        </div>
        <Image
          src="/images/athena.jpg"
          width={1000}
          height={1000}
          alt="linear demo image"
          className="absolute inset-0 w-full h-full object-cover grayscale filter rounded-2xl opacity-40"
        />
      </WobbleCard>
      <WobbleCard
        containerClassName="col-span-1 min-h-[300px] relative overflow-hidden"
        className="z-10 relative"
      >
        <Image
          src="/images/ebc.webp"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-40"
        />
        <div className=" z-30 relative p-4">
          <h2 className="text-right md:text-2xl lg:text-4xl font-bold tracking-[-0.015em] text-white">
            EBC Frenos y embragues
          </h2>

          <Link
            className="mt-4 inline-block bg-white text-black px-4 py-2 rounded-md"
            href="/products/ebc"
          >
            Ver productos EBC
          </Link>
        </div>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <h2 className="text-left md:text-2xl lg:text-6xl font-bold tracking-[-0.015em] text-white">
          No shirt, no shoes, no weapons.
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          If someone yells "stop!", goes limp, or taps out, the fight is over.
        </p>
      </WobbleCard>
    </div>
  );
}
