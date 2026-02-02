"use server";

import React from "react";
import {
  BrandId,
  Brands,
  BrandStatus,
  VehicleDataId,
  VehicleCompatibilityData,
  VehicleModel,
  VehicleItem,
  VehicleItemsResponse,
} from "@/types/interface";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
 type Product = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
 type Brand = any;

// ============================================
// CACHE CONFIGURATION
// ============================================

/**
 * React.cache() deduplica llamadas durante el mismo request.
 * Si la misma función se llama múltiples veces con los mismos argumentos,
 * solo se ejecuta una vez y el resultado se comparte.
 * 
 * Regla aplicada: server-cache-react
 */

// ============================================
// BRAND FUNCTIONS
// ============================================

/**
 * Obtiene items de una marca con paginación
 * Optimizado: paraleliza count y findMany
 * Regla aplicada: async-parallel
 */
export async function getBrandsItems(
  brandId: string,
  productType?: string,
  page: number = 1,
  limit: number = 30,
): Promise<{ data: BrandId[]; total: number }> {
  const where = {
    brand_id: parseInt(brandId),
    ...(productType && {
      product_type: decodeURIComponent(productType).replace(/%26/g, "&"),
    }),
    inventory_total: { gt: -1 },
  };

  // Paralelizar count y findMany - son independientes
  const [productsData, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  // Transformar al formato BrandId
  const transformedData = productsData.map((product) => {
    const images = product.images as string[] | null;

    return {
      id: parseInt(product.wps_id),
      wps_id: product.wps_id,
      brand_id: product.brand_id ?? undefined,
      name: product.name,
      sku: product.sku ?? undefined,
      supplier_product_id: product.supplier_product_id ?? undefined,
      list_price: product.list_price?.toString() ?? "0",
      standard_dealer_price: product.dealer_price?.toString() ?? "0",
      product_type: product.product_type ?? undefined,
      status: product.status ?? undefined,
      weight: product.weight?.toNumber() ?? 0,
      inventory: {
        data: {
          total: product.inventory_total ?? 0,
        },
      },
      images: {
        data: images ?? [],
      },
    };
  });

  return {
    data: transformedData as unknown as BrandId[],
    total,
  };
}

/**
 * Obtiene todas las marcas o una específica
 * Cacheada con React.cache() para deduplicación
 */
export const getBrands = React.cache(async (
  brandId?: string | null,
): Promise<{ data: Brands[]; count: number }> => {
  try {
    // Validar y sanitizar el brandId
    const sanitizedBrandId =
      brandId && /^\d+$/.test(brandId) ? parseInt(brandId) : null;

    // Si se solicita una marca específica
    if (sanitizedBrandId) {
      const brand = await prisma.brand.findUnique({
        where: { id: sanitizedBrandId },
      });

      if (!brand) {
        return { data: [], count: 0 };
      }

      return {
        data: [
          {
            id: brand.id,
            name: brand.name,
            created_at: brand.created_at,
            updated_at: brand.updated_at,
          },
        ],
        count: 1,
      };
    }

    // Obtener todas las marcas de la base de datos
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
    });

    return {
      data: brands.map((brand) => ({
        id: brand.id,
        name: brand.name,
        created_at: brand.created_at,
        updated_at: brand.updated_at,
      })),
      count: brands.length,
    };
  } catch {
    return { data: [], count: 0 };
  }
});

/**
 * Obtiene el nombre de una marca
 * Cacheada con React.cache() para deduplicación
 */
export const getBrandName = React.cache(async (brandId: string): Promise<string> => {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: parseInt(brandId) },
    });

    if (brand) {
      return brand.name;
    }
  } catch {
    // Silencioso
  }

  // Fallback: buscar en brandData importado
  const { default: brandData } = await import("@/public/csv/brand2.json");
  const localBrand = brandData.find((b: { id: number; name: string }) => b.id.toString() === brandId);
  if (localBrand) {
    return localBrand.name;
  }

  return brandId;
});

// ============================================
// PRODUCT TYPE MAPPING
// ============================================

const ProductTypeUrlReverseMap: Record<string, string> = {
  "protective-safety": "Protective/Safety",
  "tank-tops": "Tank Tops",
  "piston-kits-components": "Piston kits & Components",
  "mounts-brackets": "Mounts/Brackets",
  "replacement-parts": "Replacement Parts",
  "utv-cab-roof-door": "UTV Cab/Roof/Door",
  "foot-controls": "Foot Controls",
  "utility-containers": "Utility Containers",
  "track-kit": "Track Kit",
  "air-filters": "Air Filters",
  "hardware-fasteners-fittings": "Hardware/Fasteners/Fittings",
  "cable-hydraulic-control-lines": "Cable/Hydraulic Control Lines",
  "gauges-meters": "Gauges/Meters",
  "intake-carb-fuel-system": "Intake/Carb/Fuel System",
  "engine-management": "Engine Management",
  "fuel-tanks": "Fuel Tank",
};

// ============================================
// COLLECTION FUNCTIONS
// ============================================

/**
 * Obtiene productos por tipo de producto con paginación
 * Optimizado: paraleliza count y findMany
 * Regla aplicada: async-parallel
 */
export async function getCollectionByProductType(
  productType: string,
  page: number = 1,
  brandId?: string,
  limit: number = 30,
): Promise<{
  data: BrandStatus[];
  total: number;
}> {
  // Mapear los tipos de producto de la URL a los tipos de la DB
  const productTypeMap: Record<string, string> = {
    motor: "Engine,Piston kits & Components",
    accesorios: "Accessories",
    indumentaria: "Pants,Jerseys,Footwear,Gloves,Eyewear",
    cascos: "Helmets,Protective/Safety",
    proteccion: "Protective/Safety,Luggage,Bags",
    herramientas: "Tools",
    casual:
      "Vests,Sweaters,Suits,Socks,Shorts,Shoes,Jackets,Hoodies,Bags,Luggage",
    "protective-safety": "Protective/Safety",
    "tank-tops": "Tank Tops",
    "piston-kits-components": "Piston kits & Components",
    "mounts-brackets": "Mounts/Brackets",
    "replacement-parts": "Replacement Parts",
    "utv-cab-roof-door": "UTV Cab/Roof/Door",
    "foot-controls": "Foot Controls",
    "utility-containers": "Utility Containers",
    "track-kit": "Track Kit",
    "air-filters": "Air Filters",
    "hardware-fasteners-fittings": "Hardware/Fasteners/Fittings",
    "cable-hydraulic-control-lines": "Cable/Hydraulic Control Lines",
    "gauges-meters": "Gauges/Meters",
    "intake-carb-fuel-system": "Intake/Carb/Fuel System",
    "engine-management": "Engine Management",
    "fuel-tanks": "Fuel Tank",
    "gas-caps": "Gas Caps",
    "graphics-decals": "Graphics/Decals",
    "guards-braces": "Guards/Braces",
    "hand-controls": "Hand Controls",
    "spark-plugs": "Spark Plugs",
    "oil-filters": "Oil Filters",
  };

  // Sanitizar y mapear el tipo de producto
  const sanitizedProductType =
    ProductTypeUrlReverseMap[productType.toLowerCase()] ||
    productTypeMap[productType.toLowerCase()] ||
    productType;

  // Determinar los tipos de producto a filtrar
  const productTypes = sanitizedProductType.split(",").map((pt) => pt.trim());

  const where = {
    ...(productTypes.length === 1
      ? { product_type: productTypes[0] }
      : { product_type: { in: productTypes } }),
    ...(brandId && { brand_id: parseInt(brandId) }),
    inventory_total: { gt: -1 },
  };

  // Paralelizar count y findMany
  const [productsData, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  // Transformar al formato BrandStatus
  const transformedData = productsData.map((product) => {
    const images = product.images as string[] | null;

    return {
      id: parseInt(product.wps_id),
      wps_id: product.wps_id,
      brand_id: product.brand_id ?? undefined,
      name: product.name,
      sku: product.sku ?? undefined,
      supplier_product_id: product.supplier_product_id ?? undefined,
      list_price: product.list_price?.toString() ?? "0",
      standard_dealer_price: product.dealer_price?.toString() ?? "0",
      product_type: product.product_type ?? undefined,
      status: product.status ?? undefined,
      weight: product.weight?.toNumber() ?? 0,
      inventory: {
        data: {
          total: product.inventory_total ?? 0,
        },
      },
      images: {
        data: images ?? [],
      },
    };
  });

  return {
    data: transformedData as unknown as BrandStatus[],
    total,
  };
}

/**
 * Obtiene items por status (NEW/CLO) con paginación
 * Optimizado: paraleliza queries independientes
 * Regla aplicada: async-parallel
 */
export async function getStatusItems(
  status: "NEW" | "CLO",
  page: number = 1,
  productType?: string,
  limit: number = 30,
): Promise<{ data: BrandStatus[]; total: number; productTypes: string[] }> {
  const statusIdMap: Record<string, string> = {
    NEW: "NEW",
    CLO: "CLO",
  };

  const statusId = statusIdMap[status] || status;

  const where = {
    status_id: statusId,
    ...(productType && {
      product_type: decodeURIComponent(productType).replace(/%26/g, "&"),
    }),
    inventory_total: { gt: -1 },
  };

  // Paralelizar todas las queries independientes
  const [productsData, total, allProductTypes] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
    // Query para obtener tipos de producto únicos
    prisma.product.findMany({
      where: {
        status_id: statusId,
        inventory_total: { gt: -1 },
      },
      select: { product_type: true },
      distinct: ["product_type"],
    }),
  ]);

  // Extraer tipos de producto únicos
  const productTypes = allProductTypes
    .map((p) => p.product_type)
    .filter((pt): pt is string => pt !== null);

  // Transformar al formato BrandStatus
  const transformedData = productsData.map((product) => {
    const images = product.images as string[] | null;

    return {
      id: parseInt(product.wps_id),
      wps_id: product.wps_id,
      brand_id: product.brand_id ?? undefined,
      name: product.name,
      sku: product.sku ?? undefined,
      supplier_product_id: product.supplier_product_id ?? undefined,
      list_price: product.list_price?.toString() ?? "0",
      standard_dealer_price: product.dealer_price?.toString() ?? "0",
      product_type: product.product_type ?? undefined,
      status: product.status ?? undefined,
      weight: product.weight?.toNumber() ?? 0,
      inventory: {
        data: {
          total: product.inventory_total ?? 0,
        },
      },
      images: {
        data: images ?? [],
      },
    };
  });

  return {
    data: transformedData as unknown as BrandStatus[],
    total,
    productTypes,
  };
}

// ============================================
// TRANSFORM FUNCTION
// ============================================

function transformToBrandStatus(product: Product): BrandStatus {
  const inventoryDetails = product.inventory_details as Record<
    string,
    number
  > | null;
  const rawImages = product.images;

  const imageData = Array.isArray(rawImages)
    ? rawImages.map((img, index) => {
        if (typeof img === "string") {
          return {
            id: index,
            domain: "",
            path: img,
            filename: img.split("/").pop() ?? "",
            alt: null,
            mime: "image/jpeg",
            width: 0,
            height: 0,
            size: 0,
            signature: "",
            created_at: new Date(),
            updated_at: new Date(),
          };
        }
        return img as unknown as import("@/types/interface").Datum;
      })
    : [];

  const inventoryData: import("@/types/interface").Data = {
    id: 0,
    item_id: parseInt(product.wps_id),
    sku: product.sku ?? "",
    ca_warehouse: inventoryDetails?.ca_warehouse ?? 0,
    ga_warehouse: inventoryDetails?.ga_warehouse ?? 0,
    id_warehouse: inventoryDetails?.id_warehouse ?? 0,
    in_warehouse: inventoryDetails?.in_warehouse ?? 0,
    pa_warehouse: inventoryDetails?.pa_warehouse ?? 0,
    pa2_warehouse: inventoryDetails?.pa2_warehouse ?? 0,
    tx_warehouse: inventoryDetails?.tx_warehouse ?? 0,
    total: product.inventory_total ?? 0,
    created_at: product.created_at ?? new Date(),
    updated_at: product.updated_at ?? new Date(),
  };

  return {
    id: parseInt(product.wps_id),
    brand_id: product.brand_id ?? 0,
    country_id: product.country_id ?? 0,
    product_id: product.product_id ?? 0,
    sku: product.sku ?? "",
    name: product.name,
    list_price: product.list_price?.toString() ?? "0",
    standard_dealer_price: product.dealer_price?.toString() ?? "0",
    supplier_product_id: product.supplier_product_id ?? "",
    length: product.length?.toNumber() ?? 0,
    width: product.width?.toNumber() ?? 0,
    height: product.height?.toNumber() ?? 0,
    weight: product.weight?.toNumber() ?? 0,
    upc: product.upc ?? "",
    superseded_sku: null,
    status_id: product.status_id ?? "",
    status: product.status ?? "",
    unit_of_measurement_id: product.unit_of_measurement_id ?? 0,
    has_map_policy: product.has_map_policy ?? false,
    sort: product.sort ?? 0,
    created_at: product.created_at ?? new Date(),
    updated_at: product.updated_at ?? new Date(),
    published_at: product.published_at ?? new Date(),
    product_type: product.product_type ?? "",
    mapp_price: product.mapp_price?.toString() ?? "0",
    carb: null,
    propd1: null,
    propd2: null,
    prop_65_code: null,
    prop_65_detail: null,
    drop_ship_fee: product.drop_ship_fee ?? "",
    drop_ship_eligible: product.drop_ship_eligible ?? false,
    inventory: { data: inventoryData },
    images: { data: imageData },
  };
}

// ============================================
// RECOMMENDED ITEMS - OPTIMIZED
// ============================================

/**
 * Obtiene items recomendados de múltiples marcas
 * OPTIMIZACIÓN CRÍTICA: Antes hacía queries en un loop (N+1),
 * ahora hace UNA sola query con OR condiciones
 * 
 * Reglas aplicadas: async-parallel, server-cache-react
 */
export async function getRecommendedItems(): Promise<{
  data: BrandStatus[];
  total: number;
}> {
  const brandIds = [778, 692, 769, 99, 220];
  const productsPerBrand = 2;

  // OPTIMIZACIÓN: Una sola query para todas las marcas
  // en lugar de múltiples queries en un loop
  const allProducts = await prisma.product.findMany({
    where: {
      brand_id: { in: brandIds },
      inventory_total: { gt: 0 },
      status: "NEW",
    },
    orderBy: { created_at: "desc" },
  });

  // Agrupar por marca y seleccionar aleatoriamente
  const productsByBrand = new Map<number, Product[]>();
  
  for (const product of allProducts) {
    const brandId = product.brand_id;
    if (!brandId || !brandIds.includes(brandId)) continue;
    
    if (!productsByBrand.has(brandId)) {
      productsByBrand.set(brandId, []);
    }
    productsByBrand.get(brandId)!.push(product);
  }

  // Seleccionar productos aleatorios de cada marca
  const selectedProducts: Product[] = [];
  
  for (const brandId of brandIds) {
    const brandProducts = productsByBrand.get(brandId) || [];
    const productsWithImages = brandProducts.filter(
      (p) => Array.isArray(p.images) && p.images.length > 0
    );
    
    // Mezclar y tomar los primeros
    const shuffled = [...productsWithImages].sort(() => Math.random() - 0.5);
    selectedProducts.push(...shuffled.slice(0, productsPerBrand));
  }

  const transformedData = selectedProducts.map(transformToBrandStatus);

  return {
    data: transformedData,
    total: transformedData.length,
  };
}

// ============================================
// SEARCH FUNCTIONS
// ============================================

/**
 * Busca productos por término
 */
export async function searchProductsByTerm(
  searchTerm: string,
  limit: number = 10,
): Promise<BrandStatus[]> {
  if (!searchTerm || searchTerm.length < 2) return [];

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { supplier_product_id: { mode: "insensitive", contains: searchTerm } },
        { sku: { mode: "insensitive", contains: searchTerm } },
        { name: { mode: "insensitive", contains: searchTerm } },
      ],
    },
    take: limit,
    orderBy: { created_at: "desc" },
  });

  return products.map(transformToBrandStatus);
}

/**
 * Busca producto por número de parte
 * Cacheada con React.cache()
 */
export const getProductByPartNumber = React.cache(async (
  partNumber: string
): Promise<BrandStatus | null> => {
  if (!partNumber || partNumber.length < 2) return null;

  const product = await prisma.product.findFirst({
    where: {
      supplier_product_id: partNumber,
    },
  });

  if (!product) return null;

  return transformToBrandStatus(product);
});

// ============================================
// VEHICLE FUNCTIONS
// ============================================

/**
 * Obtiene compatibilidad de vehículos para un item
 * OPTIMIZACIÓN: Evita N+1 queries
 */
export async function getVehicleCompatibility(
  itemId: string,
): Promise<VehicleDataId[]> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  let allVehicles: VehicleDataId[] = [];
  let nextCursor: string | null = null;

  // Obtener todos los vehículos de la API
  do {
    const url = `https://api.wps-inc.com/items/${encodeURIComponent(itemId)}/vehicles?page[size]=650${
      nextCursor ? `&page[cursor]=${nextCursor}` : ""
    }`;

    try {
      const response = await fetch(url, { method: "GET", headers });
      const result: {
        data: VehicleDataId[];
        meta?: { cursor?: { next: string | null } };
      } = await response.json();

      if (result.data) {
        allVehicles = [...allVehicles, ...result.data];
      }

      nextCursor = result.meta?.cursor?.next || null;
    } catch {
      break;
    }
  } while (nextCursor);

  if (allVehicles.length === 0) {
    return [];
  }

  // OPTIMIZACIÓN: Extraer todos los IDs de vehículos y hacer UNA query
  // en lugar de N queries (N+1 problem)
  const vehicleIds = allVehicles.map((v) => v.id);

  // Obtener todos los vehículos con sus relaciones en UNA sola query
  const vehiclesData = await prisma.vehicle.findMany({
    where: {
      id: { in: vehicleIds },
    },
    include: {
      model: {
        include: {
          make: true,
        },
      },
      year: true,
    },
  });

  // Crear un mapa para lookup O(1)
  const vehicleDataMap = new Map(
    vehiclesData.map((v) => [v.id, v])
  );

  // Enrich con datos locales
  const enrichedVehicles = allVehicles.map((vehicle) => {
    const vehicleData = vehicleDataMap.get(vehicle.id);

    if (vehicleData) {
      return {
        ...vehicle,
        vehiclemodel: vehicleData.model
          ? {
              data: {
                id: vehicleData.model.id,
                vehiclemake_id: vehicleData.model.vehiclemake_id,
                db2_key: vehicleData.model.db2_key || "",
                name: vehicleData.model.name,
                created_at: vehicleData.model.created_at?.toISOString() || "",
                updated_at: vehicleData.model.updated_at?.toISOString() || "",
                vehiclemake: {
                  data: {
                    id: vehicleData.model.make.id,
                    db2_key: vehicleData.model.make.db2_key || "",
                    name: vehicleData.model.make.name,
                    created_at: vehicleData.model.make.created_at?.toISOString() || "",
                    updated_at: vehicleData.model.make.updated_at?.toISOString() || "",
                  },
                },
              },
            }
          : undefined,
        vehicleyear: vehicleData.year
          ? {
              data: {
                id: vehicleData.year.id,
                name: vehicleData.year.year,
                created_at: vehicleData.year.created_at?.toISOString() || "",
                updated_at: vehicleData.year.updated_at?.toISOString() || "",
              },
            }
          : undefined,
      };
    }

    return vehicle;
  });

  return enrichedVehicles;
}

/**
 * Obtiene compatibilidad de vehículos por IDs
 */
export async function getVehicleCompatibilityByItemId(
  vehicleIds: number[],
): Promise<VehicleCompatibilityData[]> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  // Procesar los IDs en grupos de 50
  const chunkSize = 50;
  const allVehicles: VehicleCompatibilityData[] = [];

  for (let i = 0; i < vehicleIds.length; i += chunkSize) {
    const chunk = vehicleIds.slice(i, i + chunkSize);
    const url = `https://api.wps-inc.com/vehicles?filter[id]=${chunk.join(",")}&include=vehiclemodel.vehiclemake,vehicleyear&page[size]=650`;

    try {
      const response = await fetch(url, { method: "GET", headers });
      const result = await response.json();

      if (result.data) {
        allVehicles.push(...result.data);
      }
    } catch {
      // Skip this chunk
    }
  }

  return allVehicles;
}

/**
 * Obtiene modelos de vehículo por año y marca
 */
export async function getVehicleModel(
  yearId: string,
  makeId: string,
): Promise<VehicleModel[]> {
  try {
    const models = await prisma.vehicleModel.findMany({
      where: {
        vehiclemake_id: parseInt(makeId),
        ...(yearId && { years: { some: { id: parseInt(yearId) } } }),
      },
      include: {
        make: true,
        years: true,
      },
    });

    return models.map((model) => ({
      id: model.id,
      vehiclemake_id: model.vehiclemake_id,
      db2_key: model.db2_key || "",
      name: model.name,
      created_at: model.created_at?.toISOString() || "",
      updated_at: model.updated_at?.toISOString() || "",
    }));
  } catch {
    return [];
  }
}

/**
 * Obtiene items de vehículo por modelo y año
 */
export async function getVehicleItemsId(
  modelId: string,
  yearId: string,
): Promise<VehicleModel[]> {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        vehiclemodel_id: modelId ? parseInt(modelId) : undefined,
        vehicleyear_id: yearId ? parseInt(yearId) : undefined,
      },
      include: {
        model: true,
        year: true,
      },
    });

    return vehicles.map((vehicle) => ({
      id: vehicle.id,
      vehiclemake_id: vehicle.model?.vehiclemake_id || vehicle.vehiclemodel_id || 0,
      db2_key: vehicle.model?.db2_key || "",
      name: vehicle.model?.name || `${vehicle.year?.year || ""}`,
      created_at: vehicle.created_at?.toISOString() || "",
      updated_at: vehicle.updated_at?.toISOString() || "",
    }));
  } catch {
    return [];
  }
}

/**
 * Obtiene items de vehículo de la API WPS
 */
export async function getVehicleItems(
  vehicleId: string,
  cursor: string | null = null,
  productType: string | null = null,
  sort: string | null = null
): Promise<VehicleItemsResponse> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  try {
    let url = `https://api.wps-inc.com/vehicles/${vehicleId}/items?include=inventory,images&page[size]=30`;

    if (cursor) {
      url += `&page[cursor]=${encodeURIComponent(cursor)}`;
    }

    if (productType) {
      url += `&filter[product_type]=${encodeURIComponent(productType)}`;
    }

    if (sort) {
      url += `&${sort}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const result = await response.json();
    const itemsWithInventory = result.data as VehicleItem[];

    return {
      data: itemsWithInventory,
      meta: result.meta,
    };
  } catch {
    return { data: [], meta: { cursor: { current: "", prev: null, next: null, count: 0 } } };
  }
}

/**
 * Obtiene compatibilidad de vehículo desde DB local
 * OPTIMIZACIÓN: Usa una sola query con include anidado
 */
export async function getVehicleCompatibilityDb(
  itemId: number
): Promise<VehicleCompatibilityData[]> {
  try {
    const headers: HeadersInit = {
      Authorization: process.env.PUBLIC_WPS ?? "",
    };

    const response = await fetch(
      `https://api.wps-inc.com/items/${itemId}/vehicles?page[size]=650`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const result = await response.json();
    const vehicleIds = result.data?.map((v: VehicleDataId) => v.id) || [];

    if (vehicleIds.length === 0) {
      return [];
    }

    // Una sola query con relaciones anidadas
    const vehicles = await prisma.vehicle.findMany({
      where: {
        id: { in: vehicleIds },
      },
      include: {
        model: {
          include: {
            make: true,
          },
        },
        year: true,
      },
    });

    // Transformar al formato VehicleCompatibilityData
    return vehicles.map((vehicle) => ({
      id: vehicle.id,
      vehiclemodel_id: vehicle.vehiclemodel_id ?? 0,
      vehicleyear_id: vehicle.vehicleyear_id ?? 0,
      created_at: vehicle.created_at?.toISOString() || "",
      updated_at: vehicle.updated_at?.toISOString() || "",
      vehiclemodel: {
        data: {
          id: vehicle.model?.id ?? 0,
          vehiclemake_id: vehicle.model?.vehiclemake_id ?? 0,
          db2_key: vehicle.model?.db2_key || "",
          name: vehicle.model?.name || "",
          created_at: vehicle.model?.created_at?.toISOString() || "",
          updated_at: vehicle.model?.updated_at?.toISOString() || "",
          vehiclemake: {
            data: {
              id: vehicle.model?.make?.id ?? 0,
              db2_key: vehicle.model?.make?.db2_key || "",
              name: vehicle.model?.make?.name || "",
              created_at: vehicle.model?.make?.created_at?.toISOString() || "",
              updated_at: vehicle.model?.make?.updated_at?.toISOString() || "",
            },
          },
        },
      },
      vehicleyear: {
        data: {
          id: vehicle.year?.id ?? 0,
          name: vehicle.year?.year ?? 0,
          created_at: vehicle.year?.created_at?.toISOString() || "",
          updated_at: vehicle.year?.updated_at?.toISOString() || "",
        },
      },
    }));
  } catch {
    return [];
  }
}

// ============================================
// SLIDER PRODUCTS
// ============================================

/**
 * Obtiene productos para sliders con rotación
 * Optimizado: paraleliza count y findMany
 */
export async function getSliderProducts(
  brandId: number,
  productType: string,
  limit: number = 10,
  seed?: number
): Promise<BrandStatus[]> {
  const sanitizedProductType = decodeURIComponent(productType).replace(/%26/g, "&");

  const where = {
    brand_id: brandId,
    product_type: sanitizedProductType,
    inventory_total: { gt: 0 },
    images: { not: { equals: [] } },
  };

  // Paralelizar count y findMany
  const [totalProducts, data] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where: {
        brand_id: brandId,
        product_type: sanitizedProductType,
        inventory_total: { gt: 0 },
      },
      orderBy: { created_at: "desc" },
    }),
  ]);

  // Si hay pocos productos, retornar todos
  if (totalProducts <= limit) {
    const productsWithImages = data.filter(
      (p) => Array.isArray(p.images) && p.images.length > 0
    );
    
    return productsWithImages.slice(0, limit).map(transformToBrandStatus);
  }

  // Calcular offset basado en seed
  const maxOffset = Math.max(0, totalProducts - limit);
  const offset = seed !== undefined 
    ? (seed * 17) % (maxOffset + 1)
    : 0;

  // Obtener productos con offset
  const productsWithOffset = await prisma.product.findMany({
    where: {
      brand_id: brandId,
      product_type: sanitizedProductType,
      inventory_total: { gt: 0 },
    },
    orderBy: { created_at: "desc" },
    skip: offset,
    take: limit * 2,
  });

  // Filtrar productos con imágenes
  const productsWithImages = productsWithOffset.filter(
    (p) => Array.isArray(p.images) && p.images.length > 0
  );

  return productsWithImages.slice(0, limit).map(transformToBrandStatus);
}
