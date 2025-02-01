import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI as string;
const MONGODB_DB = process.env.MONGODB_DB as string;

if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

if (!MONGODB_DB) {
	throw new Error("Please define the MONGODB_DB environment variable in .env.local");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
	if (cachedClient && cachedDb) {
		// ✅ Use existing connection
		return { client: cachedClient, db: cachedDb };
	}

	// ❌ Create new connection only if none exist
	const client = new MongoClient(MONGODB_URI);
	await client.connect();
	const db = client.db(MONGODB_DB);

	// Cache connection
	cachedClient = client;
	cachedDb = db;

	return { client, db };
}
