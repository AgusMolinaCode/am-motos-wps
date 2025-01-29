"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const BrandLink = () => {
  const brands = [
    {
      imgUrl:
        "https://www.mxstore.com.au/assets/webshop/cms/48/2048.jpg?1501504351",
      brandId: "668",
      name: "Brand 1",
    },

    {
      imgUrl:
        "https://www.mxstore.com.au/assets/webshop/cms/01/234701.jpg?1566435970",
      brandId: "669",
      name: "Brand 5",
    },
    {
      imgUrl:
        "https://www.mxstore.com.au/assets/webshop/cms/80/256180.jpg?1699932899",
      brandId: "670",
      name: "Brand 6",
    },

    {
      imgUrl:
        "https://www.mxstore.com.au/assets/webshop/cms/60/234660.png?1592284135",
      brandId: "671",
      name: "Brand 8",
    },

    {
      imgUrl:
        "https://www.mxstore.com.au/assets/webshop/cms/82/582.jpg?1634613701",
      brandId: "672",
      name: "Brand 11",
    },
    {
      imgUrl:
        "https://www.mxstore.com.au/assets/webshop/cms/43/2143.jpg?1610690995",
      brandId: "673",
      name: "Brand 12",
    },
    {
      imgUrl:
        "https://www.mxstore.com.au/assets/webshop/cms/90/233690.jpg?1515364052",
      brandId: "674",
      name: "Brand 13",
    },
    {
      imgUrl:
        "https://www.mxstore.com.au/assets/webshop/cms/60/231960.jpg?1511237916",
      brandId: "675",
      name: "Brand 14",
    },
    {
      imgUrl:
        "https://www.mxstore.com.au/assets/webshop/cms/50/1750.jpg?1501504351",
      brandId: "676",
      name: "Brand 15",
    },

    {
      imgUrl:
        "https://www.mxstore.com.au/assets/webshop/cms/50/2050.jpg?1501504351",
      brandId: "677",
      name: "Brand 19",
    },
  ];

  return (
    <div className="pt-6 mx-auto">
      <div>
        <h1 className=" text-2xl font-bold underline uppercase">
          Mejores Marcas
        </h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-center items-center gap-2 mt-6 mx-auto content-center place-items-center">
        {brands.map(({ imgUrl, brandId, name }) => (
          <Link key={brandId} href={`/coleccion/${brandId}`} passHref>
            <div className="cursor-pointer">
              <Image
                src={imgUrl}
                alt={`Brand ${name}`}
                width={200}
                height={200}
              />
              {/* <p>{name}</p> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BrandLink;
