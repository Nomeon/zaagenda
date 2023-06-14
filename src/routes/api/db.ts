import { DB_URI } from '$env/static/private';
import { MongoClient } from 'mongodb';

const client = new MongoClient(DB_URI);
await client.connect();
const db = client.db('zaagplanner');
export default db;