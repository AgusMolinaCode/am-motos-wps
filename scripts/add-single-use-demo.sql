-- Insertar código DEMO de un solo uso (se desactiva después de usarlo)
INSERT INTO discount_codes (
    id,
    code,
    description,
    discount_percent,
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
    gen_random_uuid(),
    'DEMO',
    'Código DEMO - 98% de descuento (un solo uso)',
    98,
    1,        -- Solo 1 uso permitido
    0,        -- Contador empieza en 0
    true,     -- Activo
    NOW(),
    NULL,     -- No expira
    NULL,     -- Sin monto mínimo
    NOW(),
    NOW()
)
ON CONFLICT (code) DO UPDATE SET
    discount_percent = 98,
    max_uses = 1,
    used_count = 0,
    is_active = true,
    updated_at = NOW();

-- Verificar que se creó correctamente
SELECT code, description, discount_percent, max_uses, used_count, is_active 
FROM discount_codes 
WHERE code = 'DEMO';
