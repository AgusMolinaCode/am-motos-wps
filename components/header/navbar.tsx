"use client";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import SearchNavbar from "./SearchNavbar";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavigationMenuDemo } from "./NavigationMenuDemo";
import { HeartIcon } from "lucide-react";
import BrandSelector from "./BrandSelector";
import { SheetSide } from "./SheetSide";
export default function Navbar() {
  const pathname = usePathname();

  return (
    <div>
      <div className="flex justify-around items-center pt-3 pb-2">
        <div className="md:hidden flex items-center justify-start">
          <SheetSide />
          <ThemeToggle
            sunClassName={"text-orange-200"}
            moonClassName={"text-gray-700"}
          />
        </div>
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/escudo.png"
              alt="AM Motos Logo"
              width={80}
              height={80}
              className="w-24 h-14 md:hidden"
            />
            {pathname !== "/" && (
              <Image
                src="/images/escudo.png"
                alt="AM Motos Logo"
                width={80}
                height={80}
                className="w-24 h-14 hidden md:block"
              />
            )}
            <h1 className="text-lg lg:text-xl font-black hover:dark:text-indigo-300 hover:text-indigo-800 duration-300 md:block hidden">
              AM MOTOS
            </h1>
          </Link>
        </div>
        <div className="md:flex hidden">
          <SearchNavbar />
        </div>
        <div className="flex items-center gap-2">
          <div className="md:flex hidden">
            <ThemeToggle
              sunClassName={"text-orange-200"}
              moonClassName={"text-gray-700"}
            />
          </div>
          <div className="md:flex hidden">
            <Link
              href="/favoritos"
              className="text-lg font-bold hover:dark:text-indigo-300 hover:text-indigo-800 duration-300"
            >
              <HeartIcon className="w-4 h-4 md:w-6 md:h-6" />
            </Link>
          </div>
          <Link
            href="/catalogos"
            className="text-[1.1rem] md:text-lg font-bold hover:dark:text-indigo-300 hover:text-indigo-800 duration-300"
          >
            Catalogos
          </Link>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mx-auto">
        <div className="md:hidden flex">
          <SearchNavbar />
        </div>
        <NavigationMenuDemo />
        <BrandSelector />
      </div>
    </div>
  );
}
