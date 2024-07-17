import mongoose from "mongoose";

const mongodb_uri = process.env.DB_URI
var mongoConnection;

if(!mongodb_uri) {
    throw new Error("Please configure db connection first!")
}

if(!mongoConnection) mongoConnection = { conn: null, promise: null }

async function dbConnect() {
    if(mongoConnection.conn) return mongoConnection.conn

    if(!mongoConnection.promise) {
        mongoConnection.promise = await mongoose.connect(mongodb_uri, { bufferCommands: false })
    }

    try {
        mongoConnection.conn = await mongoConnection.promise
    } catch(e) {
        mongoConnection.promise = null
        throw e
    }

    return mongoConnection.conn
}

export default dbConnect