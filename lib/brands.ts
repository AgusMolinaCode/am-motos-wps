"use server";

import { BrandId, Brands, Meta, BrandStatus } from "@/types/interface";

export async function getBrandsItems(
  brandId: string,
  cursor: string | null = null,
  productType?: string
): Promise<{ data: BrandId[]; meta: Meta }> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  // Construir la URL base
  let url = `https://api.wps-inc.com/items?filter[brand_id]=${brandId}&include=inventory,images&page[size]=100`;

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

  // Filtrar productos con inventario total > 0
  const itemsWithInventory = (result.data as BrandId[]).filter(
    (item) =>
      item.inventory?.data?.total !== undefined && item.inventory.data.total > 0
  );

  // Eliminar duplicados basados en el ID
  const uniqueItemsWithInventory = Array.from(
    new Map(itemsWithInventory.map((item) => [item.id, item])).values()
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
    const { data } = await getBrands(brandId);
    return data[0]?.name || brandId;
  } catch (error) {
    console.error(`Error fetching brand name for ID ${brandId}:`, error);
    return brandId;
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
  let url = `https://api.wps-inc.com/items?filter[status_id]=${sanitizedStatus}&include=inventory&page[size]=20`;

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

    // Filtrar items con inventario mayor a 0
    const itemsWithInventory = (result.data as BrandStatus[]).filter(
      (item) => item.inventory && item.inventory.data.total > 0
    );

    return {
      data: itemsWithInventory,
      meta: result.meta as Meta,
    };
  } catch (error) {
    console.error(
      `Unexpected error fetching items with status ${sanitizedStatus}:`,
      error
    );
    return {
      data: [],
      meta: { cursor: { current: "", prev: null, next: null, count: 0 } },
    };
  }
}

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
    cascos: "Helmets",
    proteccion: "Protective/Safety,Luggage,Bags",
    herramientas: "Tools",
    casual: "Vests,Sweaters,Suits,Socks,Shorts,Shoes,Jackets,Hoodies",
  };

  // Sanitizar y mapear el tipo de producto
  const sanitizedProductType =
    productTypeMap[productType.toLowerCase()] || productType;

  // Codificar el tipo de producto para la URL
  const encodedProductType = encodeURIComponent(sanitizedProductType);

  // Construir la URL con el filtro de brand_id si está presente
  const url = cursor
    ? `https://api.wps-inc.com/items?filter[product_type]=${encodedProductType}&include=inventory,images&sort[desc]=created_at&page[size]=100&page[cursor]=${encodeURIComponent(
        cursor
      )}${brandId ? `&filter[brand_id]=${brandId}` : ""}`
    : `https://api.wps-inc.com/items?filter[product_type]=${encodedProductType}&include=inventory,images&sort[desc]=created_at&page[size]=100${
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

    // Filtrar productos con inventario total > 0
    const itemsWithInventory = (result.data as BrandStatus[]).filter(
      (item) => item.inventory?.data?.total !== undefined && item.inventory.data.total > 0
    );

    // Eliminar duplicados basados en el ID
    const uniqueItemsWithInventory = Array.from(
      new Map(itemsWithInventory.map((item) => [item.id, item])).values()
    );

    return {
      data: uniqueItemsWithInventory.slice(0, 30),
      meta: {
        ...result.meta,
        cursor: {
          ...result.meta.cursor,
          count: uniqueItemsWithInventory.length,
          next: uniqueItemsWithInventory.length > 30 ? result.meta.cursor.next : null
        }
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
  let url = `https://api.wps-inc.com/items?filter[status_id]=${status}&include=inventory,images&page[size]=100&sort[desc]=created_at`;

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
    "50000-00023",
    "FSC059-8-001",
    "8306423-9190-XL",
    "378-725L",
    "3768424-2014- M",
    "2010025-4512-11",
    "2012025-1030-10",
    "01.7365.B",
    "808869",
    "23375A",
    "24244B",
    "4978M09600",
    "HCSHIM02",
    "8719",
    "3700325-7158-L",
    "RMS-8907076",
    "045695",
  ]
): Promise<{ data: BrandStatus[]; meta: Meta }> {
  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  // Convertir el array de IDs a un string separado por comas
  const productIdsString = supplierProductIds.join(",");

  const url = `https://api.wps-inc.com/items?filter[supplier_product_id]=${encodeURIComponent(
    productIdsString
  )}&include=inventory,images&page[size]=100`;

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

    return {
      data: result.data as BrandStatus[],
      meta: result.meta as Meta,
    };
  } catch (error) {
    console.error("Unexpected error fetching recommended items:", error);
    return {
      data: [],
      meta: { cursor: { current: "", prev: null, next: null, count: 0 } },
    };
  }
}
