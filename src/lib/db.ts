import { NEXT_PUBLIC_DB_URI } from '$env/static/private';
import { MongoClient } from 'mongodb';

const client = new MongoClient(NEXT_PUBLIC_DB_URI);

export async function connect(): Promise<void> {
    await client.connect();
}

export async function disconnect(): Promise<void> {
    await client.close();
}

export function getDB(): any {
    return client.db('zaagplanner');
}
