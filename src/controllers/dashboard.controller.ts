import type { Context } from "hono";
import { prisma } from "../lib/prisma";

export const getInfo = async (c: Context) => {
  try {
    const { userId } = c.get("user");
    const todayStr = new Date().toISOString().split("T")[0];
    //@ts-ignore
    const today = new Date(todayStr);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalSessions = await prisma.session.findMany({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
        endTime: { not: null },
      },
    });

    if (totalSessions.length === 0) {
      return c.json({
        error: false,
        msg: "No sessions today",
        totalMinutes: 0,
        averageTime: 0,
        longestSession: 0,
      });
    }

    const totalMinutes = totalSessions.reduce((sum, session) => {
      const durationMs =
        new Date(session.endTime!).getTime() -
        new Date(session.startTime).getTime();

      const durationMinutes = durationMs / 60000;

      return sum + durationMinutes;
    }, 0);

    const averageTime = totalMinutes / totalSessions.length;

    const longestSession = totalSessions.reduce((longest, session) => {
      const durationMs =
        new Date(session.endTime!).getTime() -
        new Date(session.startTime).getTime();

      return Math.max(longest, durationMs / 60000);
    }, 0);

    return c.json({
      error: false,
      msg: "Daily Activity",
      totalMinutes,
      averageTime,
      longestSession,
    });
  } catch (error) {
    console.error("Error while fetching info:", error);
    return c.json({ error: true, msg: "Failed to fetch stats" }, 500);
  }
};

export const getStreak = async (c: Context) => {
  try {
    const { userId } = c.get("user");

    const sessions = await prisma.session.findMany({
      where: { userId, endTime: { not: null } },
      select: { date: true },
      orderBy: { date: "desc" },
    });

    const unique = [
      ...new Set(sessions.map((s) => s.date.toISOString().split("T")[0])),
    ];

    let streak = 0;

    // Start at today's YYYY-MM-DD (local)
    let expected = new Date().toLocaleDateString("en-CA");

    for (const d of unique) {
      if (d === expected) {
        streak++;

        // Move expected to previous day
        const temp = new Date(expected);
        temp.setDate(temp.getDate() - 1);
        expected = temp.toISOString().split("T")[0]!;
      } else {
        break;
      }
    }

    return c.json({
      error: false,
      msg: "User streak",
      streak,
    });
  } catch (err) {
    console.error(err);
    return c.json({ error: true, msg: "Failed to fetch stats" }, 500);
  }
};
