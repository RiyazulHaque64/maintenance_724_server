import { Server } from "http";
import app from "./app";
import { seedSuperAdmin } from "./app/db";
import config from "./config";

const port = config.port || 9000;

let server: Server;

async function main() {
  try {
    await seedSuperAdmin();
    server = app.listen(port, () => {
      console.log(`Maintenance server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

// handle unhandledRejection
process.on("unhandledRejection", () => {
  console.log("Unhandled rejection is detected. shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// handle uncaught expception
process.on("uncaughtException", () => {
  console.log("Uncaught exception is detected. shutting down...");
  process.exit(1);
});

main();
