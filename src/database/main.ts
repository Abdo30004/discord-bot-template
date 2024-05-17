import mongoose from "mongoose";

import * as models from "./models/exports";

const connectToDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DATABASE_NAME,
      connectTimeoutMS: 5000,
    });
    const database = {
      connection: mongoose.connection,
      models,
    };

    return database;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export {  connectToDB };
