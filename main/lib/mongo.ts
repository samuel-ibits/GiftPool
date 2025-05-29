// lib/mongo.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URL!;
let client: MongoClient | null = null;

export async function getMongoClient() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }
    return client;
}
