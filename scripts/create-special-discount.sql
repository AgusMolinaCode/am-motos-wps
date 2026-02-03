-- Código de descuento especial que deja el carrito en $1 ARS
-- ID fijo: a56b5821-8d67-4b4b-8cfc-273104619922
-- 
-- INSTRUCCIONES:
-- 1. Cambia 'PESO' por el código que quieras usar (línea 24)
-- 2. Ejecuta este script en tu base de datos
-- 3. Listo! Puedes cambiar el código cuantas veces quieras sin hacer deploy

INSERT INTO discount_codes (
  id,
  code,
  description,
  discount_percent,
  discount_amount,
  max_uses,
  used_count,
  min_purchase_amount,
  valid_from,
  valid_until,
  is_active,
  created_at,
  updated_at
) VALUES (
  'a56b5821-8d67-4b4b-8cfc-273104619922',  -- ID fijo (NO CAMBIAR)
  'PESO',                                    -- 👈 CAMBIA ESTO por tu código preferido
  'Deja el total del carrito en $1 ARS',
  0,                    -- discount_percent (no se usa para este tipo)
  NULL,                 -- discount_amount (se calcula dinámicamente: total - 1)
  NULL,                 -- max_uses (NULL = ilimitado)
  0,                    -- used_count
  NULL,                 -- min_purchase_amount (sin mínimo)
  NOW(),                -- valid_from
  NULL,                 -- valid_until (NULL = no expira)
  true,                 -- is_active
  NOW(),                -- created_at
  NOW()                 -- updated_at
)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  description = EXCLUDED.description,
  discount_percent = 0,
  discount_amount = NULL,
  max_uses = NULL,
  min_purchase_amount = NULL,
  valid_until = NULL,
  is_active = true,
  updated_at = NOW();

-- Verificar que se creó/actualizó correctamente
SELECT 
  id,
  code,
  description,
  is_active,
  used_count,
  max_uses,
  valid_from,
  valid_until
FROM discount_codes 
WHERE id = 'a56b5821-8d67-4b4b-8cfc-273104619922';
