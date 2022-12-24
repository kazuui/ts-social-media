import { Prisma, PrismaClient } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      user: Prisma.UserCreateInput
    }
  }
}
