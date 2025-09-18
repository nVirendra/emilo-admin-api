
import cron from "node-cron";

// Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log(" Running stale session cleanup...");
});
