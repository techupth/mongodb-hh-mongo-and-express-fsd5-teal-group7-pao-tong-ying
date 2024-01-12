// Set up db connection here
import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "practice-mongo";
export async function connect() {
  await client.connect();
  console.log("Connected successfully to server");
}
function getDB() {
  return client.db(dbName);
}
export function getCollection(collectionName) {
  const db = getDB();
  return db.collection(collectionName);
}
export function close() {
  client.close();
}
