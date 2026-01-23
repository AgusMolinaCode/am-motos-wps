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
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div>
      <div className="flex justify-between items-center pt-3 pb-2">
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
        <div className="md:hidden flex items-center justify-start gap-4">
          <ThemeToggle
            sunClassName={"text-orange-200"}
            moonClassName={"text-gray-700"}
          />
          <SheetSide />
        </div>

        <div className="md:flex hidden">
          <SearchNavbar />
        </div>
        <div className="items-center gap-2 md:flex hidden">
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
            className="text-[1.1rem] md:text-lg font-bold hover:dark:text-indigo-300 hover:text-indigo-800 duration-300 hidden md:block"
          >
            Catalogos
          </Link>
          <div className="md:flex hidden">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="inline-block bg-white text-black px-1 sm:px-4 py-1 sm:py-2 rounded-md cursor-pointer">
                  Mayoristas
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
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
