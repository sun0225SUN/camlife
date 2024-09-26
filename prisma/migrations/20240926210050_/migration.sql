-- CreateTable
CREATE TABLE "photos" (
    "uuid" VARCHAR(21) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "blurData" TEXT,
    "model" VARCHAR(255),
    "focalLengthIn35mmFormat" SMALLINT,
    "lensModel" VARCHAR(255),
    "fNumber" REAL,
    "iso" SMALLINT,
    "exposureTime" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "takenAtNaive" VARCHAR(255) NOT NULL,
    "hidden" BOOLEAN DEFAULT false,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("uuid")
);
