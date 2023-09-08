import mongoose from "mongoose";
import { config } from "dotenv";
config();

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");
  } catch (e) {
    console.error(`Error connecting to Database\n${e.name}:\n  ${e.message}`);
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log("Successfully disconnected from Database");
  } catch (e) {
    console.error(
      `Error disconnecting from Database\n${e.name}:\n  ${e.message}`
    );
  }
}
