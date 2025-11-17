import type { Context } from "hono";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../services/constants";

const generateToken = ({
  userId,
}: {
  userId: string;
}) => {
  return jwt.sign(
    { userId },
    JWT_SECRET as string,
    { expiresIn: "7d" }
  );
};

export const register = async (c: Context) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json(
        { error: true, msg: "Please enter username and password" },
        400
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    //login
    if (existingUser) {
      const isMatch = await bcrypt.compare(password, existingUser.password);

      if (!isMatch) {
        return c.json(
          { error: true, msg: "Invalid credentials" },
          401
        );
      }

      const token = generateToken({
        userId: existingUser.id,
      });

      const { password: _, ...safeUser } = existingUser;

      return c.json({
        msg: "Login successful",
        error: false,
        token,
        user: safeUser,
      });
    }

    //sign-in
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    const token = generateToken({
      userId: newUser.id,
    });

    const { password: _, ...safeUser } = newUser;

    return c.json(
      {
        msg: "User created",
        error: false,
        token,
        user: safeUser,
      },
      201
    );
  } catch (error) {
    console.error("SignUp/Login Error:", error);
    return c.json(
      { error: true, msg: "Internal server error" },
      500
    );
  }
};

export const logout = async (c: Context) => {
    return c.json({
        msg: "Logout sucessful"
    })
}