import "dotenv/config";
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const { Pool } = pg;
const rawConnectionString = process.env.DATABASE_URL;
const connectionString = rawConnectionString?.replace("sslmode=require", "sslmode=no-verify");

if (!connectionString) {
  console.warn("WARNING [PRISMA_INIT]: DATABASE_URL is not defined.");
} else {
  console.log("LOG [PRISMA_INIT]: Initializing prisma with direct DATABASE_URL.");
  console.log("LOG [PRISMA_INIT]: NODE_TLS_REJECT_UNAUTHORIZED =", process.env.NODE_TLS_REJECT_UNAUTHORIZED);
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

export { prisma };
