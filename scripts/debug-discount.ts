import { prisma } from "@/lib/prisma";

async function debugDiscount() {
  try {
    console.log("🔍 Verificando conexión a la base de datos...");
    
    // Verificar que podemos conectar
    await prisma.$connect();
    console.log("✅ Conexión exitosa");
    
    // Listar todos los códigos de descuento
    console.log("\n📋 Códigos de descuento en la base de datos:");
    const allCodes = await prisma.discountCode.findMany();
    console.table(allCodes);
    
    // Buscar específicamente DEMO
    console.log("\n🔎 Buscando código DEMO:");
    const demoCode = await prisma.discountCode.findUnique({
      where: { code: "DEMO" },
    });
    
    if (demoCode) {
      console.log("✅ Código DEMO encontrado:");
      console.log(demoCode);
    } else {
      console.log("❌ Código DEMO NO encontrado");
      
      // Intentar búsqueda case-insensitive
      console.log("\n🔎 Buscando con query case-insensitive:");
      const allDemoCodes = await prisma.discountCode.findMany({
        where: {
          code: { equals: "DEMO", mode: "insensitive" },
        },
      });
      console.log("Resultados:", allDemoCodes);
    }
    
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

debugDiscount();
