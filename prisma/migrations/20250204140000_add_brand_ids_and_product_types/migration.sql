-- AlterTable
ALTER TABLE "orders" ADD COLUMN "brand_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- AlterTable
ALTER TABLE "orders" ADD COLUMN "product_types" TEXT[] DEFAULT ARRAY[]::TEXT[];
