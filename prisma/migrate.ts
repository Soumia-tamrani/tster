import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

async function migrate() {
  try {
    // Generate Prisma Client
    execSync("npx prisma generate", { stdio: "inherit" });

    // Create a migration
    execSync("npx prisma migrate dev --name schema_update", {
      stdio: "inherit",
    });

    // Push changes to database
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
