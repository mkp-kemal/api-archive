-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "role" SET DEFAULT 'VISITOR',
ALTER COLUMN "isVerified" SET DEFAULT false,
ALTER COLUMN "isBanned" SET DEFAULT false;
