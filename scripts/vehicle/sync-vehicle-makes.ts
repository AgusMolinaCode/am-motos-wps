import "dotenv/config";
import { prisma } from "../../lib/prisma";

const API_URL = "https://api.wps-inc.com/vehiclemakes?page[size]=5000";
const API_TOKEN = process.env.PUBLIC_WPS || "";

interface WpsVehicleMake {
  id: number;
  db2_key: string | null;
  name: string;
  created_at: string;
  updated_at: string;
}

interface WpsResponse {
  data: WpsVehicleMake[];
  meta?: {
    cursor?: {
      next: string | null;
    };
  };
}

async function fetchVehicleMakes(): Promise<WpsVehicleMake[]> {
  let allData: WpsVehicleMake[] = [];
  let nextCursor: string | null = null;

  do {
    const url = `${API_URL}${nextCursor ? `&page[cursor]=${nextCursor}` : ""}`;
    console.log(`Fetching page${nextCursor ? ` (cursor: ${nextCursor})` : ""}...`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: API_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`WPS API Error: ${response.status} ${response.statusText}`);
    }

    const result: WpsResponse = await response.json();

    if (result.data) {
      allData = [...allData, ...result.data];
    }

    nextCursor = result.meta?.cursor?.next || null;
    console.log(`  -> Received ${result.data?.length || 0} records`);
  } while (nextCursor);

  return allData;
}

async function syncVehicleMake(make: WpsVehicleMake): Promise<void> {
  await prisma.vehicleMake.upsert({
    where: { id: make.id },
    update: {
      db2_key: make.db2_key,
      name: make.name,
      updated_at: make.updated_at ? new Date(make.updated_at) : new Date(),
    },
    create: {
      id: make.id,
      db2_key: make.db2_key,
      name: make.name,
      created_at: make.created_at ? new Date(make.created_at) : new Date(),
      updated_at: make.updated_at ? new Date(make.updated_at) : new Date(),
    },
  });
}

async function syncAll(): Promise<void> {
  console.log("🚀 Starting WPS VehicleMakes → PostgreSQL sync...\n");

  // Connect to database
  await prisma.$connect();
  console.log("✅ Connected to PostgreSQL\n");

  // Fetch from WPS
  console.log("📡 Fetching vehicle makes from WPS...");
  const data = await fetchVehicleMakes();

  console.log(`📊 Found ${data.length} vehicle makes\n`);

  // Sync each
  let totalSynced = 0;
  let totalErrors = 0;
  const startTime = Date.now();

  for (const make of data) {
    try {
      await syncVehicleMake(make);
      totalSynced++;
    } catch (error) {
      totalErrors++;
      console.error(`❌ Error syncing make ${make.id}:`, error);
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
  console.log(`Total in DB: ${await prisma.vehicleMake.count()}`);

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
