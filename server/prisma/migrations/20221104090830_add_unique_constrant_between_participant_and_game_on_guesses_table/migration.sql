/*
  Warnings:

  - A unique constraint covering the columns `[participant_id,game_id]` on the table `guess` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "guess_participant_id_game_id_key" ON "guess"("participant_id", "game_id");
