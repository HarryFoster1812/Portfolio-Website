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
      .project({ email: 1, _id: 0 })
      .toArray();

    // Extract just the email strings
    const emails = users.map(u => u.email);

    // Output as a JSON array of strings
    console.log(JSON.stringify(emails));
  } finally {
    await client.close();
  }
}

getConfirmedUsers().catch(console.error);
