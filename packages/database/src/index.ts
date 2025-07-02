// Re-export everything from Prisma Client
export * from '../prisma/generated/client';

// Re-export the main PrismaClient class with a named export
export { PrismaClient as Database } from '../prisma/generated/client';

// You can also export utility functions or custom types here
export type { Prisma } from '../prisma/generated/client';
