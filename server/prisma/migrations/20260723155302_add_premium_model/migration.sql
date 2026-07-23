-- CreateTable
CREATE TABLE "Premium" (
    "id" SERIAL NOT NULL,
    "policyId" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentStatus" TEXT NOT NULL,

    CONSTRAINT "Premium_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Premium" ADD CONSTRAINT "Premium_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
