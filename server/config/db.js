import mongoose from 'mongoose';

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rental_property_db';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500 // Don't block startup if local mongod is absent
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.log(`⚠️ Notice: Could not connect to MongoDB at ${uri}.`);
    console.log(`ℹ️ Falling back to file-based persistent local storage (server/data/local_db.json).`);
    console.log(`💡 Tip: To use MongoDB, ensure mongod is running locally or set MONGODB_URI in server/.env`);
    return false;
  }
};

export const getIsMongoConnected = () => isMongoConnected;
