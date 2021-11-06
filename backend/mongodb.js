import { MongoClient } from 'mongodb';

// Connection URL
const url = process.env.MONGO_URL;
const client = new MongoClient(url);
// await client.connect();
const db = client.db();

// eslint-disable-next-line import/prefer-default-export
export { db };
