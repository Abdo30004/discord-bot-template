import mongoose from 'mongoose';

import { ENV } from '../utils/env';
import * as models from './models/exports';

const connectToDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI, {
      dbName: ENV.DATABASE_NAME,
      connectTimeoutMS: 30 * 1000 //
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const database = {
  connection: mongoose.connection,
  models
};

export { database, connectToDB };
