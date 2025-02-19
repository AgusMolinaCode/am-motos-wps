"use client";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import SearchNavbar from "./SearchNavbar";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavigationMenuDemo } from "./NavigationMenuDemo";
import { HeartIcon } from "lucide-react";
import BrandSelector from "./BrandSelector";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div>
      <div className="flex justify-around items-center pt-3 pb-2">
        <div>
          <Link href="/" className="flex items-center gap-2">
            {pathname !== "/" && (
              <Image
                src="/images/escudo.png"
                alt="AM Motos Logo"
                width={80}
                height={80}
                className=" h-12 lg:w-24 lg:h-16"
              />
            )}
            <h1 className="text-lg lg:text-xl font-black hover:dark:text-indigo-300 hover:text-indigo-800 duration-300">
              AM MOTOS
            </h1>
          </Link>
        </div>
        <div>
          <SearchNavbar />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle
            sunClassName={"text-orange-200"}
            moonClassName={"text-gray-700"}
          />
          <Link href="/favoritos" className="text-lg font-bold hover:dark:text-indigo-300 hover:text-indigo-800 duration-300">  
            <HeartIcon className="w-6 h-6" />
          </Link>
          <Link
            href="/catalogos"
            className="text-lg font-bold hover:dark:text-indigo-300 hover:text-indigo-800 duration-300"
          >
            Catalogos
          </Link>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mx-auto">
        <NavigationMenuDemo />
        <BrandSelector />
      </div>
    </div>
  );
}
