"use server";

import { BrandId, Brands, Meta, BrandStatus, VehicleDataId, VehicleCompatibilityData, VehicleModel } from "@/types/interface";
import brandData from "@/public/csv/brand2.json";

export async function getBrandsItems(
  brandId: string,
  cursor: string | null = null,
  productType?: string
): Promise<{ data: BrandId[]; meta: Meta }> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  // Construir la URL base
  let url = `https://api.wps-inc.com/items?filter[brand_id]=${brandId}&include=inventory,images,attributevalues&sort[desc]=created_at&page[size]=100`;

  // Agregar filtro de tipo de producto si está presente
  if (productType) {
    // Decodificar el tipo de producto y reemplazar '%26' con '&'
    const decodedProductType = decodeURIComponent(productType).replace(
      /%26/g,
      "&"
    );

    url += `&filter[product_type]=${encodeURIComponent(decodedProductType)}`;
  }

  // Agregar cursor si está presente
  if (cursor) {
    url += `&page[cursor]=${encodeURIComponent(cursor)}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    console.error(`Error fetching brand ${brandId}:`, await response.json());
    return {
      data: [],
      meta: {
        cursor: {
          current: "",
          prev: null,
          next: null,
          count: 0,
        },
      },
    };
  }

  const result = await response.json();

  // Separar productos con inventario mayor a 0 y con inventario igual a 0
  const itemsWithInventory = (result.data as BrandId[]).filter(
    (item) =>
      item.inventory?.data?.total !== undefined && item.inventory.data.total > 0
  );

  const itemsWithoutInventory = (result.data as BrandId[]).filter(
    (item) =>
      !item.inventory?.data?.total || item.inventory.data.total === 0
  );

  // Combinar los arrays, primero los que tienen inventario
  const combinedItems = [...itemsWithInventory, ...itemsWithoutInventory];

  // Eliminar duplicados basados en el ID
  const uniqueItemsWithInventory = Array.from(
    new Map(combinedItems.map((item) => [item.id, item])).values()
  );

  return {
    data: uniqueItemsWithInventory.slice(0, 30),
    meta: {
      ...result.meta,
      cursor: {
        ...result.meta.cursor,
        count: uniqueItemsWithInventory.length,
        next: result.meta.cursor.next,
      },
    },
  };
}

export async function getBrands(
  brandId?: string | null,
  cursor: string | null = null
): Promise<{ data: Brands[]; meta: Meta }> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  const baseUrl = "https://api.wps-inc.com/brands";

  // Validar y sanitizar el brandId
  const sanitizedBrandId = brandId && /^\d+$/.test(brandId) ? brandId : null;

  const url = sanitizedBrandId
    ? `${baseUrl}/${sanitizedBrandId}`
    : cursor
    ? `${baseUrl}?page[size]=20&page[cursor]=${encodeURIComponent(cursor)}`
    : `${baseUrl}?page[size]=20`;

  try {
    const response = await fetch(url, { method: "GET", headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching brands:", errorText);

      // Si es un error con un ID específico, devolver un array vacío
      if (sanitizedBrandId) {
        return {
          data: [],
          meta: { cursor: { current: "", prev: null, next: null, count: 0 } },
        };
      }

      throw new Error(errorText || "Error al obtener marcas");
    }

    const result = await response.json();

    // Si se solicita una marca específica, devolver un objeto con esa marca
    if (sanitizedBrandId) {
      return {
        data: [result.data] as Brands[],
        meta: { cursor: { current: "", prev: null, next: null, count: 1 } },
      };
    }

    return {
      data: result.data as Brands[],
      meta: result.meta as Meta,
    };
  } catch (error) {
    console.error("Unexpected error in getBrands:", error);
    return {
      data: [],
      meta: { cursor: { current: "", prev: null, next: null, count: 0 } },
    };
  }
}

export async function getBrandName(brandId: string): Promise<string> {
  try {
    // Primero buscar en el archivo local
    const localBrand = brandData.find(brand => brand.id.toString() === brandId);
    if (localBrand) {
      return localBrand.name;
    }

    // Si no se encuentra localmente, intentar con la API
    const { data } = await getBrands(brandId);
    return data[0]?.name || brandId;
  } catch (error) {
    console.error(`Error fetching brand name for ID ${brandId}:`, error);
    return brandId;
  }
}

export async function getTypeProducts(productType: string, cursor?: string) {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  // Reemplazar guiones por espacios para coincidir con el formato de la API
  const decodedProductType = productType.replace(/-/g, ' ');

  let url = `https://api.wps-inc.com/items?filter[product_type]=${encodeURIComponent(decodedProductType)}&include=inventory,images,attributevalues&sort[desc]=created_at&page[size]=100`;

  if (cursor) {
    url += `&page[cursor]=${encodeURIComponent(cursor)}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching items with product type ${productType}:`, errorText);
      return {
        data: [],
        meta: { cursor: { current: "", prev: null, next: null, count: 0 } },
      };
    }

    const result = await response.json();

    // Separar productos con inventario mayor a 0 y con inventario igual a 0
    const itemsWithInventory = (result.data as BrandStatus[]).filter(
      (item) => item.inventory && item.inventory.data.total > 0
    );

    const itemsWithoutInventory = (result.data as BrandStatus[]).filter(
      (item) => !item.inventory || item.inventory.data.total === 0
    );

    // Combinar los arrays, primero los que tienen inventario
    const combinedItems = [...itemsWithInventory, ...itemsWithoutInventory];

    // Eliminar duplicados
    const uniqueItems = Array.from(
      new Map(combinedItems.map((item) => [item.id, item])).values()
    );

    return {
      data: uniqueItems.slice(0, 30),
      meta: {
        ...result.meta,
        cursor: {
          ...result.meta.cursor,
          count: uniqueItems.length,
        },
      },
    };
  } catch (error) {
    console.error(`Unexpected error fetching items with product type ${productType}:`, error);
    return {
      data: [],
      meta: { cursor: { current: "", prev: null, next: null, count: 0 } },
    };
  }
}

export async function getItemsByStatus(
  status: string,
  cursor: string | null = null,
  productType?: string
): Promise<{
  data: BrandStatus[];
  meta: Meta;
}> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  // Validar el status para evitar inyección
  const sanitizedStatus = ["NEW", "CLO"].includes(status.toUpperCase())
    ? status.toUpperCase()
    : "NEW";

  // Construir la URL base
  let url = `https://api.wps-inc.com/items?filter[status_id]=${sanitizedStatus}&include=inventory&sort[desc]=created_at&page[size]=100`;

  // Agregar filtro de tipo de producto si está presente
  if (productType) {
    // Decodificar el tipo de producto y reemplazar '%26' con '&'
    const decodedProductType = decodeURIComponent(productType).replace(
      /%26/g,
      "&"
    );

    url += `&filter[product_type]=${encodeURIComponent(decodedProductType)}`;
  }

  // Agregar cursor si está presente
  if (cursor) {
    url += `&page[cursor]=${encodeURIComponent(cursor)}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store", // Asegurar que siempre se obtengan datos frescos
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Error fetching items with status ${sanitizedStatus}:`,
        errorText
      );
      return {
        data: [],
        meta: { cursor: { current: "", prev: null, next: null, count: 0 } },
      };
    }

    const result = await response.json();

    // Separar productos con inventario mayor a 0 y con inventario igual a 0
    const itemsWithInventory = (result.data as BrandStatus[]).filter(
      (item) => item.inventory && item.inventory.data.total > 0
    );

    const itemsWithoutInventory = (result.data as BrandStatus[]).filter(
      (item) => !item.inventory || item.inventory.data.total === 0
    );

    // Combinar los arrays, primero los que tienen inventario
    const combinedItems = [...itemsWithInventory, ...itemsWithoutInventory];

    // Eliminar duplicados
    const uniqueItems = Array.from(
      new Map(combinedItems.map((item) => [item.id, item])).values()
    );

    return {
      data: uniqueItems.slice(0, 30),
      meta: {
        ...result.meta,
        cursor: {
          ...result.meta.cursor,
          count: uniqueItems.length,
        },
      },
    };
  } catch (error) {
    console.error(`Unexpected error fetching items with status ${sanitizedStatus}:`, error);
    return {
      data: [],
      meta: { cursor: { current: "", prev: null, next: null, count: 0 } },
    };
  }
}

const ProductTypeUrlReverseMap: Record<string, string> = {
  'protective-safety': 'Protective/Safety',
  'tank-tops': 'Tank Tops',
  'piston-kits-components': 'Piston kits & Components',
  'mounts-brackets': 'Mounts/Brackets',
  'replacement-parts': 'Replacement Parts',
  'utv-cab-roof-door': 'UTV Cab/Roof/Door',
  'foot-controls': 'Foot Controls',
  'utility-containers': 'Utility Containers',
  'track-kit': 'Track Kit',
  'air-filters': 'Air Filters',
  'hardware-fasteners-fittings': 'Hardware/Fasteners/Fittings',
  'cable-hydraulic-control-lines': 'Cable/Hydraulic Control Lines',
  'gauges-meters': 'Gauges/Meters',
  'intake-carb-fuel-system': 'Intake/Carb/Fuel System',
  'engine-management': 'Engine Management',
  'fuel-tanks': 'Fuel Tank',
};

export async function getCollectionByProductType(
  productType: string,
  cursor: string | null = null,
  brandId?: string
): Promise<{
  data: BrandStatus[];
  meta: Meta;
}> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  // Mapear los tipos de producto de la URL a los tipos de la API
  const productTypeMap: Record<string, string> = {
    motor: "Engine,Piston kits & Components",
    accesorios: "Accessories",
    indumentaria: "Pants,Jerseys,Footwear,Gloves,Eyewear",
    cascos: "Helmets,Protective/Safety",
    proteccion: "Protective/Safety,Luggage,Bags",
    herramientas: "Tools",
    casual: "Vests,Sweaters,Suits,Socks,Shorts,Shoes,Jackets,Hoodies,Bags,Luggage",
    'protective-safety': 'Protective/Safety',
    'tank-tops': 'Tank Tops',
    'piston-kits-components': 'Piston kits & Components',
    'mounts-brackets': 'Mounts/Brackets',
    'replacement-parts': 'Replacement Parts',
    'utv-cab-roof-door': 'UTV Cab/Roof/Door',
    'foot-controls': 'Foot Controls',
    'utility-containers': 'Utility Containers',
    'track-kit': 'Track Kit',
    'air-filters': 'Air Filters',
    'hardware-fasteners-fittings': 'Hardware/Fasteners/Fittings',
    'cable-hydraulic-control-lines': 'Cable/Hydraulic Control Lines',
    'gauges-meters': 'Gauges/Meters',
    'intake-carb-fuel-system': 'Intake/Carb/Fuel System',
    'engine-management': 'Engine Management',
    'fuel-tanks': 'Fuel Tank',
    'gas-caps': 'Gas Caps',
    'graphics-decals': 'Graphics/Decals',
    'guards-braces': 'Guards/Braces',
    'hand-controls': 'Hand Controls',
    'spark-plugs': 'Spark Plugs',
    'oil-filters': 'Oil Filters',
  };

  // Sanitizar y mapear el tipo de producto
  const sanitizedProductType = 
    ProductTypeUrlReverseMap[productType.toLowerCase()] || 
    productTypeMap[productType.toLowerCase()] || 
    productType;

  // Codificar el tipo de producto para la URL
  const encodedProductType = encodeURIComponent(sanitizedProductType);

  // Construir la URL con el filtro de brand_id si está presente
  const url = cursor
    ? `https://api.wps-inc.com/items?filter[product_type]=${encodedProductType}&include=inventory,images,attributevalues&page[size]=100&sort[desc]=created_at&page[cursor]=${encodeURIComponent(
        cursor
      )}${brandId ? `&filter[brand_id]=${brandId}` : ""}`
    : `https://api.wps-inc.com/items?filter[product_type]=${encodedProductType}&include=inventory,images,attributevalues&sort[desc]=created_at&page[size]=100${
        brandId ? `&filter[brand_id]=${brandId}` : ""
      }`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store", // Asegurar que siempre se obtengan datos frescos
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Error fetching items with product type ${sanitizedProductType}:`,
        errorText
      );
      return {
        data: [],
        meta: { cursor: { current: "", prev: null, next: null, count: 0 } },
      };
    }

    const result = await response.json();

    // Filtrar productos con inventario total > 0 y los que tienen inventario = 0
    const itemsWithInventory = (result.data as BrandStatus[]).filter(
      (item) =>
        item.inventory?.data?.total !== undefined && item.inventory.data.total > 0
    );
    const itemsWithoutInventory = (result.data as BrandStatus[]).filter(
      (item) =>
        item.inventory?.data?.total !== undefined && item.inventory.data.total === 0
    );

    // Eliminar duplicados basados en el ID en cada grupo
    const uniqueItemsWithInventory = Array.from(
      new Map(itemsWithInventory.map((item) => [item.id, item])).values()
    );
    const uniqueItemsWithoutInventory = Array.from(
      new Map(itemsWithoutInventory.map((item) => [item.id, item])).values()
    );

    // Concatenar los dos grupos y limitar a 30 productos
    const combinedItems = [...uniqueItemsWithInventory, ...uniqueItemsWithoutInventory];
    const limitedItems = combinedItems.slice(0, 30);

    return {
      data: limitedItems,
      meta: {
        ...result.meta,
        cursor: {
          ...result.meta.cursor,
          count: combinedItems.length,
          next: combinedItems.length > 30 ? result.meta.cursor.next : null,
        },
      },
    };
  } catch (error) {
    console.error(
      `Unexpected error fetching items with product type ${sanitizedProductType}:`,
      error
    );
    return {
      data: [],
      meta: { cursor: { current: "", prev: null, next: null, count: 0 } },
    };
  }
}

export async function getStatusItems(
  status: "NEW" | "CLO",
  cursor: string | null = null,
  productType: string | null = null,
  accumulatedItems: BrandStatus[] = []
): Promise<{ data: BrandStatus[]; meta: Meta }> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  // Construir la URL base
  let url = `https://api.wps-inc.com/items?filter[status_id]=${status}&include=inventory,images,attributevalues&page[size]=100&sort[desc]=created_at`;

  // Agregar filtro de tipo de producto si está presente y no es nulo
  if (productType) {
    // Decodificar el tipo de producto y reemplazar '%26' con '&'
    const decodedProductType = decodeURIComponent(productType).replace(
      /%26/g,
      "&"
    );

    url += `&filter[product_type]=${encodeURIComponent(decodedProductType)}`;
  }

  // Agregar cursor si está presente
  if (cursor) {
    url += `&page[cursor]=${encodeURIComponent(cursor)}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
    cache: "no-store", // Asegurar que siempre se obtengan datos frescos
  });

  if (!response.ok) {
    console.error(
      `Error fetching items with status ${status}:`,
      await response.json()
    );
    return {
      data: accumulatedItems.filter(
        (item) =>
          item.inventory?.data?.total !== undefined &&
          item.inventory.data.total > 0
      ),
      meta: {
        cursor: {
          current: "",
          prev: null,
          next: null,
          count: 0,
        },
      },
    };
  }

  const result = await response.json();

  // Filtrar productos con inventario total > 0
  const itemsWithInventory = (result.data as BrandStatus[]).filter(
    (item) =>
      item.inventory?.data?.total !== undefined && item.inventory.data.total > 0
  );

  // Acumular items con inventario
  const combinedItems = [...accumulatedItems, ...itemsWithInventory];

  // Si no hay items con inventario y hay más páginas, continuar buscando
  if (combinedItems.length < 30 && result.meta?.cursor?.next) {
    return await getStatusItems(
      status,
      result.meta.cursor.next,
      productType,
      combinedItems
    );
  }

  // Eliminar duplicados basados en el ID
  const uniqueItemsWithInventory = Array.from(
    new Map(combinedItems.map((item) => [item.id, item])).values()
  );

  // Obtener todos los tipos de producto únicos
  const uniqueProductTypes = Array.from(
    new Set(
      uniqueItemsWithInventory.map((item) => item.product_type).filter(Boolean)
    )
  );

  return {
    data: uniqueItemsWithInventory.slice(0, 30),
    meta: {
      ...result.meta,
      cursor: {
        ...result.meta.cursor,
        count: uniqueItemsWithInventory.length,
        next:
          uniqueItemsWithInventory.length > 30 ? result.meta.cursor.next : null,
      },
      productTypes: uniqueProductTypes,
    },
  };
}

export async function getRecommendedItems(
  supplierProductIds: string[] = [
    "2986510001",
    "2986515226",
    "8300326-1180-XL",
    "8301026-3126-L",
    "HC313",
    "202076048",
    "CA420-2301",
    "TC-3",
    "8485000003",
    "2STK-HDNUT",
    "CW-PV-K02",
    "E-RF4-0820",
    "8665",
    "CC-37AM",
    "VTKTC23870A"
  ]
): Promise<{ data: BrandStatus[]; meta: Meta }> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  // Convertir el array de IDs a un string separado por comas
  const productIdsString = supplierProductIds.join(",");

  const url = `https://api.wps-inc.com/items?filter[supplier_product_id]=${encodeURIComponent(
    productIdsString
  )}&include=inventory,images,attributevalues&sort[desc]=created_at&page[size]=100`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store", // Asegurar que siempre se obtengan datos frescos
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching recommended items:", errorText);
      return {
        data: [],
        meta: { cursor: { current: "", prev: null, next: null, count: 0 } },
      };
    }

    const result = await response.json();

    // Separar productos con inventario mayor a 0 y con inventario igual a 0
    const itemsWithInventory = (result.data as BrandStatus[]).filter(
      (item) => item.inventory && item.inventory.data.total > 0
    );

    const itemsWithoutInventory = (result.data as BrandStatus[]).filter(
      (item) => !item.inventory || item.inventory.data.total === 0
    );

    // Combinar los arrays, primero los que tienen inventario
    const combinedItems = [...itemsWithInventory, ...itemsWithoutInventory];

    // Eliminar duplicados
    const uniqueItems = Array.from(
      new Map(combinedItems.map((item) => [item.id, item])).values()
    );

    return {
      data: uniqueItems.slice(0, 30),
      meta: {
        ...result.meta,
        cursor: {
          ...result.meta.cursor,
          count: uniqueItems.length,
        },
      },
    };
  } catch (error) {
    console.error("Unexpected error fetching recommended items:", error);
    return {
      data: [],
      meta: { cursor: { current: "", prev: null, next: null, count: 0 } },
    };
  }
}

export async function getItemBySupplierProductId(searchTerm: string): Promise<BrandStatus> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  // Primero buscar por supplier_product_id
  let url = `https://api.wps-inc.com/items?filter[supplier_product_id][pre]=${encodeURIComponent(searchTerm)}&include=inventory,images,attributevalues`;
  
  let response = await fetch(url, { method: "GET", headers });
  let result = await response.json();

  // Si no hay resultados, buscar por sku
  if (!result.data || (Array.isArray(result.data) && result.data.length === 0)) {
    url = `https://api.wps-inc.com/items?filter[sku][pre]=${encodeURIComponent(searchTerm)}&include=inventory,images,attributevalues`;
    response = await fetch(url, { method: "GET", headers });
    result = await response.json();
  }

  return result.data as BrandStatus;
}

export async function getRelatedItems(itemId: string): Promise<BrandStatus[]> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  const url = `https://api.wps-inc.com/products?include=items.images&filter[sku]=${encodeURIComponent(itemId)}&page[size]=10`;

  const response = await fetch(url, { method: "GET", headers });
  const result = await response.json();

  return result.data as BrandStatus[];
}

export async function getVehicleCompatibility(itemId: string): Promise<VehicleDataId[]> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  let allVehicles: VehicleDataId[] = [];
  let nextCursor: string | null = null;

  do {
    const url: string = `https://api.wps-inc.com/items/${encodeURIComponent(itemId)}/vehicles?page[size]=650${
      nextCursor ? `&page[cursor]=${nextCursor}` : ''
    }`;

    try {
      const response: Response = await fetch(url, { method: "GET", headers });
      const result: { data: VehicleDataId[]; meta?: { cursor?: { next: string | null } } } = await response.json();

      if (result.data) {
        allVehicles = [...allVehicles, ...result.data];
      }

      nextCursor = result.meta?.cursor?.next || null;
    } catch (error) {
      console.error("Error fetching vehicle compatibility:", error);
      break;
    }
  } while (nextCursor);

  return allVehicles;
}

export async function getVehicleCompatibilityByItemId(vehicleIds: number[]): Promise<VehicleCompatibilityData[]> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  // Procesar los IDs en grupos de 50 para evitar URLs demasiado largas
  const chunkSize = 50;
  const allVehicles: VehicleCompatibilityData[] = [];

  for (let i = 0; i < vehicleIds.length; i += chunkSize) {
    const chunk = vehicleIds.slice(i, i + chunkSize);
    const url = `https://api.wps-inc.com/vehicles?filter[id]=${chunk.join(',')}&include=vehiclemodel.vehiclemake,vehicleyear&page[size]=650`;

    try {
      const response = await fetch(url, { method: "GET", headers });
      const result = await response.json();
      
      if (result.data) {
        allVehicles.push(...result.data);
      }
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  }

  return allVehicles;
}

export async function getVehicleModel(yearId: string, makeId: string): Promise<VehicleModel[]> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  try {
    const url = `https://api.wps-inc.com/vehicleyears/${yearId}/vehiclemodels?filter[vehiclemake_id]=${makeId}&page[size]=600`;
    const response = await fetch(url, { method: "GET", headers });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error:', errorData);
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const result = await response.json();
    return result.data as VehicleModel[];
  } catch (error) {
    console.error("Error fetching vehicle models:", error);
    return [];
  }
}

export async function getVehicleItemsId(modelId: string, yearId: string): Promise<VehicleModel[]> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  try {
    const url = `https://api.wps-inc.com/vehicles?filter[vehiclemodel_id]=${modelId}&filter[vehicleyear_id]=${yearId}&page[size]=600`;
    const response = await fetch(url, { method: "GET", headers });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error:', errorData);
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const result = await response.json();
    return result.data as VehicleModel[];
  } catch (error) {
    console.error("Error fetching vehicle models:", error);
    return [];
  }
}

export async function getVehicleItems(vehicleId: string, cursor: string | null = null, productType: string | null = null, sort: string | null = null): Promise<{ data: any[]; meta: Meta }> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  try {
    let url = `https://api.wps-inc.com/vehicles/${vehicleId}/items?include=inventory,images,attributevalues&page[size]=30`;

    if (cursor) {
      url += `&page[cursor]=${encodeURIComponent(cursor)}`;
    }

    if (productType) {
      url += `&filter[product_type]=${encodeURIComponent(productType)}`;
    }

    if (sort) {
      url += `&${sort}`;
    }

    const response = await fetch(url, { method: "GET", headers });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error:', errorData);
      throw new Error(`API responded with status ${response.status}`);
    }

    const result = await response.json();

    // Ordenar los productos por inventario
    result.data.sort((a: any, b: any) => {
      const inventoryA = a.inventory?.data?.total || 0;
      const inventoryB = b.inventory?.data?.total || 0;
      
      // Si ambos tienen inventario 0 o ambos tienen inventario > 0, mantener el orden original
      if ((inventoryA === 0 && inventoryB === 0) || (inventoryA > 0 && inventoryB > 0)) {
        return 0;
      }
      // Si A tiene inventario > 0 y B tiene inventario 0, A va primero
      if (inventoryA > 0 && inventoryB === 0) {
        return -1;
      }
      // Si B tiene inventario > 0 y A tiene inventario 0, B va primero
      return 1;
    });

    return result;
  } catch (error) {
    console.error("Error fetching vehicle items:", error);
    return { data: [], meta: {} as Meta };
  }
}
