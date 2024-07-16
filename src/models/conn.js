import mongoose from 'mongoose';

const mongoURI = process.env.MONGODB_URI;

export function connectToMongo(dbName = process.env.DB_NAME) {
    return mongoose.connect(mongoURI, {dbName: dbName});
};

function signalHandler() {
    console.log("Closing MongoDB connection...");
    mongoose.disconnect();
    process.exit();
}

process.on("SIGINT", signalHandler);
process.on("SIGTERM", signalHandler);
process.on("SIGQUIT", signalHandler);