import "dotenv/config";
import { prisma } from "./src/lib/prisma.js";

async function main() {
  console.log("Checking connection for POSTGRES_URL:", process.env.POSTGRES_URL ? "Defined" : "Undefined");
  try {
    const user = await prisma.user.findFirst();
    console.log("Success! Found/Not found:", user);
  } catch (e: any) {
    console.error("Failed with error:", e.message || e);
    if (e.code) console.error("Error Code:", e.code);
  } finally {
    process.exit(0);
  }
}

main();
