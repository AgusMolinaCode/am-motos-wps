import Image from "next/image";
import Link from "next/link";


const categories = [
  {
    href: "/coleccion/motor",
    imageSrc:
      "https://www.mxstore.com.au/assets/themes/2-20-66/img/home/home-tiles/bike-parts-icon.svg",
    productCount: "28.600",
    title: "Motor / Kit Pistones",
  },
  {
    href: "/coleccion/accesorios",
    imageSrc:
      "https://www.mxstore.com.au/assets/themes/2-20-66/img/home/home-tiles/bike-accessories-icon.svg",
    productCount: "5.200",
    title: "Accesorios",
  },
  {
    href: "/coleccion/indumentaria",
    imageSrc:
      "https://www.mxstore.com.au/assets/themes/2-20-66/img/home/home-tiles/riding-gear.svg",
    productCount: "1800",
    title: "Indumentaria",
  },
  {
    href: "/coleccion/cascos",
    imageSrc:
      "https://www.mxstore.com.au/assets/themes/2-20-66/img/home/home-tiles/protection-icon.svg",
    productCount: "1300",
    title: "Cascos / Protección",
  },
  {
    href: "/coleccion/herramientas",
    imageSrc:
      "https://www.mxstore.com.au/assets/themes/2-20-66/img/home/home-tiles/tools-icon.svg",
    productCount: "3200",
    title: "Herramientas",
  },
  {
    href: "/coleccion/casual",
    imageSrc:
      "https://www.mxstore.com.au/assets/themes/2-20-66/img/home/home-tiles/lifestyle-icon.svg",
    productCount: "5.200",
    title: "Casual",
  },
];

export default async function CategorySection() {
  return (
    <div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-4 md:pt-10">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={category.href}
            className="flex flex-col items-center justify-center border border-gray-300 dark:border-gray-700 rounded-xl hover:dark:bg-gray-900 hover:bg-gray-200 transition-all duration-300"
          >
            <Image
              src={category.imageSrc}
              alt="category"
              width={260}
              height={260}
            />
            <div className="py-4">
              <p className="text-center text-sm md:text-lg font-semibold dark:text-gray-400 text-gray-600">
                + {category.productCount} productos
              </p>
              <p className="text-center text-md md:text-2xl font-bold dark:text-gray-200 text-gray-800">
                {category.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
