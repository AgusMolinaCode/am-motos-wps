import "dotenv/config";
import { prisma } from "../lib/prisma";

const API_URL = "https://api.wps-inc.com/brands?page[size]=1000";
const API_TOKEN = process.env.WPS_API_TOKEN || "";

interface WpsBrand {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface WpsResponse {
  data: WpsBrand[];
  meta: {
    cursor: {
      current: string | null;
      prev: string | null;
      next: string | null;
      count: number;
    };
  };
}

async function fetchWpsBrands(): Promise<WpsResponse> {
  const response = await fetch(API_URL, {
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

async function syncBrand(brand: WpsBrand): Promise<void> {
  await prisma.brand.upsert({
    where: { id: brand.id },
    update: {
      name: brand.name,
      updated_at: new Date(),
    },
    create: {
      id: brand.id,
      name: brand.name,
      created_at: new Date(brand.created_at),
      updated_at: new Date(brand.updated_at),
    },
  });
}

async function syncAll(): Promise<void> {
  console.log("🚀 Starting WPS Brands → PostgreSQL sync...\n");

  // Connect to database
  await prisma.$connect();
  console.log("✅ Connected to PostgreSQL\n");

  // Fetch brands from WPS
  console.log("📡 Fetching brands from WPS...");
  const response = await fetchWpsBrands();
  const brands = response.data;

  console.log(`📊 Found ${brands.length} brands\n`);

  // Sync each brand
  let totalSynced = 0;
  let totalErrors = 0;
  const startTime = Date.now();

  for (const brand of brands) {
    try {
      await syncBrand(brand);
      totalSynced++;
    } catch (error) {
      totalErrors++;
      console.error(`❌ Error syncing brand ${brand.id}:`, error);
    }
  }

  // Final stats
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("\n" + "=".repeat(50));
  console.log("📈 SYNC COMPLETE");
  console.log("=".repeat(50));
  console.log(`Total synced: ${totalSynced}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Time elapsed: ${elapsed}s`);

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
