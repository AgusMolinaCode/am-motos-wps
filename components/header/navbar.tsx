import { ThemeToggle } from "@/components/theme/theme-toggle";
import SearchNavbar from "./SearchNavbar";
import Image from "next/image";
export default function Navbar() {
  return (
    <div className="flex justify-around items-center p-5">
      <div className="flex items-center gap-2">
        {/* <Image src="/images/escudo.png" alt="AM Motos Logo" width={80} height={80} /> */}
        <h1 className="text-xl font-black">AM MOTOS</h1>
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
