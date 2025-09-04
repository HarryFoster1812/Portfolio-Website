// scripts/get_confirmed_users.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function getConfirmedUsers() {
  try {
    await client.connect();
    const db = client.db("test"); 
    const users = await db.collection("subscribers").find({ confirmed: true }).toArray();
    console.log(JSON.stringify(users)); // outputs to workflow logs
  } finally {
    await client.close();
  }
}

getConfirmedUsers().catch(console.error);
