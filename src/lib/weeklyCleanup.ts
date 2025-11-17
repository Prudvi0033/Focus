import { schedule } from "node-cron";
import { prisma } from "./prisma";

schedule("0 0 * * 0", async () => {
  console.log("Clearing sessions older than this week...");

  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  await prisma.session.deleteMany({
    where: {
      date: { lt: monday }
    }
  });

  console.log("Old sessions deleted.");
});
