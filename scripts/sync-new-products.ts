import "dotenv/config";
import { prisma } from "../lib/prisma";

const API_URL = "https://api.wps-inc.com/items";
const BATCH_SIZE = 600;
const API_TOKEN = process.env.WPS_API_TOKEN || "";

interface WpsImage {
  id: number;
  domain: string;
  path: string;
  filename: string;
  alt: string | null;
  mime: string;
  width: number;
  height: number;
  size: number;
  signature: string;
  created_at: string;
  updated_at: string;
}

interface WpsAttributeValue {
  id: number;
  attributekey_id: number;
  name: string;
  sort: number;
  created_at: string;
  updated_at: string;
}

interface WpsInventory {
  id: number;
  item_id: number;
  sku: string;
  ca_warehouse: number;
  ga_warehouse: number;
  id_warehouse: number;
  in_warehouse: number;
  pa_warehouse: number;
  pa2_warehouse: number;
  tx_warehouse: number;
  total: number;
  created_at: string;
  updated_at: string;
}

interface WpsItem {
  id: number;
  sku: string;
  supplier_product_id: string | null;
  product_id: number | null;
  name: string;
  brand_id: number | null;
  product_type: string | null;
  list_price: string | null;
  mapp_price: string | null;
  standard_dealer_price: string | null;
  length: number | null;
  width: number | null;
  height: number | null;
  weight: number | null;
  upc: string | null;
  superseded_sku: string | null;
  status_id: string | null;
  status: string | null;
  unit_of_measurement_id: number | null;
  has_map_policy: boolean;
  sort: number;
  created_at: string | null;
  updated_at: string | null;
  published_at: string | null;
  carb: unknown;
  propd1: string | null;
  propd2: string | null;
  prop_65_code: string | null;
  prop_65_detail: string | null;
  drop_ship_fee: string | null;
  drop_ship_eligible: boolean;
  country_id: number | null;
  images: { data: WpsImage[] };
  attributevalues: { data: WpsAttributeValue[] };
  inventory: { data: WpsInventory };
}

interface WpsResponse {
  data: WpsItem[];
  meta: {
    cursor: {
      current: string | null;
      prev: string | null;
      next: string | null;
      count: number;
    };
  };
}

async function fetchWpsItems(cursor: string | null = null): Promise<WpsResponse> {
  let url = `${API_URL}?page[size]=${BATCH_SIZE}&include=inventory,images,attributevalues`;
  if (cursor) {
    url += `&page[cursor]=${cursor}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`WPS API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function createProduct(item: WpsItem): Promise<{ created: boolean; sku: string }> {
  // Verificar si el producto ya existe
  const existing = await prisma.product.findUnique({
    where: { wps_id: item.id.toString() },
    select: { id: true },
  });

  if (existing) {
    return { created: false, sku: item.sku };
  }

  const inventoryData = item.inventory?.data;

  // Crear el producto nuevo
  await prisma.product.create({
    data: {
      wps_id: item.id.toString(),
      sku: item.sku,
      supplier_product_id: item.supplier_product_id,
      product_id: item.product_id,
      name: item.name,
      brand_id: item.brand_id,
      product_type: item.product_type,
      list_price: item.list_price ? parseFloat(item.list_price) : null,
      mapp_price: item.mapp_price ? parseFloat(item.mapp_price) : null,
      dealer_price: item.standard_dealer_price ? parseFloat(item.standard_dealer_price) : null,
      inventory_total: inventoryData?.total || 0,
      inventory_details: (inventoryData || null) as any,
      length: item.length,
      width: item.width,
      height: item.height,
      weight: item.weight,
      upc: item.upc,
      status: item.status,
      status_id: item.status_id,
      drop_ship_eligible: item.drop_ship_eligible,
      drop_ship_fee: item.drop_ship_fee,
      country_id: item.country_id,
      has_map_policy: item.has_map_policy,
      carb: item.carb as any,
      propd1: item.propd1,
      propd2: item.propd2,
      prop_65_code: item.prop_65_code,
      prop_65_detail: item.prop_65_detail,
      superseded_sku: item.superseded_sku,
      unit_of_measurement_id: item.unit_of_measurement_id,
      sort: item.sort,
      images: (item.images?.data || null) as any,
      attributevalues: (item.attributevalues?.data || null) as any,
      published_at: item.published_at ? new Date(item.published_at) : null,
      created_at: item.created_at ? new Date(item.created_at) : null,
      updated_at: item.updated_at ? new Date(item.updated_at) : null,
      last_synced_at: new Date(),
    },
  });

  return { created: true, sku: item.sku };
}

async function syncNewProducts(): Promise<void> {
  console.log("🚀 Starting new products sync...\n");

  // Connect to database
  await prisma.$connect();
  console.log("✅ Connected to PostgreSQL\n");

  // Contar productos antes
  const countBefore = await prisma.product.count();
  console.log(`📦 Products in local DB before: ${countBefore}\n`);

  let cursor: string | null = null;
  let totalChecked = 0;
  let totalCreated = 0;
  let totalExisting = 0;
  const startTime = Date.now();

  while (true) {
    // Fetch batch from WPS
    const response = await fetchWpsItems(cursor);
    const items = response.data;
    const nextCursor = response.meta.cursor.next;

    if (items.length === 0) {
      console.log("\n📦 No more items to check");
      break;
    }

    // Process each item
    for (const item of items) {
      try {
        const result = await createProduct(item);
        totalChecked++;

        if (result.created) {
          totalCreated++;
          console.log(`✅ Created: ${result.sku} (ID: ${item.id})`);
        } else {
          totalExisting++;
        }
      } catch (error) {
        console.error(`❌ Error creating item ${item.id}:`, error);
      }
    }

    // Progress report every 5 batches
    if (totalChecked % (BATCH_SIZE * 5) === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`\n📊 Progress: ${totalChecked} checked, ${totalCreated} created, ${totalExisting} already exist (${elapsed}s)\n`);
    }

    // Check if we have more pages
    if (!nextCursor) {
      console.log("\n✅ Scan complete - no more pages");
      break;
    }

    cursor = nextCursor;

    // Rate limiting - small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Contar productos después
  const countAfter = await prisma.product.count();

  // Final stats
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("\n" + "=".repeat(60));
  console.log("📈 NEW PRODUCTS SYNC COMPLETE");
  console.log("=".repeat(60));
  console.log(`Total checked: ${totalChecked}`);
  console.log(`Total created: ${totalCreated}`);
  console.log(`Already existed: ${totalExisting}`);
  console.log(`Products before: ${countBefore}`);
  console.log(`Products after: ${countAfter}`);
  console.log(`New products added: ${countAfter - countBefore}`);
  console.log(`Time elapsed: ${elapsed}s`);
  console.log(`Rate: ${(totalChecked / parseFloat(elapsed)).toFixed(1)} items/sec`);

  await prisma.$disconnect();
}

// Run sync
syncNewProducts()
  .then(() => {
    console.log("\n✅ New products sync completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
