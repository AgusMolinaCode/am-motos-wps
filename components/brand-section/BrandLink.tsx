"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { brands } from "@/constants";
import SelectBrand from "./SelectBrand";
import { Button } from "../ui/button";


const BrandLink = () => {
  return (
    <div className="mx-auto pt-4 md:pt-10">
      <div className="flex flex-col md:flex-row justify-between gap-2 items-center">
        <h1 className="text-xl md:text-2xl font-bold underline uppercase dark:text-gray-300 text-gray-800">
          Mejores Marcas
        </h1>
        <div className="flex gap-2 items-center">
          <Link href="/brands">
            <Button>Ver todas las marcas</Button>
          </Link>
          <SelectBrand />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-center items-center gap-2 mt-6 mx-auto content-center place-items-center">
        {brands.map(({ imgUrl, brandId, name }) => {
          // Crear un slug amigable para SEO
          const brandSlug = name.toLowerCase().replace(/\s+/g, '-');
          
          return (
            <Link
              key={brandId}
              href={`/brand/${brandSlug}`}
              passHref
              className="border border-gray-300 dark:border-none hover:scale-105 transition-all duration-300"
            >
              <div className="cursor-pointer">
                <Image
                  src={imgUrl}
                  alt={`Brand ${name}`}
                  width={200}
                  height={200}
                  className="object-contain "
                />
                {/* <p>{name}</p> */}
              </div>
            </Link>
          );
        })}
      </div>
      
    </div>
  );
};

export default BrandLink;
