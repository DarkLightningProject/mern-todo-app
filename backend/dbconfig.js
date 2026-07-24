
import "./loadEnv.js";
import { MongoClient } from "mongodb";

const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "Node-project";
export const collectionName = process.env.COLLECTION_NAME || "todo";

if (!url) {
    throw new Error("Missing MONGODB_URI environment variable.");
}

const client = new MongoClient(url);

export const connection = async () => {
    const connect = await client.connect();
    return connect.db(dbName);
};
