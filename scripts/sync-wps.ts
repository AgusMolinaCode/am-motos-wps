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

async function syncProduct(item: WpsItem): Promise<void> {
  const inventoryData = item.inventory?.data;

  await prisma.product.upsert({
    where: { wps_id: item.id.toString() },
    update: {
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
      inventory_details: inventoryData || null,
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
      carb: item.carb,
      propd1: item.propd1,
      propd2: item.propd2,
      prop_65_code: item.prop_65_code,
      prop_65_detail: item.prop_65_detail,
      superseded_sku: item.superseded_sku,
      unit_of_measurement_id: item.unit_of_measurement_id,
      sort: item.sort,
      images: item.images?.data || null,
      attributevalues: item.attributevalues?.data || null,
      published_at: item.published_at ? new Date(item.published_at) : null,
      created_at: item.created_at ? new Date(item.created_at) : null,
      updated_at: item.updated_at ? new Date(item.updated_at) : null,
      last_synced_at: new Date(),
    },
    create: {
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
      inventory_details: inventoryData || null,
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
      carb: item.carb,
      propd1: item.propd1,
      propd2: item.propd2,
      prop_65_code: item.prop_65_code,
      prop_65_detail: item.prop_65_detail,
      superseded_sku: item.superseded_sku,
      unit_of_measurement_id: item.unit_of_measurement_id,
      sort: item.sort,
      images: item.images?.data || null,
      attributevalues: item.attributevalues?.data || null,
      published_at: item.published_at ? new Date(item.published_at) : null,
      created_at: item.created_at ? new Date(item.created_at) : null,
      updated_at: item.updated_at ? new Date(item.updated_at) : null,
      last_synced_at: new Date(),
    },
  });
}

async function syncAll(): Promise<void> {
  console.log("🚀 Starting WPS → PostgreSQL sync...\n");

  // Connect to database
  await prisma.$connect();
  console.log("✅ Connected to PostgreSQL\n");

  // Delete all existing products
  const deleteCount = await prisma.product.deleteMany({});
  console.log(`🗑️  Deleted ${deleteCount.count} existing products\n`);

  let cursor: string | null = null;
  let totalSynced = 0;
  let totalErrors = 0;
  const startTime = Date.now();
  let firstBatch = true;

  while (true) {
    // Fetch batch from WPS
    const response = await fetchWpsItems(cursor);
    const items = response.data;
    const nextCursor = response.meta.cursor.next;

    if (items.length === 0) {
      console.log("\n📦 No more items to sync");
      break;
    }

    // Sync each item
    for (const item of items) {
      try {
        await syncProduct(item);
        totalSynced++;
      } catch (error) {
        totalErrors++;
        console.error(`❌ Error syncing item ${item.id}:`, error);
      }
    }

    // Report progress
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const rate = (totalSynced / parseFloat(elapsed)).toFixed(1);

    if (firstBatch) {
      console.log(`📊 First batch: ${items.length} items | Rate: ${rate} items/sec`);
      firstBatch = false;
    }

    // Check if we have more pages
    if (!nextCursor) {
      console.log("\n✅ Sync complete - no more pages");
      break;
    }

    cursor = nextCursor;

    // Rate limiting - small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Final stats
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("\n" + "=".repeat(50));
  console.log("📈 SYNC COMPLETE");
  console.log("=".repeat(50));
  console.log(`Total synced: ${totalSynced}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Time elapsed: ${elapsed}s`);
  console.log(`Sync rate: ${(totalSynced / parseFloat(elapsed)).toFixed(1)} items/sec`);

  await prisma.$disconnect();
}

// Run sync
syncAll()
  .then(() => {
    console.log("\n✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
