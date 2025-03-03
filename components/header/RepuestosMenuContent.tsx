import React from "react";
import Link from "next/link";
import partsData from "@/public/csv/parts_moto.json";
import { ProductTypeUrlMap, Product_Type_Translations } from "@/constants";

interface RepuestosMenuContentProps {
  closeAll: () => void;
}

const RepuestosMenuContent: React.FC<RepuestosMenuContentProps> = ({ closeAll }) => {
  const getProductTypeUrl = (type: string) => {
    // Primero intentamos obtener la URL traducida
    const urlSlug = ProductTypeUrlMap[type as keyof typeof ProductTypeUrlMap];
    if (urlSlug) {
      return urlSlug;
    }
    // Si no existe, convertimos el tipo a un slug amigable
    return type.toLowerCase().replace(/\s+/g, '-').replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
  };

  const getTranslatedName = (type: string) => {
    // Obtener la traducción del nombre si existe
    return Product_Type_Translations[type as keyof typeof Product_Type_Translations] || type;
  };

  const repuestosMasBuscados = {
    Brakes: "Frenos",
    Engine: "Motor",
    "Piston kits & Components": "Kit de pistones",
    Chemicals: "Aceites",
    Body: "Plasticos",
    Clutch: "Embragues",
    Exhaust: "Escapes",
    "Air Filters": "Filtros de aire",
    "Gaskets/Seals": "Kit de Juntas",
  };

  const traduccionesRepuestos = {
    Batteries: "Baterías",
    Belts: "Correas",
    "Cable/Hydraulic Control Lines": "Cables",
    Chains: "Cadena",
    Drive: "Transmisión",
    Electrical: "Electrónica",
    "Engine Management": "CDI ó ECU",
    "Foot Controls": "Pedales",
    Forks: "Suspensión",
    "Fuel Tank": "Tanques de nafta",
    "Gas Caps": "Tapas de tanques",
    "Gauges/Meters": "Velocimetros",
    "Intake/Carb/Fuel System": "Carburadores / Inyección",
    "Graphics/Decals": "Graficos",
    Grips: "Puños",
    Handguards: "Cubre manos",
    Handlebars: "Manubrios",
    "Hardware/Fasteners/Fittings": "Tornillería",
    Illumination: "Luces",
    Jets: "Reparacion Carburadores",
    Levers: "Palancas",
    Mirrors: "Espejos",
    "Oil Filters": "Filtros de aceite",
    Seat: "Asientos",
    "Spark Plugs": "Bujías y capuchones",
    Sprockets: "Coronas y Piñones",
    Starters: "Arranques",
    Steering: "Dirección",
    Throttle: "Acelerador",
    Tools: "Herramientas",
    "Guards/Braces": "Protecciónes",
    "Hand Controls": "Controles manubrios",
  };

  // Filtrar los repuestos más buscados
  const repuestosMasBuscadosTraducidos = partsData.data
    .filter(
      (part) =>
        repuestosMasBuscados[part.name as keyof typeof repuestosMasBuscados]
    )
    .map((part) => ({
      ...part,
      originalName: part.name,
      name: repuestosMasBuscados[
        part.name as keyof typeof repuestosMasBuscados
      ],
    }));

  // Filtrar los repuestos que no están en la lista de más buscados
  const masRepuestos = partsData.data.filter(
    (part) =>
      !repuestosMasBuscados[part.name as keyof typeof repuestosMasBuscados]
  );

  const masRepuestosTraducidos = masRepuestos.map((part) => ({
    ...part,
    originalName: part.name,
    name:
      traduccionesRepuestos[part.name as keyof typeof traduccionesRepuestos] ||
      part.name,
  }));

  return (
    <ul className="grid gap-3 p-4 md:w-[700px] lg:w-[1000px]">
      <div className="">
        <h3 className="font-bold text-sm md:text-lg mb-2 text-black dark:text-white">
          Repuestos más buscados
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm md:text-base bg-gray-200 dark:bg-zinc-900 p-2 rounded-md">
          {repuestosMasBuscadosTraducidos.map((part) => (
            <Link
              key={part.id}
              href={`/coleccion/${getProductTypeUrl(part.originalName)}`}
              className="hover:bg-gray-300 font-normal dark:hover:bg-gray-800 p-1 rounded text-black dark:text-white"
              onClick={closeAll}
            >
              {getTranslatedName(part.originalName)}
            </Link>
          ))}
        </div>
        <h3 className="font-bold text-sm md:text-lg mb-2 text-black dark:text-white mt-4 md:mt-0">
          Más repuestos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm md:text-base">
          {masRepuestosTraducidos.map((part) => (
            <Link
              key={part.id}
              href={`/coleccion/${getProductTypeUrl(part.originalName)}`}
              className="hover:bg-gray-300 font-xs dark:hover:bg-gray-800 p-1 rounded text-black dark:text-white flex flex-col items-start"
              onClick={closeAll}
            >
              <span className="break-words w-full">
                {getTranslatedName(part.originalName)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </ul>
  );
};

export default RepuestosMenuContent;
