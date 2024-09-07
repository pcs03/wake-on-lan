import mongoose from 'mongoose';

const { MONGO_PORT, MONGO_HOST, MONGO_DBNAME } = process.env;

const MONGO_URI = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBNAME}`;

const connectDB = async () => {
    console.log(`connnecting to ${MONGO_URI}`);
    try {
        const connection = await mongoose.connect(MONGO_URI);

        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export { connectDB };
