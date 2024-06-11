import mongoose from 'mongoose';

import * as models from './models/exports';
import process from 'process';

const connectToDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			dbName: process.env.DATABASE_NAME,
			connectTimeoutMS: 5000
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
