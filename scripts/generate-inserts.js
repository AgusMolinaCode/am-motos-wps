const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function escapeString(str) {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

function formatDate(date) {
  if (!date) return 'NULL';
  return "'" + new Date(date).toISOString() + "'";
}

function formatDecimal(value) {
  if (value === null || value === undefined) return 'NULL';
  return value;
}

async function generateDiscountCodesSQL() {
  const codes = await prisma.discountCode.findMany();
  
  console.log('-- DISCOUNT_CODES INSERTS');
  console.log('INSERT INTO "discount_codes" (id, code, description, discount_percent, discount_amount, max_uses, used_count, min_purchase_amount, valid_from, valid_until, is_active, created_at, updated_at) VALUES');
  
  const values = codes.map((c, i) => {
    const vals = [
      escapeString(c.id),
      escapeString(c.code),
      escapeString(c.description),
      c.discount_percent,
      formatDecimal(c.discount_amount),
      c.max_uses || 'NULL',
      c.used_count,
      formatDecimal(c.min_purchase_amount),
      formatDate(c.valid_from),
      formatDate(c.valid_until),
      c.is_active,
      formatDate(c.created_at),
      formatDate(c.updated_at)
    ];
    return `  (${vals.join(', ')})${i < codes.length - 1 ? ',' : ';'}`;
  });
  
  console.log(values.join('\n'));
  console.log('\n');
  return codes.length;
}

async function generateOrdersSQL() {
  const orders = await prisma.order.findMany();
  
  if (orders.length === 0) {
    console.log('-- No hay órdenes en la base local');
    return 0;
  }
  
  console.log('-- ORDERS INSERTS');
  console.log('INSERT INTO "orders" (id, clerk_user_id, payment_id, preference_id, external_ref, status, customer_first_name, customer_last_name, customer_email, customer_phone, customer_dni, shipping_address, shipping_city, shipping_province, shipping_zip_code, shipping_notes, items, subtotal, discount_code, discount_amount, total, metadata, created_at, updated_at) VALUES');
  
  const values = orders.map((o, i) => {
    const vals = [
      escapeString(o.id),
      escapeString(o.clerk_user_id),
      escapeString(o.payment_id),
      escapeString(o.preference_id),
      escapeString(o.external_ref),
      escapeString(o.status),
      escapeString(o.customer_first_name),
      escapeString(o.customer_last_name),
      escapeString(o.customer_email),
      escapeString(o.customer_phone),
      escapeString(o.customer_dni),
      escapeString(o.shipping_address),
      escapeString(o.shipping_city),
      escapeString(o.shipping_province),
      escapeString(o.shipping_zip_code),
      escapeString(o.shipping_notes),
      escapeString(JSON.stringify(o.items)),
      formatDecimal(o.subtotal),
      escapeString(o.discount_code),
      formatDecimal(o.discount_amount),
      formatDecimal(o.total),
      o.metadata ? escapeString(JSON.stringify(o.metadata)) : 'NULL',
      formatDate(o.created_at),
      formatDate(o.updated_at)
    ];
    return `  (${vals.join(', ')})${i < orders.length - 1 ? ',' : ';'}`;
  });
  
  console.log(values.join('\n'));
  console.log('\n');
  return orders.length;
}

async function main() {
  console.log('-- ===========================================');
  console.log('-- SQL para migrar datos de LOCAL a RAILWAY');
  console.log('-- Ejecutar en: https://railway.app/project/[tu-proyecto] -> Postgres -> Query');
  console.log('-- ===========================================\n');
  
  const codesCount = await generateDiscountCodesSQL();
  const ordersCount = await generateOrdersSQL();
  
  console.log(`-- Resumen: ${codesCount} códigos de descuento, ${ordersCount} órdenes`);
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
