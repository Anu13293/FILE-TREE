import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri, { autoIndex: true })
  .then(() => console.log('MongoDB connected'))
  .catch((e) => {
    console.error('MongoDB connection error', e);
    process.exit(1);
  });
