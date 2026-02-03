-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "preference_id" TEXT,
    "external_ref" TEXT,
    "status" TEXT NOT NULL DEFAULT 'approved',
    "customer_first_name" TEXT NOT NULL,
    "customer_last_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "customer_dni" TEXT NOT NULL,
    "shipping_address" TEXT NOT NULL,
    "shipping_city" TEXT NOT NULL,
    "shipping_province" TEXT NOT NULL,
    "shipping_zip_code" TEXT NOT NULL,
    "shipping_notes" TEXT,
    "items" JSONB NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "discount_code" TEXT,
    "discount_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_payment_id_key" ON "orders"("payment_id");

-- CreateIndex
CREATE INDEX "orders_customer_email_idx" ON "orders"("customer_email");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_created_at_idx" ON "orders"("created_at");
