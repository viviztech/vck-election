/*
  Warnings:

  - The `forThalaivar` column on the `form_entries` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "form_entries" ADD COLUMN     "paymentMode" TEXT,
DROP COLUMN "forThalaivar",
ADD COLUMN     "forThalaivar" BOOLEAN NOT NULL DEFAULT false;
