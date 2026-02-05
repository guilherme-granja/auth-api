/*
  Warnings:

  - You are about to drop the column `token` on the `OAuthAccessToken` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `OAuthRefreshToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jti]` on the table `OAuthAccessToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jti]` on the table `OAuthRefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jti` to the `OAuthAccessToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jti` to the `OAuthRefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "OAuthAccessToken_token_idx";

-- DropIndex
DROP INDEX "OAuthAccessToken_token_key";

-- DropIndex
DROP INDEX "OAuthRefreshToken_token_idx";

-- DropIndex
DROP INDEX "OAuthRefreshToken_token_key";

-- AlterTable
ALTER TABLE "OAuthAccessToken" DROP COLUMN "token",
ADD COLUMN     "jti" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OAuthRefreshToken" DROP COLUMN "token",
ADD COLUMN     "jti" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OAuthAccessToken_jti_key" ON "OAuthAccessToken"("jti");

-- CreateIndex
CREATE INDEX "OAuthAccessToken_jti_idx" ON "OAuthAccessToken"("jti");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthRefreshToken_jti_key" ON "OAuthRefreshToken"("jti");

-- CreateIndex
CREATE INDEX "OAuthRefreshToken_jti_idx" ON "OAuthRefreshToken"("jti");
