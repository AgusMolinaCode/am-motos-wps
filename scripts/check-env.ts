#!/usr/bin/env ts-node
/**
 * Script para verificar el entorno actual (Local vs Producción)
 * 
 * Uso: npx ts-node scripts/check-env.ts
 */

import { PrismaClient } from '@prisma/client';

async function checkEnvironment() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║          VERIFICACIÓN DE ENTORNO                       ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const dbUrl = process.env.DATABASE_URL || 'No configurada';
  const maskedUrl = dbUrl.replace(/:.*@/, ':***@');
  
  console.log('📋 DATABASE_URL actual:');
  console.log(`   ${maskedUrl}\n`);

  // Detectar entorno
  let environment: 'LOCAL' | 'RAILWAY' | 'UNKNOWN' = 'UNKNOWN';
  
  if (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
    environment = 'LOCAL';
  } else if (dbUrl.includes('railway') || dbUrl.includes('rlwy.net')) {
    environment = 'RAILWAY';
  }

  console.log('🎯 Entorno detectado:');
  if (environment === 'LOCAL') {
    console.log('   🏠 LOCAL (Docker - Desarrollo)');
    console.log('   URL: localhost:3000');
  } else if (environment === 'RAILWAY') {
    console.log('   ☁️  RAILWAY (Producción)');
    console.log('   URL: railway.app');
  } else {
    console.log('   ❓ Entorno desconocido');
  }
  console.log();

  // Verificar conexión
  const prisma = new PrismaClient();

  try {
    console.log('🔗 Probando conexión...\n');
    
    const brands = await prisma.brand.count();
    const products = await prisma.product.count();
    const total = brands + products + 
                  await prisma.vehicleMake.count() + 
                  await prisma.vehicleModel.count() + 
                  await prisma.vehicleYear.count() + 
                  await prisma.vehicle.count();

    console.log('📊 Datos disponibles:');
    console.log(`   • Brands:   ${brands.toLocaleString()}`);
    console.log(`   • Products: ${products.toLocaleString()}`);
    console.log(`   • Total:    ${total.toLocaleString()}`);
    console.log();

    console.log('╔════════════════════════════════════════════════════════╗');
    if (environment === 'LOCAL') {
      console.log('║  ✅ Conectado a DOCKER LOCAL (Desarrollo)              ║');
    } else if (environment === 'RAILWAY') {
      console.log('║  ✅ Conectado a RAILWAY (Producción)                   ║');
    }
    console.log('╚════════════════════════════════════════════════════════╝\n');

  } catch (error: any) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n💡 Posibles causas:');
    if (environment === 'LOCAL') {
      console.log('   • Docker no está corriendo');
      console.log('   • La base de datos local no existe');
      console.log('   • Ejecuta: docker-compose up -d');
    } else {
      console.log('   • Problemas de conexión a Railway');
      console.log('   • Verifica tu conexión a internet');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkEnvironment();
