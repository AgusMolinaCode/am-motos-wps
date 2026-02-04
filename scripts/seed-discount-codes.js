const { PrismaClient } = require('@prisma/client');

// Conectar a Railway (producción)
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Insertando códigos de descuento en Railway...\n');

  const discountCodes = [
    {
      id: 'a56b5821-8d67-4b4b-8cfc-273104619922',
      code: 'PESO',
      description: 'Deja el total del carrito en $1 ARS',
      discount_percent: 0,
      discount_amount: null,
      max_uses: null,
      used_count: 16,
      min_purchase_amount: null,
      valid_from: new Date('2026-02-03 15:18:24.179'),
      valid_until: null,
      is_active: true,
      created_at: new Date('2026-02-03 15:18:24.179'),
      updated_at: new Date('2026-02-04 04:51:30.716'),
    },
    {
      id: 'b12fb64e-a0f0-481a-82ae-90159a7271ce',
      code: 'DEMO',
      description: 'Código DEMO - 98% de descuento especial',
      discount_percent: 98,
      discount_amount: null,
      max_uses: 1000,
      used_count: 17,
      min_purchase_amount: null,
      valid_from: new Date('2026-02-03 00:38:10.018'),
      valid_until: null,
      is_active: false,
      created_at: new Date('2026-02-03 00:38:10.018'),
      updated_at: new Date('2026-02-04 04:51:56.596'),
    },
  ];

  for (const code of discountCodes) {
    try {
      await prisma.discountCode.create({ data: code });
      console.log(`✅ Código "${code.code}" creado`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`⏩ Código "${code.code}" ya existe, saltando`);
      } else {
        console.error(`❌ Error con "${code.code}":`, error.message);
      }
    }
  }

  console.log('\n✨ Listo!');
  console.log('📊 Total códigos en Railway:', await prisma.discountCode.count());
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
