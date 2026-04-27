-- CreateTable
CREATE TABLE "it_wing_volunteers" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "age" INTEGER,
    "phone" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "constituency" TEXT NOT NULL,
    "itKnowledge" BOOLEAN NOT NULL,
    "videoCreation" BOOLEAN NOT NULL,
    "imageCreation" BOOLEAN NOT NULL,
    "joinReason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "it_wing_volunteers_pkey" PRIMARY KEY ("id")
);
