import type { Context } from "hono";
import { prisma } from "../lib/prisma";

export const weeklyReport = async (c: Context) => {
  try {
    const { userId } = c.get("user");
    const today = new Date();
    const dayOfTheWeek = today.getDay();

    const monday = new Date(today);
    const diff = dayOfTheWeek === 0 ? -6 : 1 - dayOfTheWeek;
    monday.setDate(monday.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    const nextMonday = new Date(monday);
    nextMonday.setDate(nextMonday.getDate() + 7);
    nextMonday.setHours(0, 0, 0, 0);

    const sessions = await prisma.session.findMany({
      where: {
        userId: userId,
        date: {
          gte: monday,
          lt: nextMonday,
        },
        endTime: { not: null },
      },
    });

    const weeklyStats: Record<string, number> = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    };

    sessions.forEach((s) => {
      const day = new Date(s.date).getDay(); // 0-6
      const key = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ][day];

      const durationMs =
        new Date(s.endTime!).getTime() - new Date(s.startTime).getTime();

      //@ts-ignore
      weeklyStats[key] += durationMs / 60000;
    });

    return c.json({
      error: false,
      msg: "Weekly Report",
      monday: monday,
      nextMonday: nextMonday,
      stats: weeklyStats,
    });
  } catch (error) {
    console.log(error);
    return c.json({ error: true, message: "Server error" }, 500);
  }
};
