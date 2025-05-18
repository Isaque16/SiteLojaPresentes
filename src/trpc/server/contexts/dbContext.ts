import connectToDatabase from '../database/connectDB';

/**
 * This function creates a database context for the application.
 * It connects to the database and returns the connection object.
 * @returns {Promise<{ db: void }>} A promise that resolves to an object containing the database connection.
 */
export async function createDbContext(): Promise<{ db: void }> {
  const db = await connectToDatabase();
  return { db };
}
