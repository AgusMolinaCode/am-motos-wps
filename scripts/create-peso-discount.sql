-- Código de descuento especial: deja el carrito en $1 ARS
-- Ejemplo: Carrito de $1000 → Descuento de $999 → Total $1

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
  gen_random_uuid(),
  'PESO',
  'Deja el total del carrito en $1 ARS',
  0,                    -- discount_percent (no se usa para este tipo)
  NULL,                 -- discount_amount (se calcula dinámicamente)
  NULL,                 -- max_uses (ilimitado)
  0,                    -- used_count
  NULL,                 -- min_purchase_amount (sin mínimo)
  NOW(),                -- valid_from (activo desde ahora)
  NULL,                 -- valid_until (no expira)
  true,                 -- is_active
  NOW(),                -- created_at
  NOW()                 -- updated_at
)
ON CONFLICT (code) DO UPDATE SET
  description = 'Deja el total del carrito en $1 ARS',
  is_active = true,
  updated_at = NOW();

-- Verificar que se creó correctamente
SELECT * FROM discount_codes WHERE UPPER(code) = 'PESO';
