import { MONGOOSE } from '$env/static/private';
import mongoose from 'mongoose';

/* 
  0 - disconnected
  1 - connected
  2 - connecting
  3 - disconnecting
  4 - uninitialized
*/

const mongoConnection = {
    isConnected: 0,
}

export async function connect(): Promise<void> {
    if (mongoConnection.isConnected === 1) {
        console.log("Using existing connection");
        return;
    }

    if (mongoose.connections.length > 0) {
        mongoConnection.isConnected = mongoose.connections[0].readyState;
        if (mongoConnection.isConnected === 1) {
            console.log("Using existing connection");
            return;
        }
        await mongoose.disconnect();
    }
    await mongoose.connect(MONGOOSE);
    mongoConnection.isConnected = 1;
    console.log("Using new connection");
}

export async function disconnect(): Promise<void> {
    if (mongoConnection.isConnected === 0) return;
    await mongoose.disconnect();
    mongoConnection.isConnected = 0;
    console.log("Disconnected");
}

export function getDB(): any {
    return mongoose.connection.db;
}