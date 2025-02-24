import React from "react";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AM MOTOS - CATALOGOS",
  description: "Catalogos de AM MOTOS",
};

const page = () => {
  const catalogos = [
    {
      id: 1,
      title: "Pro-x Offroad Catalogo",
      image: "/images/prox_dirt.png",
      href: "https://www.pro-x.com/wp-content/uploads/2024/07/ProX-Catalog-2024-DIRT.pdf",
    },
    {
      id: 2,
      title: "Catalogo Alpinestars",
      image:
        "https://www.wpsstatic.com/miscimages/catalog-front-covers/2025-Alpine-Collection.jpg",
      href: "http://catalogs.wps-inc.com/2025/alpinestars/",
    },
    {
      id: 6,
      title: "Pro-x ATV-UTV Catalogo",
      image: "/images/prox_atv.png",
      href: "https://www.pro-x.com/wp-content/uploads/2024/07/ProX-Catalog-2024-ATV-UTV.pdf",
    },
    {
      id: 4,
      title: "Catalogo Offroad",
      image:
        "https://www.wpsstatic.com/miscimages/catalog-front-covers/2024-Offroad-Cover.jpg",
      href: "http://catalogs.wps-inc.com/2023/offroad/",
    },
    {
      id: 3,
      title: "Catalogo ATV",
      image:
        "https://www.wpsstatic.com/miscimages/catalog-front-covers/2025-ATV-Cover.jpg",
      href: "http://catalogs.wps-inc.com/2025/atv/",
    },
    {
      id: 5,
      title: "Catalogo Road",
      image:
        "https://www.wpsstatic.com/miscimages/catalog-front-covers/2025-Street-Cover.jpg",
      href: "http://catalogs.wps-inc.com/2024/street/",
    },
    {
      id: 7,
      title: "Catalogo Wiseco",
      image:
        "https://raw.githubusercontent.com/AgusMolinaCode/AM.MOTOS/refs/heads/main/src/components/assets/wiseco2.webp",
      href: "https://issuu.com/racewinningbrands/docs/wiseco24_powersports_catalog_final_web?fr=sZjllZTYzMTM0Mjg",
    },
    {
      id: 8,
      title: "Catalogo Indumentaria",
      image:
        "https://www.wpsstatic.com/miscimages/catalog-front-covers/2025-Apparel-Cover.jpg",
      href: "http://catalogs.wps-inc.com/2025/apparel/",
    },
    {
      id: 9,
      title: "Catalogo Indumentaria Suplementaria",
      image:
        "https://www.wpsstatic.com/miscimages/catalog-front-covers/2024-Apparel-Supp-Cover.jpg",
      href: "http://catalogs.wps-inc.com/2024/apparel-supp/",
    },
    {
      id: 10,
      title: "Catalogo FLY Racing",
      image:
        "https://www.wpsstatic.com/miscimages/catalog-front-covers/2025-FLY-Racing-Cover.jpg",
      href: "http://catalogs.wps-inc.com/2025/fly_mx/",
    },
    {
      id: 11,
      title: "Catalogo Cubiertas / Herramientas",
      image:
        "https://www.wpsstatic.com/miscimages/catalog-front-covers/2024-Tires-Cover.jpg",
      href: "http://catalogs.wps-inc.com/2024/tires/",
    },
    {
      id: 12,
      title: "Catalogo FLY Racing Road",
      image:
        "https://www.wpsstatic.com/miscimages/catalog-front-covers/2023-FLY-Street-Cover.jpg",
      href: "http://catalogs.wps-inc.com/2023/flystreet/",
    },
  ];

  return (
    <main className="mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Nuestros Catálogos
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-2">
        {catalogos.map((catalogo) => (
          <a
            key={catalogo.id}
            href={catalogo.href}
            className="group relative block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* Skeleton loading */}
            <div className="aspect-square bg-gray-100 relative">
              <Image
                src={catalogo.image}
                alt={catalogo.title}
                width={600}
                height={600}
                className="object-fill  h-full transition-transform duration-300 group-hover:scale-105"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
              />
            </div>

            {/* Animación overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 flex items-center justify-center">
              <h2 className="text-white text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-4 transform">
                {catalogo.title}
              </h2>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
};

export default page;
