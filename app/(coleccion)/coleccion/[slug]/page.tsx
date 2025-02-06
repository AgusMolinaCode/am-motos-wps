import { getStatusItems, getCollectionByProductType } from "@/lib/brands";
import { BrandStatus } from "@/types/interface";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import ProductTypeFilter from "@/components/brand-section/ProductTypeFilter";
import productBrands from "@/public/csv/product_brands.json";
import BrandFilterButtons from "../../../../components/category-section/CollectionFilterButtons";
import { productTypeMap } from "@/constants";
import CursorPage from "@/components/cursor-page/CursorPage";

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

  // Mapa de tipos de producto para colecciones específicas

  // Codificar correctamente el productType
  const productType =
    typeof searchParams.productType === "string"
      ? searchParams.productType.replace(/&/g, "%26")
      : productTypeMap[slug.toLowerCase()]
      ? productTypeMap[slug.toLowerCase()].replace(/&/g, "%26")
      : undefined;

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

  if (slug === "NEW" || slug === "CLO") {
    // Obtener los datos de la colección NEW o CLO
    const result = await getStatusItems(
      slug === "NEW" ? "NEW" : "CLO",
      cursor,
      productType
    );
    data = result.data;
    meta = result.meta;
  } else {
    // Obtener los datos de una colección específica
    const result = await getCollectionByProductType(
      slug,
      cursor,
      brandId // Pasar el brandId aquí
    );
    data = result.data;
    meta = result.meta;
  }

  // Obtener las marcas asociadas a los tipos de producto actuales
  const currentProductTypes = (
    productTypeMap[slug.toLowerCase()] || slug
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
        {slug === "NEW"
          ? "Productos Nuevos"
          : slug === "CLO"
          ? "Ofertas Especiales"
          : slug}
      </h1>

      {/* Mostrar siempre el selector de tipos de producto */}
      <ProductTypeFilter
        slug={slug}
        currentBrandProductTypes={[]}
        selectedProductType={productType}
      />

      {/* Mostrar botones para filtrar por brand_id si no es NEW o CLO */}
      {slug !== "NEW" &&
        slug !== "CLO" &&
        uniqueAssociatedBrands.length >= 0 && (
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
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col"
              >
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
                {item.images?.data?.length > 0 ? (
                  <Image
                    priority
                    src={`https://${item.images.data[0].domain}${item.images.data[0].path}${item.images.data[0].filename}`}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-contain mb-2"
                  />
                ) : (
                  <Image
                    priority
                    src="https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                    alt={item.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-contain mb-2"
                  />
                )}
                <Link
                  href={`/product/${item.supplier_product_id}`}
                  className="mt-auto inline-block text-sm text-indigo-600 hover:underline text-center"
                >
                  Ver detalles
                </Link>
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
