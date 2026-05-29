import mongoose from 'mongoose';
import { User } from '../models/User';
import { Company } from '../models/Company';
import { Application } from '../models/Application';
import { Document } from '../models/Document';
import { ActivityLog } from '../models/ActivityLog';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/easyoil';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: GlobalMongoose | undefined;
}

const cached: GlobalMongoose = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function dbConnect() {
  // Prevent bundler tree-shaking and guarantee model registration
  const _models = { User, Company, Application, Document, ActivityLog };

  if (cached.conn) {
    return cached.conn;
  }
  // Attempt to connect with retries
  const maxRetries = 3;
  let attempt = 0;
  while (attempt < maxRetries) {
    attempt++;
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };
      cached.promise = mongoose.connect(MONGODB_URI, opts);
    }
    try {
      cached.conn = await cached.promise;
      break; // exit loop on success
    } catch (e) {
      console.error('Database connection failed:', e);
      cached.promise = null; // reset promise for retry
      if (attempt >= maxRetries) {
        throw e; // rethrow after max attempts
      }
      // optional delay before retry
      await new Promise(res => setTimeout(res, 500 * attempt));
    }
  }

  return cached.conn;
}
