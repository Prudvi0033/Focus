import type { Context } from "hono";
import { prisma } from "../lib/prisma";

export const createSession = async (c: Context) => {
  try {
    const { userId } = c.get("user");
    const { duration } = await c.req.json(); // duration in HOURS

    if (!duration) {
      return c.json({
        error: true,
        msg: "Please specify the duration",
      });
    }

    const startTime = new Date();
    const durationMs = duration * 60 * 60 * 1000; // hrs → ms
    const endTime = new Date(startTime.getTime() + durationMs);

    await prisma.session.create({
      data: {
        userId,
        startTime,
        duration,
        endTime,
      },
    });

    return c.json({
      error: false,
      msg: "Session Created",
      startTime,
      endTime,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return c.json({ error: true, msg: "Failed to create session" }, 500);
  }
};

export const endSession = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const { userId } = c.get("user");

    const session = await prisma.session.findUnique({
      where: { id }
    });

    if (!session) {
      return c.json({
        error: true,
        msg: "Session not found"
      });
    }

    if (session.userId !== userId) {
      return c.json({
        error: true,
        msg: "Unauthorized"
      }, 403);
    }

    const now = new Date();

    await prisma.session.update({
      where: { id },
      data: {
        endTime: now
      }
    });

    return c.json({
      error: false,
      msg: "Session ended",
      endedAt: now
    });

  } catch (error) {
    console.error(error);
    return c.json({ error: true, msg: "Failed to end session" }, 500);
  }
};
