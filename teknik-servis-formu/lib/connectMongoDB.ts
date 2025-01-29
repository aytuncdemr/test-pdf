import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI as string;
const MONGODB_DB = process.env.MONGODB_DB as string;

if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable in .env.local"
	);
}

if (!MONGODB_DB) {
	throw new Error(
		"Please define the MONGODB_DB environment variable in .env.local"
	);
}

interface CachedConnection {
	client: MongoClient | null;
	db: Db | null;
}

declare global {
	// Ensuring global cache to prevent multiple DB connections in Next.js hot-reloading
	var mongo: CachedConnection;
}

const cached: CachedConnection = global.mongo || { client: null, db: null };

export async function connectToDatabase(): Promise<{
	client: MongoClient;
	db: Db;
}> {
	if (cached.client && cached.db) {
		return { client: cached.client, db: cached.db };
	}

	const client = new MongoClient(MONGODB_URI);

	await client.connect();
	const db = client.db(MONGODB_DB);

	cached.client = client;
	cached.db = db;
	global.mongo = cached;

	return { client, db };
}
