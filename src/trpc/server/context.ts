import connectToDatabase from "@/server/database/connectDB";

export async function createContext() {
  const db = await connectToDatabase();

  return {
    db
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
