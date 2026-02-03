-- Insertar un nuevo código de descuento en la base de datos
-- Ejemplo: Código de un solo uso (max_uses = 1)

INSERT INTO discount_codes (
    id,
    code,
    description,
    discount_percent,
    discount_amount,
    max_uses,
    used_count,
    is_active,
    valid_from,
    valid_until,
    min_purchase_amount,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),           -- ID único
    'TUCODIGO',                  -- Código (ej: DEMO, PROMO50, etc.)
    'Descripción del descuento', -- Descripción opcional
    20,                          -- Porcentaje de descuento (0 si usas monto fijo)
    NULL,                        -- Monto fijo de descuento (NULL si usas porcentaje)
    1,                           -- Máximo de usos (1 = un solo uso, NULL = ilimitado)
    0,                           -- Contador inicial (siempre 0)
    true,                        -- Activo (true/false)
    NOW(),                       -- Válido desde ahora
    NULL,                        -- Fecha de expiración (NULL = no expira)
    NULL,                        -- Monto mínimo de compra (NULL = sin mínimo)
    NOW(),                       -- Fecha de creación
    NOW()                        -- Fecha de actualización
);

-- Ejemplos:

-- Código DEMO de un solo uso con 98% de descuento:
-- INSERT INTO discount_codes (id, code, description, discount_percent, max_uses, used_count, is_active, valid_from, updated_at)
-- VALUES (gen_random_uuid(), 'DEMO', 'Demo 98% off', 98, 1, 0, true, NOW(), NOW());

-- Código 20% de descuento, válido 10 veces:
-- INSERT INTO discount_codes (id, code, description, discount_percent, max_uses, used_count, is_active, valid_from, updated_at)
-- VALUES (gen_random_uuid(), 'PROMO20', '20% de descuento', 20, 10, 0, true, NOW(), NOW());

-- Código $5000 de descuento fijo, un solo uso:
-- INSERT INTO discount_codes (id, code, description, discount_amount, max_uses, used_count, is_active, valid_from, updated_at)
-- VALUES (gen_random_uuid(), 'REGALO5000', '$5000 de descuento', 5000, 1, 0, true, NOW(), NOW());
