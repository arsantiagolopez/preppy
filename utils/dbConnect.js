import mongoose from "mongoose";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "Please define the process.env.DATABASE_URL environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { isConnected: null, promise: null };
}

const dbConnect = async () => {
  if (cached.isConnected) {
    return cached.isConnected;
  }

  if (!cached.promise) {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      bufferMaxEntries: 0,
      useFindAndModify: false,
      useCreateIndex: true,
    };

    cached.promise = mongoose
      .connect(process.env.DATABASE_URL, options)
      .then((mongoose) => {
        return mongoose;
      });
  }
  cached.isConnected = await cached.promise;
  return cached.isConnected;
};

export { dbConnect };
