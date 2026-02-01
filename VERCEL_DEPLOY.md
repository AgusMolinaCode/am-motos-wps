# Deploy en Vercel - Guía Rápida

## ⚠️ Error Común: Prisma Client

Si ves este error:
```
PrismaClientInitializationError: Prisma has detected that this project was built on Vercel...
```

## ✅ Solución Aplicada

El `package.json` ahora incluye:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

Y el archivo `vercel.json`:
```json
{
  "buildCommand": "prisma generate && next build"
}
```

## 🚀 Pasos para Deployar en Vercel

### 1. Configurar Variables de Entorno en Vercel

Ve a **Vercel Dashboard → Tu Proyecto → Settings → Environment Variables** y agrega:

```
DATABASE_URL=postgresql://postgres:cKpwXfkCospqnCuQjWmGrXaZBQXbEiAY@switchback.proxy.rlwy.net:46457/railway

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3RpcnJpbmctZWFnbGUtMTAuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_wBUWyPbs1H9g8KOemfc14eYB9YC5QmqxCi7nrqpPH4

WPS_API_TOKEN=zNsW6dBeTgHS4qk0AEnbO86ibp5jrmPUYUJDNagE
PUBLIC_WPS=Bearer zNsW6dBeTgHS4qk0AEnbO86ibp5jrmPUYUJDNagE
PUBLIC_WPS_VEHICLE=Bearer zNsW6dBeTgHS4qk0AEnbO86ibp5jrmPUYUJDNagE

NEXT_PUBLIC_DOLAR_BLUE=1650
NEXT_PUBLIC_SHIPPING_RATE=30
NEXT_PUBLIC_RETAIL_MARKUP=1.25
NEXT_PUBLIC_WHOLESALE_MARKUP=1.10
NEXT_PUBLIC_CONSULT_MARKUP=1.50
NEXT_PUBLIC_HANDLING_USD=7

NEXT_PUBLIC_SUPABASE_URL=https://wflyglubrtkgfaixrzzw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmbHlnbHVicnRrZ2ZhaXhyenp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTk1NzcsImV4cCI6MjA2Nzc3NTU3N30.Yk3X2srBL2NFzYzXEnPWge6M5fDqfbyfPK2yZ4byrWg

MERCADOPAGO_ACCESS_TOKEN=APP_USR-2856796838524308-071220-a393d7c21bae06130536ff38b3eb975a-34687326
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-934ee029-e0d9-429d-a4c1-7cfc1db330d0
```

### 2. Configurar Build Settings

En **Vercel Dashboard → Build & Development Settings**:

- **Build Command**: `prisma generate && next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 3. Hacer Deploy

```bash
git add .
git commit -m "Fix: Prisma generate for Vercel deploy"
git push origin main
```

Vercel automáticamente hará el deploy.

---

## 🔧 Si el error persiste

### Opción 1: Reinstalar dependencias

```bash
rm -rf node_modules package-lock.json
npm install
```

### Opción 2: Verificar que prisma generate funciona localmente

```bash
npx prisma generate
npm run build
```

### Opción 3: Forzar rebuild en Vercel

1. Ve a Vercel Dashboard
2. Selecciona tu proyecto
3. Ve a "Deployments"
4. Click en los "..." del último deploy
5. Selecciona "Redeploy"

---

## ✅ Checklist antes de deployar

- [ ] Todas las variables de entorno configuradas en Vercel
- [ ] `package.json` tiene `"postinstall": "prisma generate"`
- [ ] Base de datos Railway accesible
- [ ] Build local funciona: `npm run build`

---

## 📚 Referencias

- [Prisma + Vercel Guide](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/vercel-caching-issue)
