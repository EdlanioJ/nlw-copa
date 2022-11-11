-- CreateTable
CREATE TABLE "pool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "owner_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pool_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "pool_id" TEXT NOT NULL,
    CONSTRAINT "participant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "participant_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pool" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,
    "avatar_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "first_team_country_code" TEXT NOT NULL,
    "second_team_country_code" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "guess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_team_point" INTEGER NOT NULL,
    "second_team_point" INTEGER NOT NULL,
    "participant_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "guess_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "guess_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "pool_code_key" ON "pool"("code");

-- CreateIndex
CREATE UNIQUE INDEX "participant_user_id_pool_id_key" ON "participant"("user_id", "pool_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_googleId_key" ON "user"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "guess_participant_id_game_id_key" ON "guess"("participant_id", "game_id");
