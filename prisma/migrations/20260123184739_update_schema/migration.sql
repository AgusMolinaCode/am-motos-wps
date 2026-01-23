/*
  Warnings:

  - You are about to drop the column `brand` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Product_brand_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "brand",
DROP COLUMN "price",
ADD COLUMN     "attributevalues" JSONB,
ADD COLUMN     "brand_id" INTEGER,
ADD COLUMN     "calculated_prices" JSONB,
ADD COLUMN     "dealer_price" DECIMAL(10,2),
ADD COLUMN     "drop_ship_eligible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "height" DECIMAL(10,2),
ADD COLUMN     "list_price" DECIMAL(10,2),
ADD COLUMN     "published_at" TIMESTAMP(3),
ADD COLUMN     "status" TEXT,
ADD COLUMN     "supplier_product_id" TEXT,
ADD COLUMN     "upc" TEXT,
ADD COLUMN     "weight" DECIMAL(10,2),
ADD COLUMN     "width" DECIMAL(10,2),
ALTER COLUMN "product_type" DROP NOT NULL,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "created_at" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Product_brand_id_idx" ON "Product"("brand_id");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");
