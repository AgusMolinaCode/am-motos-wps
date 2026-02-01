import "dotenv/config";
import { prisma } from "../../lib/prisma";

const API_URL = "https://api.wps-inc.com/vehicles?page[size]=40000";
const API_TOKEN = process.env.WPS_API_TOKEN || "";

interface WpsVehicle {
  id: number;
  vehiclemodel_id: number;
  vehicleyear_id: number;
  name: string | null;
  display_name: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface WpsResponse {
  data: WpsVehicle[];
}

async function syncAll(): Promise<void> {
  console.log("🚀 Starting WPS Vehicles → PostgreSQL sync...\n");

  // Connect to database
  await prisma.$connect();
  console.log("✅ Connected to PostgreSQL\n");

  // Fetch from WPS
  console.log("📡 Fetching vehicles from WPS...");
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
  const vehicles = result.data;

  console.log(`📊 Found ${vehicles.length} vehicles\n`);

  // Disable foreign key triggers temporarily
  console.log("🔧 Disabling foreign key constraints...");
  await prisma.$queryRaw`ALTER TABLE vehicle DISABLE TRIGGER ALL`;

  // Use queryRaw to insert without foreign key constraints
  let totalSynced = 0;
  let totalErrors = 0;
  const startTime = Date.now();

  for (const vehicle of vehicles) {
    try {
      await prisma.$queryRaw`
        INSERT INTO vehicle (
          id, vehiclemodel_id, vehicleyear_id, name, display_name,
          active, created_at, updated_at
        )
        VALUES (
          ${vehicle.id}, ${vehicle.vehiclemodel_id}, ${vehicle.vehicleyear_id},
          ${vehicle.name}, ${vehicle.display_name}, COALESCE(${vehicle.active}, true),
          ${new Date(vehicle.created_at)}, ${new Date(vehicle.updated_at)}
        )
        ON CONFLICT (id) DO UPDATE SET
          vehiclemodel_id = EXCLUDED.vehiclemodel_id,
          vehicleyear_id = EXCLUDED.vehicleyear_id,
          name = EXCLUDED.name,
          display_name = EXCLUDED.display_name,
          active = EXCLUDED.active,
          updated_at = EXCLUDED.updated_at
      `;
      totalSynced++;
    } catch (error) {
      totalErrors++;
      console.error(`❌ Error syncing vehicle ${vehicle.id}:`, error);
    }
  }

  // Re-enable foreign key triggers
  console.log("🔧 Re-enabling foreign key constraints...");
  await prisma.$queryRaw`ALTER TABLE vehicle ENABLE TRIGGER ALL`;

  // Final stats
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("=".repeat(50));
  console.log("📈 SYNC COMPLETE");
  console.log("=".repeat(50));
  console.log(`Total synced: ${totalSynced}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Time elapsed: ${elapsed}s`);
  console.log(`Total in DB: ${await prisma.vehicle.count()}`);

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
