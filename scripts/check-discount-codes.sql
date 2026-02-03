-- Ver todos los códigos de descuento y su estado
SELECT 
    code,
    description,
    discount_percent,
    discount_amount,
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
ORDER BY created_at DESC;
