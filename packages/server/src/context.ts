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

export const prisma = new PrismaClient();
