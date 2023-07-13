import { NEXT_PUBLIC_MONGOOSE } from '$env/static/private';
import mongoose from 'mongoose';

export async function connect(): Promise<void> {
    await mongoose.connect(NEXT_PUBLIC_MONGOOSE);
}

export async function disconnect(): Promise<void> {
    await mongoose.disconnect();
}

export function getDB(): any {
    return mongoose.connection.db;
}