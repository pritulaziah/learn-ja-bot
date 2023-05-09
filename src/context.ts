import { Context as DefaultContent } from 'grammy';
import { PrismaClient } from '@prisma/client';

export type Context = DefaultContent & { prisma: PrismaClient };
