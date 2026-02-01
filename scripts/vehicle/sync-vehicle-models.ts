import "dotenv/config";
import { prisma } from "../../lib/prisma";

const API_URL = "https://api.wps-inc.com/vehiclemodels?page[size]=10000";
const API_TOKEN = process.env.WPS_API_TOKEN || "";

interface WpsVehicleModel {
  id: number;
  vehiclemake_id: number;
  db2_key: string | null;
  name: string;
  created_at: string;
  updated_at: string;
}

interface WpsResponse {
  data: WpsVehicleModel[];
}

async function syncAll(): Promise<void> {
  console.log("🚀 Starting WPS VehicleModels → PostgreSQL sync...\n");

  await prisma.$connect();
  console.log("✅ Connected to PostgreSQL\n");

  console.log("📡 Fetching vehicle models from WPS...");
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
  const models = result.data;

  console.log(`📊 Found ${models.length} vehicle models\n`);

  let totalSynced = 0;
  let totalErrors = 0;
  const startTime = Date.now();

  for (const model of models) {
    try {
      await prisma.$queryRaw`
        INSERT INTO vehicle_model (
          id, vehiclemake_id, db2_key, name, created_at, updated_at
        )
        VALUES (
          ${model.id}, ${model.vehiclemake_id}, ${model.db2_key}, ${model.name},
          ${new Date(model.created_at)}, ${new Date(model.updated_at)}
        )
        ON CONFLICT (id) DO UPDATE SET
          vehiclemake_id = EXCLUDED.vehiclemake_id,
          db2_key = EXCLUDED.db2_key,
          name = EXCLUDED.name,
          updated_at = EXCLUDED.updated_at
      `;
      totalSynced++;
    } catch (error) {
      totalErrors++;
      console.error(`❌ Error syncing model ${model.id}:`, error);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("=".repeat(50));
  console.log("📈 SYNC COMPLETE");
  console.log("=".repeat(50));
  console.log(`Total synced: ${totalSynced}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Time elapsed: ${elapsed}s`);
  console.log(`Total in DB: ${await prisma.vehicleModel.count()}`);

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
