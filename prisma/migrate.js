const { execSync } = require("child_process");

async function migrate() {
  try {
    execSync("npx prisma generate", { stdio: "inherit" });

    execSync("npx prisma migrate dev --name schema_update", {
      stdio: "inherit",
    });

    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
