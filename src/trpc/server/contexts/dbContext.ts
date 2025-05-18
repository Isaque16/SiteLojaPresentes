import connectToDatabase from '../database/connectDB';

export async function createDbContext(): Promise<{ db: void }> {
  const db = await connectToDatabase();
  return { db };
}

export type DbContext = Awaited<ReturnType<typeof createDbContext>>;
