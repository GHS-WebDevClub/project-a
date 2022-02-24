import { MongoClient } from "mongodb";

declare global {
  var db: {
    _mongoClientPromise: Promise<MongoClient>;
  };
  var _mongoClientPromise: Promise<MongoClient>;
}
export {};
