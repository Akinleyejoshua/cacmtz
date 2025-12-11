import mongoose from 'mongoose';

// Type the global object to store the cached connection
declare global {
  var mongoose: { 
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Initialize global cache variable
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Global utility function to connect to MongoDB.
 * Reuses an existing connection or creates a new one.
 */
async function dbConnect() {
  if (cached.conn) {
    return cached.conn; // Return cached connection
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Recommended for serverless environments
      dbName: 'cacmtz', // Optional: explicitly set database name
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // cached.conn = await cached.promise;
    console.log('MongoDB Connected');
  } catch (e) {
    cached.promise = null; // Clear promise on error
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
