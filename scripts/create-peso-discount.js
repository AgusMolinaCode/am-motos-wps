/**
 * Script para crear el código de descuento "PESO"
 * Este código deja el carrito en $1 ARS sin importar el total
 * 
 * Ejecución: node scripts/create-peso-discount.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Buscar si ya existe
    const existing = await prisma.$queryRaw`
      SELECT * FROM discount_codes WHERE UPPER(code) = 'PESO' LIMIT 1
    `;

    if (existing.length > 0) {
      // Reactivar si existe
      await prisma.$executeRaw`
        UPDATE discount_codes 
        SET 
          is_active = true,
          description = 'Deja el total del carrito en $1 ARS',
          updated_at = NOW()
        WHERE id = ${existing[0].id}
      `;
      console.log('✅ Código "PESO" reactivado exitosamente');
    } else {
      // Crear nuevo
      await prisma.$executeRaw`
        INSERT INTO discount_codes (
          id, code, description, discount_percent, discount_amount,
          max_uses, used_count, min_purchase_amount, valid_from, valid_until,
          is_active, created_at, updated_at
        ) VALUES (
          gen_random_uuid(),
          'PESO',
          'Deja el total del carrito en $1 ARS',
          0,
          NULL,
          NULL,
          0,
          NULL,
          NOW(),
          NULL,
          true,
          NOW(),
          NOW()
        )
      `;
      console.log('✅ Código "PESO" creado exitosamente');
    }

    // Mostrar detalles
    const result = await prisma.$queryRaw`
      SELECT code, description, is_active, used_count, max_uses
      FROM discount_codes 
      WHERE UPPER(code) = 'PESO'
    `;
    
    console.log('\nDetalles del código:');
    console.table(result[0]);
    
    console.log('\n💡 Uso: Ingresa "PESO" en el checkout para dejar el carrito en $1 ARS');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
