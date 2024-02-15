import { PrismaClient } from "@prisma/client"

declare global {
  // ESLint doesn't understand this TypeScript-specific syntax, so it's incorrectly flagging it as an error.
  // Disable the no-var rule for this line with an ESLint comment:
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === "development") global.prisma = prisma

export default prisma
