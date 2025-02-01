import { cn } from "@/lib/utils";
import { Racing_Sans_One } from "next/font/google";
import { Button } from "../ui/button";

const racingSansOne = Racing_Sans_One({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  variable: "--font-racing-sans-one",
});

const cardContents = {
  newProducts: {
    title: "Productos nuevos",
    description: "Descubre los últimos productos en stock",
  },
  deals: {
    title: "Ofertas especiales",
    description: "Aprovecha nuestras mejores promociones",
  },
};

export const CardBody = ({
  type = "newProducts",
  className = "",
}: {
  type?: keyof typeof cardContents;
  className?: string;
}) => {
  const content = cardContents[type];

  return (
    <div className="flex items-center justify-between p-2">
      <div className={cn("text-start", className)}>
        <h3
          className={cn(
            "text-3xl md:text-5xl font-bold mb-1 text-zinc-200",
            racingSansOne.className
          )}
        >
          {content.title}
        </h3>
        <p className="text-sm md:text-md  text-zinc-400 font-bold">
          {content.description}
        </p>
      </div>
      <div>
        <Button className="border dark:border-none border-zinc-500">Ver más</Button>
      </div>
    </div>
  );
};

//======================================
export const CardWithLines = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="border w-full rounded-md overflow-hidden dark:border-zinc-900 bg-zinc-950 p-1">
        <div
          className={`size-full bg-[url(/svg/circle-ellipsis.svg)] bg-repeat bg-[length:30px_30px]`}
        >
          <div className="size-full bg-gradient-to-tr from-zinc-950 via-zinc-950/80 to-zinc-900/10">
            {children}
          </div>
        </div>
      </div>
  );
};
