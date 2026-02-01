import "dotenv/config";
import { prisma } from "../../lib/prisma";

const API_URL = "https://api.wps-inc.com/vehicleyears?page[size]=100";
const API_TOKEN = process.env.WPS_API_TOKEN || "";

interface WpsVehicleYear {
  id: number;
  name: number;
  created_at: string;
  updated_at: string;
}

interface WpsResponse {
  data: WpsVehicleYear[];
}

async function syncAll(): Promise<void> {
  console.log("🚀 Starting WPS VehicleYears → PostgreSQL sync...\n");

  await prisma.$connect();
  console.log("✅ Connected to PostgreSQL\n");

  console.log("📡 Fetching vehicle years from WPS...");
  console.log(`URL: ${API_URL}\n`);

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

  const result: WpsResponse = await response.json();
  const years = result.data;

  console.log(`📊 Found ${years.length} vehicle years\n`);

  let totalSynced = 0;
  let totalErrors = 0;
  const startTime = Date.now();

  for (const year of years) {
    try {
      await prisma.$queryRaw`
        INSERT INTO vehicle_year (
          id, year, created_at, updated_at
        )
        VALUES (
          ${year.id}, ${year.name},
          ${new Date(year.created_at)}, ${new Date(year.updated_at)}
        )
        ON CONFLICT (id) DO UPDATE SET
          year = EXCLUDED.year,
          updated_at = EXCLUDED.updated_at
      `;
      totalSynced++;
    } catch (error) {
      totalErrors++;
      console.error(`❌ Error syncing year ${year.id}:`, error);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("=".repeat(50));
  console.log("📈 SYNC COMPLETE");
  console.log("=".repeat(50));
  console.log(`Total synced: ${totalSynced}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Time elapsed: ${elapsed}s`);
  console.log(`Total in DB: ${await prisma.vehicleYear.count()}`);

  await prisma.$disconnect();
}

syncAll()
  .then(() => {
    console.log("\n✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
