-- Códigos de descuento de ejemplo
-- Ejecutar este script en tu base de datos para agregar códigos de descuento

-- Descuento del 10% para cualquier compra
INSERT INTO discount_codes (code, description, discount_percent, max_uses, is_active, valid_from, updated_at)
VALUES ('DESCUENTO10', '10% de descuento en tu compra', 10, 100, true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Descuento del 20% para compras mayores a $100,000
INSERT INTO discount_codes (code, description, discount_percent, min_purchase_amount, max_uses, is_active, valid_from, updated_at)
VALUES ('VIP20', '20% de descuento en compras mayores a $100,000', 20, 100000, 50, true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Descuento de $5,000 pesos fijos
INSERT INTO discount_codes (code, description, discount_amount, max_uses, is_active, valid_from, updated_at)
VALUES ('AHORRO5000', '$5,000 de descuento en tu compra', 5000, 25, true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Código de descuento de bienvenida (solo para nuevos clientes - 15%)
INSERT INTO discount_codes (code, description, discount_percent, max_uses, is_active, valid_from, updated_at)
VALUES ('BIENVENIDO15', '15% de descuento por ser nuevo cliente', 15, 200, true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Descuento especial de fin de semana (30%)
INSERT INTO discount_codes (code, description, discount_percent, max_uses, is_active, valid_from, valid_until, updated_at)
VALUES ('FINDE30', '30% de descuento especial de fin de semana', 30, 10, true, NOW(), NOW() + INTERVAL '7 days', NOW())
ON CONFLICT (code) DO NOTHING;

-- Descuento exclusivo mayorista (25% - requiere login)
INSERT INTO discount_codes (code, description, discount_percent, min_purchase_amount, max_uses, is_active, valid_from, updated_at)
VALUES ('MAYORISTA25', '25% de descuento para compras mayoristas', 25, 50000, 500, true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;
