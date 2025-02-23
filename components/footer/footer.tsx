import React from "react";
import Image from "next/image";
import { Separator } from "../ui/Separator";
import Link from "next/link";
import { InfiniteSliderBasic } from "../header/InfiniteSliderBasic";

const footer = () => {
  return (
    <div className="pt-16 md:pt-28">
      <InfiniteSliderBasic />
      <Separator />
      <div className="flex flex-col mx-auto w-full items-center justify-center md:flex-row md:justify-between py-10 gap-4">
        <div className="flex flex-col items-center md:items-start justify-center md:justify-start gap-2">
          <Image
            src="/images/escudo.png"
            alt="AM MOTOS"
            width={90}
            height={90}
          />
          <div>
            <h1 className="text-lg md:text-xl font-bold text-center md:text-left">
              AM MOTOS
            </h1>
            <p className="text-sm md:text-md text-center md:text-left">
              Alsina 112, Pilar, Buenos Aires
            </p>
          </div>
        </div>
        <div>
          <Link href="https://wa.me/5491150494936" target="_blank">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Image
                src="/svg/whatsapp.svg"
                alt="Whatsapp"
                width={32}
                height={32}
                className="w-[18px] h-[18px] md:w-[32px] md:h-[32px]"
              />
              <p className="text-xl font-bold">11 5049-4936</p>
            </div>
          </Link>
          <div className="flex gap-4 pt-2 justify-center md:justify-start">
            <Link href="https://www.facebook.com/AM.MOTOSPILAR" target="_blank">
              <Image
                src="/svg/facebook.svg"
                alt="Facebook"
                width={32}
                height={32}
                className="w-[18px] h-[18px] md:w-[32px] md:h-[32px]"
              />
            </Link>
            <Link href="https://www.instagram.com/am.motos1/" target="_blank">
              <Image
                src="/svg/instagram.svg"
                alt="Instagram"
                width={32}
                height={32}
                className="w-[18px] h-[18px] md:w-[32px] md:h-[32px]"
              />
            </Link>
          </div>
          <p className="text-sm md:text-md text-gray-500 pt-2">
            Desarrollado por{" "}
            <Link
              href="https://www.linkedin.com/in/agustin-molina-994635138/"
              target="_blank"
              className="dark:text-blue-300 text-blue-500 hover:text-blue-800 hover:dark:text-blue-500"
            >
              Agustin Molina
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default footer;
