import { NODE_ENV } from "../../services/constants";
import { PrismaClient } from "../generated/prisma";

const globalForPrisma = globalThis as unknown as {
    primsa: PrismaClient | undefined
}

export const prisma = globalForPrisma.primsa ?? new PrismaClient()

if(NODE_ENV !== 'production'){
    globalForPrisma.primsa = prisma
}