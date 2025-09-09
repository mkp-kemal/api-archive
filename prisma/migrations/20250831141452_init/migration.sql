-- CreateEnum
CREATE TYPE "public"."RoleUser" AS ENUM ('ADMIN', 'BUYER', 'VISITOR');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."RoleUser" NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "isBanned" BOOLEAN NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
