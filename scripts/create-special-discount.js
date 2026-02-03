/**
 * Script para crear/actualizar el código de descuento especial
 * Este código deja el carrito en $1 ARS
 * 
 * ID fijo en la base de datos: a56b5821-8d67-4b4b-8cfc-273104619922
 * 
 * Ejecución: node scripts/create-special-discount.js [CODIGO]
 * 
 * Ejemplos:
 *   node scripts/create-special-discount.js PESO
 *   node scripts/create-special-discount.js OFERTA
 *   node scripts/create-special-discount.js TEST1
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ID fijo del código especial en la base de datos
const SPECIAL_DISCOUNT_ID = 'a56b5821-8d67-4b4b-8cfc-273104619922';

async function main() {
  // Obtener el código de los argumentos o usar 'PESO' por defecto
  const code = process.argv[2] || 'PESO';
  
  try {
    // Verificar si ya existe
    const existing = await prisma.$queryRaw`
      SELECT * FROM discount_codes WHERE id = ${SPECIAL_DISCOUNT_ID} LIMIT 1
    `;

    if (existing.length > 0) {
      // Actualizar código existente
      await prisma.$executeRaw`
        UPDATE discount_codes 
        SET 
          code = ${code.toUpperCase()},
          description = 'Deja el total del carrito en $1 ARS',
          is_active = true,
          updated_at = NOW()
        WHERE id = ${SPECIAL_DISCOUNT_ID}
      `;
      console.log(`✅ Código especial actualizado: "${code.toUpperCase()}"`);
    } else {
      // Crear nuevo con ID fijo
      await prisma.$executeRaw`
        INSERT INTO discount_codes (
          id, code, description, discount_percent, discount_amount,
          max_uses, used_count, min_purchase_amount, valid_from, valid_until,
          is_active, created_at, updated_at
        ) VALUES (
          ${SPECIAL_DISCOUNT_ID},
          ${code.toUpperCase()},
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
      console.log(`✅ Código especial creado: "${code.toUpperCase()}"`);
    }

    // Mostrar detalles
    const result = await prisma.$queryRaw`
      SELECT id, code, description, is_active, used_count, max_uses
      FROM discount_codes 
      WHERE id = ${SPECIAL_DISCOUNT_ID}
    `;
    
    console.log('\nDetalles del código especial:');
    console.table(result[0]);
    
    console.log('\n💡 Uso: Ingresa el código en el checkout para dejar el carrito en $1 ARS');
    console.log('📝 Puedes cambiar el código cuando quieras ejecutando este script de nuevo');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
