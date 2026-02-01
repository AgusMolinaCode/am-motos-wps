# Plan de Configuración: Desarrollo Local vs Producción

## 🎯 Objetivo
- **Local (localhost:3000)**: Usar PostgreSQL en Docker
- **Producción (Railway)**: Usar PostgreSQL en Railway

---

## 1️⃣ Configuración de Archivos de Entorno

### Para DESARROLLO LOCAL (tu máquina)

Edita el archivo `.env`:

```env
# ============================================
# DESARROLLO LOCAL - Docker PostgreSQL
# ============================================
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/am_motos?schema=public"

# WPS API Token (sin el "Bearer ")
WPS_API_TOKEN=zNsW6dBeTgHS4qk0AEnbO86ibp5jrmPUYUJDNagE

# Clerk Auth (modo desarrollo)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3RpcnJpbmctZWFnbGUtMTAuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_wBUWyPbs1H9g8KOemfc14eYB9YC5QmqxCi7nrqpPH4

# Configuración de precios
NEXT_PUBLIC_DOLAR_BLUE=1650
NEXT_PUBLIC_SHIPPING_RATE=30
NEXT_PUBLIC_RETAIL_MARKUP=1.25
NEXT_PUBLIC_WHOLESALE_MARKUP=1.10
NEXT_PUBLIC_CONSULT_MARKUP=1.50
NEXT_PUBLIC_HANDLING_USD=7
```

### Para PRODUCCIÓN (Railway)

**NO edites el archivo `.env` para producción.** 

En Railway Dashboard, configura estas Variables de Entorno:

```
DATABASE_URL=postgresql://postgres:cKpwXfkCospqnCuQjWmGrXaZBQXbEiAY@switchback.proxy.rlwy.net:46457/railway

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3RpcnJpbmctZWFnbGUtMTAuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_wBUWyPbs1H9g8KOemfc14eYB9YC5QmqxCi7nrqpPH4

WPS_API_TOKEN=zNsW6dBeTgHS4qk0AEnbO86ibp5jrmPUYUJDNagE
PUBLIC_WPS=Bearer zNsW6dBeTgHS4qk0AEnbO86ibp5jrmPUYUJDNagE

NEXT_PUBLIC_DOLAR_BLUE=1650
NEXT_PUBLIC_SHIPPING_RATE=30
NEXT_PUBLIC_RETAIL_MARKUP=1.25
NEXT_PUBLIC_WHOLESALE_MARKUP=1.10
NEXT_PUBLIC_CONSULT_MARKUP=1.50
NEXT_PUBLIC_HANDLING_USD=7
```

---

## 2️⃣ Cómo funciona Next.js con Variables de Entorno

Next.js carga variables en este orden de prioridad:
1. **`.env.local`** - No se sube a git (local only)
2. **`.env`** - Variables por defecto
3. **Variables del sistema** - Railway las inyecta en producción

**Regla importante**: Railway reemplaza las variables automáticamente.

---

## 3️⃣ Scripts de Utilidad

### Verificar qué base de datos estás usando

```bash
npm run db:check
```

### Para desarrollo local (Docker)

1. Asegúrate de que Docker esté corriendo:
```bash
docker ps
```

2. Si no está corriendo, inícialo:
```bash
docker-compose up -d
```

3. Corre la aplicación en modo desarrollo:
```bash
npm run dev
```

La app usará automáticamente `localhost:5432` (Docker)

---

## 4️⃣ Resumen de URLs según entorno

| Entorno | URL de la App | Base de Datos | URL Database |
|---------|--------------|---------------|--------------|
| Desarrollo | localhost:3000 | Docker Local | postgres:postgres@localhost:5432 |
| Producción | railway.app | Railway Cloud | switchback.proxy.rlwy.net:46457 |

---

## 5️⃣ Checklist antes de deployar a Railway

- [ ] Datos migrados a Railway ✅ (YA ESTÁ)
- [ ] Variables configuradas en Railway Dashboard
- [ ] Build exitoso local: `npm run build`
- [ ] Prisma generate ejecutado

---

## 6️⃣ Comandos útiles

```bash
# Verificar conexión a la base de datos actual
npx prisma studio

# Generar cliente de Prisma después de cambios
npx prisma generate

# Sincronizar schema (solo desarrollo)
npx prisma db push

# Build para producción
npm run build
```

---

## ⚠️ IMPORTANTE

**NUNCA** subas el archivo `.env` con credenciales de producción a Git. 

El archivo `.env` debe contener solo configuración de desarrollo.

Railway usa sus propias variables que configuras en el dashboard.
