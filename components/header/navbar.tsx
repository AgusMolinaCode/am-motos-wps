"use client";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import SearchNavbar from "./SearchNavbar";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavigationMenuDemo } from "./NavigationMenuDemo";
import { ShoppingCart } from "lucide-react";
import BrandSelector from "./BrandSelector";
import { SheetSide } from "./SheetSide";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useCart } from "@/hooks/useCart";

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();

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
          {/* Icono del carrito - mobile */}
          <Link
            href="/checkout"
            className="relative text-lg font-bold hover:dark:text-indigo-300 hover:text-indigo-800 duration-300"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
          <SheetSide />
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        <div className="md:flex hidden">
          <SearchNavbar />
        </div>
        <div className="items-center gap-2 lg:gap-4 md:flex hidden">
          <div className="md:flex hidden">
            <ThemeToggle
              sunClassName={"text-orange-200"}
              moonClassName={"text-gray-700"}
            />
          </div>

          <SignedIn>
            <Link
              href="/mayoristas"
              className="text-[1.1rem] md:text-lg font-bold hover:dark:text-indigo-300 hover:text-indigo-800 duration-300 hidden md:block"
            >
              Mi Cuenta
            </Link>
          </SignedIn>
          <SignedOut>
            <Link
              href="/catalogos"
              className="text-[1.1rem] md:text-lg font-bold hover:dark:text-indigo-300 hover:text-indigo-800 duration-300 hidden md:block"
            >
              Catalogos
            </Link>
          </SignedOut>
          {/* Icono del carrito */}
          <Link
            href="/checkout"
            className="relative text-lg font-bold hover:dark:text-indigo-300 hover:text-indigo-800 duration-300"
          >
            <ShoppingCart className="w-4 h-4 md:w-6 md:h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
          
          <div className="md:flex hidden">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="group relative inline-flex h-[calc(38px+8px)] items-center justify-center rounded-full bg-neutral-600 dark:bg-neutral-950 py-1 pl-4 pr-14 font-medium dark:border border-gray-500 text-neutral-50">
                  <span className="z-10 pr-2">Mayoristas</span>
                  <div className="absolute right-1 inline-flex h-10 w-10 items-center justify-end rounded-full bg-neutral-700 transition-[width] group-hover:w-[calc(100%-8px)]">
                    <div className="mr-3.5 flex items-center justify-center">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-neutral-50"
                      >
                        <path
                          d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
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
