-- Resetear/Reactivar un código de descuento (ej: DEMO)
-- Esto pone used_count en 0 y is_active en true

UPDATE discount_codes
SET 
    used_count = 0,
    is_active = true,
    updated_at = NOW()
WHERE code = 'DEMO';

-- Verificar el cambio
SELECT 
    code, 
    discount_percent, 
    max_uses, 
    used_count, 
    is_active 
FROM discount_codes 
WHERE code = 'DEMO';
