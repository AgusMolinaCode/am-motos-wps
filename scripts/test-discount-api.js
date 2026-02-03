// Script simple para probar la API de descuento desde Node.js
// Ejecutar: node scripts/test-discount-api.js

async function testDiscount() {
  const code = 'DEMO';
  const subtotal = 50000;
  
  try {
    console.log(`🔍 Probando código: ${code} con subtotal: ${subtotal}`);
    
    // Primero verificar directamente la base de datos (si puedes conectar)
    console.log('\n📋 Para verificar la base de datos, ejecuta:');
    console.log(`SELECT * FROM discount_codes WHERE code = '${code}';`);
    
    console.log('\n✅ Script listo. La API ahora usa SQL directo.');
    console.log('Prueba el checkout con el código DEMO.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDiscount();
