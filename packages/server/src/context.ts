import { PrismaClient } from '@prisma/client';
import { Request } from 'express'

export interface Context {
  prisma: PrismaClient
  user?: {
    id: number
  };
}

const prisma = new PrismaClient()

export const context: Context = {
  prisma: prisma,
}
