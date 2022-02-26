/**
 * Handles connection and caching of MongoDB connection
 * Created by Aubin C. Spitzer (@aubincspitzer) on 02/24/2022
 * Based on example from: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb/lib/mongodb.js
 */

import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

//Server cannot run without DB connection, so exit and throw error
if (!uri) {
  throw new Error("Missing MONGODB_URI env variable!");
}

//In development, cache connection to global variable
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}
//In production, cache to local variable
else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
