import { MONGODB_URI } from '$env/static/private';
import { MongoClient, Db } from "mongodb";

const client: MongoClient = new MongoClient(MONGODB_URI);

export async function connect(): Promise<void> {
    await client.connect();
}

// disconnect from the database
export async function disconnect(): Promise<void> {
    await client.close();
}

// get the database
export function getDB(): Db {
    return client.db();
}