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

export async function connectToDatabase(): Promise<{
	client: MongoClient;
	db: Db;
}> {
	const client = new MongoClient(MONGODB_URI);

	await client.connect();
	const db = client.db(MONGODB_DB);

	return { client, db };
}
