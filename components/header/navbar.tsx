"use client";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import SearchNavbar from "./SearchNavbar";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="flex justify-around items-center p-5">
      <div>
        <Link href="/" className="flex items-center gap-2">
          {pathname !== "/" && (
            <Image
              src="/images/escudo.png"
              alt="AM Motos Logo"
              width={80}
              height={80}
            />
          )}
          <h1 className="text-xl font-black hover:dark:text-indigo-300 hover:text-indigo-800 duration-300">
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
        <p className="text-lg font-bold">Catalogos</p>
      </div>
    </div>
  );
}
