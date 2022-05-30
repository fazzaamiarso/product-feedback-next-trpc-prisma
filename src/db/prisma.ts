// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

let db: PrismaClient;

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["query", "error", "warn"],
    });
  }
  db = global.prisma;
}

export default db;
