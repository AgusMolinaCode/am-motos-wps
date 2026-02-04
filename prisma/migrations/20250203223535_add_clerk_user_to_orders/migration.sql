-- AlterTable
ALTER TABLE "orders" ADD COLUMN "clerk_user_id" TEXT;

-- CreateIndex
CREATE INDEX "orders_clerk_user_id_idx" ON "orders"("clerk_user_id");
