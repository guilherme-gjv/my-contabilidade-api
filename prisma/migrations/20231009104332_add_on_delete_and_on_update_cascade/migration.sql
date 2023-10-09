-- DropForeignKey
ALTER TABLE "invoice" DROP CONSTRAINT "invoice_user_id_fkey";

-- DropForeignKey
ALTER TABLE "invoice_item" DROP CONSTRAINT "invoice_item_invoice_id_fkey";

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_item" ADD CONSTRAINT "invoice_item_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
