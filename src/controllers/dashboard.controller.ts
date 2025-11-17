import type { Context } from "hono";
import { prisma } from "../lib/prisma";

export const getInfo = async (c: Context) => {
  try {
    const { userId } = c.get("user");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalSessions = await prisma.session.findMany({
      where: {
        userId: userId,
        date: { equals: today },
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

    const allSessions = await prisma.session.findMany({
      where: {
        userId,
        endTime: { not: null }
      },
      select: { date: true },
      orderBy: { date: "desc" }
    });

    // Extract unique dates (YYYY-MM-DD)
    const uniqueDates = [...new Set(
      allSessions.map(s => s.date.toISOString().split("T")[0])
    )];

    let streak = 0;
    let expected = new Date();
    expected.setHours(0, 0, 0, 0); 

    for (let d of uniqueDates) {
      const sessionDate = new Date(d!);

      if (sessionDate.getTime() === expected.getTime()) {
        streak++;
        expected.setDate(expected.getDate() - 1); 
      } else {
        break;
      }
    }

    return c.json({
      error: false,
      msg: "User streak",
      streak
    });

  } catch (error) {
    console.error("Error while fetching streak:", error);
    return c.json({ error: true, msg: "Failed to fetch stats" }, 500);
  }
};

