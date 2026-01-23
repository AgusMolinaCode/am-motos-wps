/*
  Warnings:

  - You are about to drop the column `calculated_prices` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `product_name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `vendor_number` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "calculated_prices",
DROP COLUMN "product_name",
DROP COLUMN "vendor_number",
ADD COLUMN     "length" DECIMAL(10,2),
ADD COLUMN     "propd1" TEXT,
ADD COLUMN     "propd2" TEXT;
