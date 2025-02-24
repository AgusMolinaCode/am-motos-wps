import Image from "next/image";
import Link from "next/link";
import React from "react";

const MercadoLibreBanner = () => {
  return (
    <div className="col-span-1 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-lg shadow-lg p-4 mx-auto w-full h-full">
      <div className="flex flex-col items-center justify-center space-y-4 h-full">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center">
          Encontranos tambien en MercadoLibre
        </h2>
        
        <div className="flex flex-col gap-4 items-center">
          <Image 
            src="/images/mercado-libre-logo.png" 
            alt="MercadoLibre Logo" 
            width={200} 
            height={200} 
            className="max-w-[200px] md:max-w-[250px]"
          />
          <Image 
            src="/images/reputacion-ml.png" 
            alt="Reputación MercadoLibre" 
            width={350} 
            height={350} 
            className=""
          />
        </div>

        <p className="text-base md:text-lg text-gray-800 text-center max-w-md">
          Encuentra los mejores repuestos y accesorios para tu moto
        </p>
        
        <Link
          target="_blank"
          href="https://listado.mercadolibre.com.ar/_CustId_34687326?item_id=MLA1345323752&category_id=MLA22655&seller_id=34687326&client=recoview-selleritems&recos_listing=true#origin=vip&component=sellerData&typeSeller=classic"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 text-base md:text-lg"
        >
          Ver productos en MercadoLibre
        </Link>
      </div>
    </div>
  );
};

export default MercadoLibreBanner;
