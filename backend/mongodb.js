import { MongoClient } from 'mongodb';

// Connection URL
const url = process.env.MONGO_URL;
const client = new MongoClient(url);
await client.connect();
const db = client.db();

const usersCollection = db.collection('users');
await usersCollection.createIndex({ google_sub: 1 }, { unique: true });

// eslint-disable-next-line import/prefer-default-export
export { db, usersCollection };
