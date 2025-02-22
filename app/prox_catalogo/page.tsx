"use client";

import ProxCatalog from "@/components/catalogo-prox/ProxCatalogo";
import axios from "axios";
import * as cheerio from "cheerio";
import { Cross, CrossIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface ScrapedData {
  title: string | null;
  price: string | null;
  imageUrl: string | null;
  sku: string | null;
}

async function scrapeProX(partNumber: string): Promise<ScrapedData> {
  try {
    const url = `https://www.pro-x.com/?s=${partNumber}&post_type=product`;
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    // Parseando datos
    const title =
      $(".woocommerce-loop-product__title").first().text().trim() || null;
    const price = $(".woocommerce-Price-amount").first().text().trim() || null;
    const imageUrl = $("li.product img").first().attr("src") || null;
    const sku = $(".price").text().trim() || null;

    return { title, price, imageUrl, sku };
  } catch (error) {
    console.error("Error scraping data:", error);
    return { title: null, price: null, imageUrl: null, sku: null };
  }
}

export default function page() {
  const [partNumber, setPartNumber] = useState("");
  const [searchedPartNumber, setSearchedPartNumber] = useState("");
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [dolar, setDolar] = useState<number | null>(null);

  useEffect(() => {
    const fetchDolar = async () => {
      try {
        const response = await fetch("https://criptoya.com/api/dolar");
        const data = await response.json();
        setDolar(data.blue.ask);
      } catch (error) {
        console.error("Error fetching dolar:", error);
      }
    };

    fetchDolar();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    const data = await scrapeProX(partNumber);
    setScrapedData(data);
    setSearchedPartNumber(partNumber);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  const handleReset = () => {
    setPartNumber("");
    setScrapedData(null);
  };

  const adjustPrice = (
    price: string | null,
    title: string | null
  ): string | null => {
    if (!price || !dolar) return null;
    let numericPrice = parseFloat(price.replace(/[^0-9.-]+/g, ""));
    if (title && title.toLowerCase().includes("connecting rod")) {
      numericPrice += 37;
    } else if (title && title.toLowerCase().includes("basket")) {
      numericPrice += 32;
    } else if (title && title.toLowerCase().includes("steel rear")) {
      numericPrice += 32;
    } else if (title && title.toLowerCase().includes("rollerchain")) {
      numericPrice += 25;
    } else {
      numericPrice += 15;
    }
    const adjustedPrice = numericPrice * dolar + 30000;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(adjustedPrice);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartNumber(e.target.value.toUpperCase());
  };

  return (
    <div className="flex flex-col items-center  md:p-6">
      {!loading && !scrapedData && (
        <p className="text-black dark:text-white text-lg md:text-xl my-1 md:mt-8 font-outfit text-center">
          Ingresa el numero de pieza Pro-x
        </p>
      )}
      <div className="relative flex flex-wrap gap-2 items-center justify-center my-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Numero de pieza Pro-x"
            value={partNumber}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            className="border p-2 border-gray-200 text-center font-bold text-xl md:text-2xl rounded-xl font-outfit pr-3 md:pr-8 placeholder:text-xl"
          />
          {partNumber && (
            <button
              className="absolute top-0 right-2 h-full w-6 md:w-8 text-red-400 hover:text-red-600"
              onClick={handleReset}
            >
              <CrossIcon className="rotate-45" />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !partNumber}
          className="bg-blue-700 text-white font-bold text-xl md:text-2xl p-2  hover:bg-blue-900 rounded-xl duration-200 font-formula disabled:opacity-50"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {scrapedData && (
        <div className="p-2 md:p-6 flex justify-center mx-auto sm:w-full">
          {scrapedData.title ? (
            <div className="flex flex-col sm:flex-row gap-2 justify-center mx-auto">
              <div>
                {scrapedData.imageUrl && (
                  <img
                    src={scrapedData.imageUrl}
                    alt={scrapedData.title ?? "No Image"}
                    className="max-w-[400px] max-h-[400px] rounded-lg shadow-lg flex justify-center mx-auto"
                  />
                )}
              </div>
              <div className="mx-auto">
                <p className=" text-xl md:text-2xl text-center md:text-left font-outfit font-bold mb-2">
                  {scrapedData.title}
                </p>
                <p className="text-2xl md:text-3xl text-center md:text-left font-bold font-outfit mb-2">
                  {adjustPrice(scrapedData.price, scrapedData.title)} pesos
                </p>
                <p className="text-black dark:text-gray-300 text-md text-center md:text-left font-outfit font-semibold">
                  Codigo: {searchedPartNumber.toUpperCase()}
                </p>
                <p className="text-black dark:text-gray-300 text-md text-center md:text-left font-outfit font-semibold">
                  Demora de 20 a 25 dias habiles
                </p>
              </div>
            </div>
          ) : (
            <p className="text-red-700 text-center text-lg font-semibold">
              No se encontraron resultados para el numero de pieza{" "}
              <span className="font-bold">{searchedPartNumber}</span>.
            </p>
          )}
        </div>
      )}

      {loading && (
        <p className="text-black dark:text-white text-lg font-semibold my-4">
          Buscando numero de pieza: {partNumber}
        </p>
      )}

      <ProxCatalog />
    </div>
  );
}
