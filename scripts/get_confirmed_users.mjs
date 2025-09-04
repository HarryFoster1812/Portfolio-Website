// scripts/get_confirmed_users.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function getConfirmedUsers() {
  try {
    await client.connect();
    const db = client.db("test");
    const users = await db
      .collection("subscribers")
      .find({ confirmed: true })
      .project({ email: 1, confirmationToken: 1, _id: 0 }) // include confirmationToken
      .toArray();

    // Output as a JSON array of objects
    console.log(JSON.stringify(users, null, 2));
  } finally {
    await client.close();
  }
}

getConfirmedUsers().catch(console.error);
