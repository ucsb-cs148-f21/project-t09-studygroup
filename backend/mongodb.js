import { MongoClient } from 'mongodb';
import { getMostCurrentQuarter } from './getMostCurrentQuarter';

// Connection URL
const url = process.env.MONGO_URL;
const client = new MongoClient(url);
await client.connect();
const db = client.db();

const usersCollection = db.collection('users');
await usersCollection.createIndex({ uid: 1 }, { unique: true });

// eslint-disable-next-line import/prefer-default-export

db.collection(`courses_${await getMostCurrentQuarter()}`).createIndex(
  {
    courseID: 'text',
    title: 'text',
    instructors: 'text',
    description: 'text',
  },
);
db.collection('users').createIndex(
  {
    name: 'text',
    email: 'text',
  },
);
export { db, usersCollection };
