import "dotenv/config";
import { prisma } from "../lib/prisma";

const API_URL = "https://api.wps-inc.com/items";
const BATCH_SIZE = 600;
const API_TOKEN = process.env.WPS_API_TOKEN || "";

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
  name: string;
  brand_id: number | null;
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
  let url = `${API_URL}?page[size]=${BATCH_SIZE}&include=inventory`;
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

async function updateProductInventory(item: WpsItem): Promise<{ updated: boolean; sku: string }> {
  const inventoryData = item.inventory?.data;
  const totalInventory = inventoryData?.total || 0;

  // Buscar producto por wps_id
  const product = await prisma.product.findUnique({
    where: { wps_id: item.id.toString() },
    select: { id: true, inventory_total: true, sku: true },
  });

  if (!product) {
    return { updated: false, sku: item.sku };
  }

  // Solo actualizar si el inventario cambió
  if (product.inventory_total !== totalInventory) {
    await prisma.product.update({
      where: { wps_id: item.id.toString() },
      data: {
        inventory_total: totalInventory,
        inventory_details: (inventoryData || null) as any,
        updated_at: new Date(),
      },
    });
    return { updated: true, sku: item.sku };
  }

  return { updated: false, sku: item.sku };
}

async function syncInventory(): Promise<void> {
  console.log("🚀 Starting inventory update...\n");

  // Connect to database
  await prisma.$connect();
  console.log("✅ Connected to PostgreSQL\n");

  // Contar productos locales antes de iniciar
  const localProductCount = await prisma.product.count();
  console.log(`📦 Products in local DB: ${localProductCount}\n`);

  let cursor: string | null = null;
  let totalChecked = 0;
  let totalUpdated = 0;
  let totalNotFound = 0;
  let totalSkipped = 0;
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
        const result = await updateProductInventory(item);
        totalChecked++;

        if (result.updated) {
          totalUpdated++;
          console.log(`🔄 Updated: ${result.sku} (ID: ${item.id})`);
        } else {
          const product = await prisma.product.findUnique({
            where: { wps_id: item.id.toString() },
          });
          if (!product) {
            totalNotFound++;
          } else {
            totalSkipped++;
          }
        }
      } catch (error) {
        console.error(`❌ Error updating item ${item.id}:`, error);
      }
    }

    // Progress report every 5 batches
    if (totalChecked % (BATCH_SIZE * 5) === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`\n📊 Progress: ${totalChecked} checked, ${totalUpdated} updated, ${totalNotFound} not found, ${totalSkipped} unchanged (${elapsed}s)\n`);
    }

    // Check if we have more pages
    if (!nextCursor) {
      console.log("\n✅ Inventory check complete - no more pages");
      break;
    }

    cursor = nextCursor;

    // Rate limiting - small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Final stats
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("\n" + "=".repeat(60));
  console.log("📈 INVENTORY UPDATE COMPLETE");
  console.log("=".repeat(60));
  console.log(`Total checked: ${totalChecked}`);
  console.log(`Total updated: ${totalUpdated}`);
  console.log(`Not found in local DB: ${totalNotFound}`);
  console.log(`Unchanged (skipped): ${totalSkipped}`);
  console.log(`Time elapsed: ${elapsed}s`);
  console.log(`Rate: ${(totalChecked / parseFloat(elapsed)).toFixed(1)} items/sec`);

  await prisma.$disconnect();
}

// Run sync
syncInventory()
  .then(() => {
    console.log("\n✅ Inventory update completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
