const { PrismaClient } = require('@prisma/client');

// Cliente para DB local (desarrollo)
const prismaLocal = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:postgres@localhost:5432/am_motos?schema=public',
    },
  },
});

// Cliente para DB de Railway (producción)
const prismaProd = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_PROD, // Necesitarás setear esta variable
    },
  },
});

async function syncData() {
  console.log('🚀 Sincronizando datos a Railway...');

  try {
    // Obtener datos locales
    const orders = await prismaLocal.order.findMany();
    const discountCodes = await prismaLocal.discountCode.findMany();

    console.log(`📦 ${orders.length} órdenes encontradas localmente`);
    console.log(`🎟️  ${discountCodes.length} códigos de descuento encontrados localmente`);

    // Insertar en Railway (saltar si ya existen)
    for (const order of orders) {
      try {
        await prismaProd.order.create({ data: order });
        console.log(`✅ Orden ${order.id} creada`);
      } catch (e) {
        if (e.code === 'P2002') {
          console.log(`⏩ Orden ${order.id} ya existe, saltando`);
        } else {
          console.error(`❌ Error con orden ${order.id}:`, e.message);
        }
      }
    }

    for (const code of discountCodes) {
      try {
        await prismaProd.discountCode.create({ data: code });
        console.log(`✅ Código ${code.code} creado`);
      } catch (e) {
        if (e.code === 'P2002') {
          console.log(`⏩ Código ${code.code} ya existe, saltando`);
        } else {
          console.error(`❌ Error con código ${code.code}:`, e.message);
        }
      }
    }

    console.log('✨ Sincronización completada!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prismaLocal.$disconnect();
    await prismaProd.$disconnect();
  }
}

syncData();
