# ✅ Plan Configurado: Local vs Producción

## 🎯 Configuración Actual

| Entorno | Database URL | Estado |
|---------|--------------|--------|
| **Local (Dev)** | `localhost:5432` (Docker) | ✅ Configurado |
| **Producción** | Railway Dashboard | ✅ Listo para deploy |

---

## 📁 Archivos Configurados

### `.env` - Desarrollo Local
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/am_motos?schema=public"
```

### `.env.local` - Desarrollo Local
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/am_motos?schema=public"
```

### `.env.production` - Referencia
Archivo de referencia con las variables que debes configurar en Railway Dashboard.

---

## 🚀 Cómo usar cada entorno

### Desarrollo Local (localhost:3000)

```bash
# 1. Iniciar Docker (si no está corriendo)
docker-compose up -d

# 2. Verificar que funciona
npx ts-node scripts/check-env.ts

# 3. Iniciar desarrollo
npm run dev

# 4. Abrir en navegador
http://localhost:3000
```

### Producción (Railway)

Las variables de entorno se configuran en:
**Railway Dashboard → Tu Proyecto → Variables**

Variables necesarias en Railway:
```
DATABASE_URL=postgresql://postgres:PASSWORD@switchback.proxy.rlwy.net:46457/railway
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
WPS_API_TOKEN=zNsW6dBeTgHS4qk0AEnbO86ibp5jrmPUYUJDNagE
PUBLIC_WPS=Bearer zNsW6dBeTgHS4qk0AEnbO86ibp5jrmPUYUJDNagE
...
```

---

## 🧹 Scripts Disponibles

```bash
# Verificar entorno actual
npx ts-node scripts/check-env.ts

# Sincronizar datos con WPS
npx ts-node scripts/sync-wps.ts
npx ts-node scripts/sync-brands.ts
npx ts-node scripts/vehicle/sync-vehicles.ts
```

---

## ✅ Checklist para trabajar

### En LOCAL (Desarrollo)
- [ ] Docker corriendo: `docker ps`
- [ ] Base de datos local disponible
- [ ] `.env` apunta a `localhost:5432`
- [ ] Ejecutar: `npm run dev`

### En PRODUCCIÓN (Railway)
- [ ] Variables configuradas en Railway Dashboard
- [ ] Datos migrados a Railway (✅ YA ESTÁN)
- [ ] Deploy automático desde git push

---

## 📝 Notas Importantes

1. **Nunca subas `.env` a Git** - Contiene credenciales de desarrollo
2. **Railway ignora `.env`** - Usa las variables del dashboard
3. **Prisma genera el cliente según DATABASE_URL** - Regenerar si cambias de entorno: `npx prisma generate`
4. **Los datos están en ambos lados** - 169,128 registros en Railway para producción

---

## 🎉 Resumen

Tu proyecto ahora está configurado para:
- **Desarrollo**: Usar Docker local automáticamente
- **Producción**: Usar Railway cuando deployes

¡Todo listo para trabajar! 🚀
