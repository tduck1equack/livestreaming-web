/*
  Warnings:

  - The values [GUEST] on the enum `Roles` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Roles_new" AS ENUM ('ADMIN', 'MODERATOR', 'USER', 'STREAMER');
ALTER TABLE "Role" ALTER COLUMN "name" TYPE "Roles_new" USING ("name"::text::"Roles_new");
ALTER TYPE "Roles" RENAME TO "Roles_old";
ALTER TYPE "Roles_new" RENAME TO "Roles";
DROP TYPE "Roles_old";
COMMIT;
