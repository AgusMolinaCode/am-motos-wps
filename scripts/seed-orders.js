const { PrismaClient } = require('@prisma/client');

// Conectar a Railway (producción)
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Insertando órdenes en Railway...\n');

  const orders = [
    {
      id: '35eb1484-5cb1-4a02-aad0-c511fe0fa3db',
      clerk_user_id: 'user_38dwkHuv9Xnpm9ZameVgePAvLBU',
      payment_id: '144728647320',
      preference_id: null,
      external_ref: 'order_1770176791322_4rdsikr',
      status: 'approved',
      customer_first_name: 'Agustin',
      customer_last_name: 'Molina',
      customer_email: 'am.motos1990@gmail.com',
      customer_phone: '1161607732',
      customer_dni: '35118153',
      shipping_address: 'alisna 112',
      shipping_city: 'pilar',
      shipping_province: 'bsas',
      shipping_zip_code: '1629',
      shipping_notes: 'tocar timpre',
      items: [
        {
          id: '723623',
          sku: '2010020-2780-12',
          name: 'TECH 10 WHT/VIOLET/NVY BL/PNK FL 12',
          quantity: 1,
          unit_price: 1393440.45,
        },
      ],
      subtotal: 1393440.45,
      discount_code: 'PESO',
      discount_amount: 1393439.45,
      total: 1.0,
      metadata: {
        mp_installments: 1,
        mp_payment_type_id: 'account_money',
        mp_processing_mode: 'aggregator',
        mp_merchant_order_id: '37852885023',
        mp_payment_method_id: 'account_money',
      },
      created_at: new Date('2026-02-04 03:46:42.59'),
      updated_at: new Date('2026-02-04 03:46:42.59'),
    },
    {
      id: 'f16141e8-5fba-4bc0-99f4-7721593a3516',
      clerk_user_id: 'user_38dwkHuv9Xnpm9ZameVgePAvLBU',
      payment_id: '144732562800',
      preference_id: null,
      external_ref: 'order_1770180699755_xd51hdb',
      status: 'approved',
      customer_first_name: 'Agustin',
      customer_last_name: 'Molina',
      customer_email: 'am.motos1990@gmail.com',
      customer_phone: '1161607732',
      customer_dni: '35118153',
      shipping_address: 'alisna 112',
      shipping_city: 'pilar',
      shipping_province: 'bsas',
      shipping_zip_code: '1629',
      shipping_notes: 'tocar timpre',
      items: [
        {
          id: '723713',
          sku: '6500226-12-L',
          name: 'BIONIC PLASMA LT PROTEC JKT LS BLACK/WHITE LG',
          quantity: 1,
          unit_price: 483576.85,
        },
        {
          id: '738718',
          sku: '50-1269-K',
          name: 'REAR IND. KNUCKLE SIDE KIT CAN-AM',
          quantity: 1,
          unit_price: 140631.24,
        },
        {
          id: '733382',
          sku: '1025-81003-6713-O/S',
          name: 'CORP TRUCKER GREEN CAMO/ BLACK',
          quantity: 2,
          unit_price: 49131.24,
        },
      ],
      subtotal: 722470.57,
      discount_code: 'DEMO',
      discount_amount: 708021.17,
      total: 14449.4,
      metadata: {
        mp_installments: 1,
        mp_payment_type_id: 'account_money',
        mp_processing_mode: 'aggregator',
        mp_merchant_order_id: '37879610552',
        mp_payment_method_id: 'account_money',
      },
      created_at: new Date('2026-02-04 04:51:49.782'),
      updated_at: new Date('2026-02-04 04:51:49.782'),
    },
  ];

  for (const order of orders) {
    try {
      await prisma.order.create({ data: order });
      console.log(`✅ Orden #${order.payment_id} creada`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`⏩ Orden #${order.payment_id} ya existe, saltando`);
      } else {
        console.error(`❌ Error con orden #${order.payment_id}:`, error.message);
      }
    }
  }

  console.log('\n✨ Listo!');
  console.log('📊 Total órdenes en Railway:', await prisma.order.count());
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
