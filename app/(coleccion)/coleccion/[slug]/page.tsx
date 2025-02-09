import { getStatusItems, getCollectionByProductType } from "@/lib/brands";
import { BrandStatus } from "@/types/interface";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import ProductTypeFilter from "@/components/brand-section/ProductTypeFilter";
import productBrands from "@/public/csv/product_brands.json";
import BrandFilterButtons from "../../../../components/category-section/CollectionFilterButtons";
import { productTypeMap, ProductTypeUrlReverseMap } from "@/constants";
import CursorPage from "@/components/cursor-page/CursorPage";
import ColeccionImage from "@/components/category-section/ColeccionImage";
import ProductDetailsSheet from "@/components/shared/ProductDetailsSheet";
import FavoriteButton from "@/components/shared/FavoriteButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CollectionPage({
  params,
  searchParams,
}: PageProps) {
  const slug = params.slug;

  // Obtener el tipo de producto original en inglés si existe una traducción
  const originalProductType =
    ProductTypeUrlReverseMap[
      slug.toLowerCase() as keyof typeof ProductTypeUrlReverseMap
    ] || slug;

  // Codificar correctamente el productType
  const productType =
    typeof searchParams.productType === "string"
      ? searchParams.productType.replace(/&/g, "%26")
      : "";

  // Obtener el brandId de los searchParams
  const brandId =
    typeof searchParams.brandId === "string" ? searchParams.brandId : undefined;

  // Codificar correctamente el cursor
  const cursor =
    typeof searchParams.cursor === "string"
      ? searchParams.cursor.replace(/&/g, "%26")
      : null;

  let data: BrandStatus[] = [];
  let meta: any = {};

  if (slug === "productos-nuevos" || slug === "productos-ofertas") {
    // Obtener los datos de la colección NEW o CLO
    const result = await getStatusItems(
      slug === "productos-nuevos" ? "NEW" : "CLO",
      cursor,
      productType || undefined
    );
    data = result.data;
    meta = result.meta;
  } else {
    // Obtener los datos de una colección específica usando el tipo de producto original
    const result = await getCollectionByProductType(
      originalProductType,
      cursor,
      brandId
    );
    data = result.data;
    meta = result.meta;
  }

  // Obtener las marcas asociadas a los tipos de producto actuales
  const currentProductTypes = (
    productTypeMap[slug.toLowerCase()] || originalProductType
  ).split(",");
  const associatedBrands = currentProductTypes.reduce<string[]>((acc, type) => {
    const brands = productBrands[type as keyof typeof productBrands] || [];
    return [...acc, ...brands];
  }, []);

  // Eliminar duplicados en la lista de marcas
  const uniqueAssociatedBrands = Array.from(new Set(associatedBrands));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {slug === "productos-nuevos"
          ? "Productos Nuevos"
          : slug === "productos-ofertas"
          ? "Ofertas Especiales"
          : slug.replace(/-/g, " ")}
      </h1>

      {/* Mostrar siempre el selector de tipos de producto */}
      <ProductTypeFilter
        slug={slug}
        currentBrandProductTypes={[]}
        selectedProductType={productType}
      />

      {/* Mostrar botones para filtrar por brand_id si no es NEW o CLO */}
      {slug !== "productos-nuevos" &&
        slug !== "productos-ofertas" &&
        uniqueAssociatedBrands.length > 0 && (
          <BrandFilterButtons
            slug={slug}
            productType={productType}
            associatedBrands={uniqueAssociatedBrands}
          />
        )}

      {data.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 rounded-lg">
          <p className="text-xl text-gray-600">No se encontraron productos</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {data.map((item: BrandStatus) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col relative"
              >
                <div className="absolute top-2 right-2 z-10">
                  <FavoriteButton item={item} />
                </div>
                <h2 className="text-lg font-semibold mb-2 truncate">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  SKU: {item.supplier_product_id}
                </p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-green-600">
                    ${item.standard_dealer_price}
                  </span>
                  <span className="text-sm text-blue-600">
                    Inventario: {item.inventory?.data?.total || 0}
                  </span>
                </div>
                <ColeccionImage item={item} />
                <ProductDetailsSheet item={item} />
              </div>
            ))}
          </div>

          <CursorPage
            meta={meta}
            slug={slug}
            productType={productType}
            brandId={brandId}
          />
        </>
      )}
    </div>
  );
}
