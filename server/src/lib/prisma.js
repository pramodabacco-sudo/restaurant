// ==============================================
// server/src/lib/prisma.js
// Single shared PrismaClient instance (avoids exhausting DB connections
// from hot-reload / multiple imports during development).
// ==============================================

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
