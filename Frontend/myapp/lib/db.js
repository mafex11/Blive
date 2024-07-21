import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    console.log('Using cached database connection');
    return { client: cachedClient, db: cachedDb };
  }

  console.log('Connecting to new database');
  try {
    const client = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    cachedClient = client;
    cachedDb = client.connection.db;

    console.log('Database connection successful');
    return { client, db: cachedDb };
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

export default connectToDatabase;
