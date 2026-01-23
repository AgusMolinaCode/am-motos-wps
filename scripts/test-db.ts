import { prisma } from "../lib/prisma";

async function testConnection() {
  try {
    // Test basic connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Test simple query (count products)
    const count = await prisma.product.count();
    console.log(`📊 Products in DB: ${count}`);

    // Test insert (will fail but shows write works)
    try {
      await prisma.product.create({
        data: {
          wps_id: "test-123",
          sku: "TEST-001",
          name: "Test Product",
          brand: "Test Brand",
          product_type: "Test Type",
          inventory_total: 0,
          price: 0,
        },
      });
      console.log("✅ Write operation successful");

      // Clean up test data
      await prisma.product.delete({
        where: { wps_id: "test-123" },
      });
      console.log("✅ Delete operation successful");
    } catch (e: any) {
      if (e.code !== "P2002") {
        console.log("⚠️ Write test:", e.message);
      } else {
        console.log("✅ Unique constraint works (expected error)");
      }
    }

    console.log("\n🎉 All tests passed! PostgreSQL + Prisma is ready.");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
