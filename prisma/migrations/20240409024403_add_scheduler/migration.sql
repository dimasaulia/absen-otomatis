-- AlterTable
ALTER TABLE "User" ADD COLUMN     "eofficePassword" TEXT,
ADD COLUMN     "eofficeUsername" TEXT;

-- CreateTable
CREATE TABLE "Scheduler" (
    "scheduler_id" SERIAL NOT NULL,
    "task_id" TEXT NOT NULL,
    "task_time" TIMESTAMP(3) NOT NULL,
    "task_data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Scheduler_pkey" PRIMARY KEY ("scheduler_id")
);

-- AddForeignKey
ALTER TABLE "Scheduler" ADD CONSTRAINT "Scheduler_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
