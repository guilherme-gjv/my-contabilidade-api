/*
  Warnings:

  - You are about to drop the column `enterprise_cpnj` on the `invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invoice" DROP COLUMN "enterprise_cpnj",
ADD COLUMN     "enterprise_cnpj" TEXT;
