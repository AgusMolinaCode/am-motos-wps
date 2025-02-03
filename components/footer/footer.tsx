import React from "react";
import Image from "next/image";
import { Separator } from "../ui/Separator";
import Link from "next/link";
import { Facebook } from "lucide-react";

const footer = () => {
  return (
    <div className="pt-16 md:pt-28 max-w-7xl mx-auto px-2">
      <Separator gradient />
      <div className="flex justify-between py-10">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/images/escudo.png"
            alt="AM MOTOS"
            width={160}
            height={160}
          />
          <div>
            <h1 className="text-xl font-bold">AM MOTOS</h1>
            <p className="text-md">Alsina 112, Pilar, Buenos Aires</p>
          </div>
        </div>
        <div>
          <Link href="https://wa.me/5491150494936" target="_blank">
            <div className="flex items-center gap-2">
              <Image
                src="/svg/whatsapp.svg"
                alt="Whatsapp"
                width={32}
                height={32}
              />
              <p className="text-xl font-bold">11 5049-4936</p>
            </div>
          </Link>
          <div className="flex gap-4 pt-2">
            <Link href="https://www.facebook.com/AM.MOTOSPILAR" target="_blank">
              <Image
                src="/svg/facebook.svg"
                alt="Facebook"
                width={32}
                height={32}
              />
            </Link>
            <Link href="https://www.instagram.com/am.motos1/" target="_blank">
              <Image
                src="/svg/instagram.svg"
                alt="Instagram"
                width={32}
                height={32}
              />
            </Link>
          </div>
          <p className="text-md text-gray-500 pt-2">
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
