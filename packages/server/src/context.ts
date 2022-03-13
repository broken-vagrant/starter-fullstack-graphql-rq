import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export interface Context {
  prisma: PrismaClient;
  user?: {
    id: number;
  };
  req: Request;
  res: Response;
}

const prisma = new PrismaClient();

export const context: Context = {
  prisma: prisma,
  req: {} as Request,
  res: {} as Response,
};
