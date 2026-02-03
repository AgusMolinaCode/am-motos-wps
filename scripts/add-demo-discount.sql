-- Código DEMO con 98% de descuento
-- Ejecutar este script en tu base de datos PostgreSQL

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
    updated_at
)
VALUES (
    gen_random_uuid(),  -- Generar UUID automáticamente
    'DEMO', 
    'Código DEMO - 98% de descuento especial', 
    98, 
    1000,  -- Máximo 1000 usos
    0,     -- Contador inicial
    true,  -- Activo
    NOW(), -- Válido desde ahora
    NULL,  -- Sin fecha de expiración (NULL = no expira)
    NULL,  -- Sin monto mínimo (NULL = cualquier monto)
    NOW()
)
ON CONFLICT (code) DO UPDATE SET
    discount_percent = 98,
    description = 'Código DEMO - 98% de descuento especial',
    is_active = true,
    max_uses = 1000,
    updated_at = NOW();

-- Verificar que se insertó correctamente
SELECT * FROM discount_codes WHERE code = 'DEMO';
