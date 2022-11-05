/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `poll` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "poll_code_key" ON "poll"("code");
