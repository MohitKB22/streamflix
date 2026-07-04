import { PrismaClient } from '@prisma/client';

// Next.js hot-reloads modules in dev, which would otherwise instantiate
// a fresh PrismaClient (and a fresh connection pool) on every file save.
// Stashing the instance on `globalThis` makes it survive reloads.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
