-- Verificar si existe el código DEMO y mostrar su estado
SELECT 
    code,
    description,
    discount_percent,
    max_uses,
    used_count,
    is_active,
    CASE 
        WHEN max_uses IS NOT NULL THEN max_uses - used_count
        ELSE NULL 
    END as uses_remaining,
    valid_from::date as valid_from,
    valid_until::date as valid_until
FROM discount_codes 
WHERE UPPER(code) = 'DEMO';

-- Si no existe, insertarlo (comenta las líneas anteriores y descomenta estas si quieres insertarlo)
-- INSERT INTO discount_codes (id, code, description, discount_percent, max_uses, used_count, is_active, valid_from, updated_at)
-- VALUES (gen_random_uuid(), 'DEMO', 'Demo 98% - Un solo uso', 98, 1, 0, true, NOW(), NOW());
