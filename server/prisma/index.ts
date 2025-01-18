import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient({
  log: ["info", "warn", "error"],
});

export default prisma;
