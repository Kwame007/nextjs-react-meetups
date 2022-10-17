import { MongoClient } from "mongodb";
//   /api/new-meetup
//    POST /api/new-meetup

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const data = req.body;

      // store  request body inside database

      // connect client to mongodb
      // connect will establish a connecting with our mongodb database{ this is code we never want in our client side cos we would expose our credentials}
      // but its totally fine here cos this code would never run on the client side
      const client = MongoClient.connect(
        "mongodb+srv://kwame007:N52ZCBwF4sgNuY9@cluster0.s5vcsem.mongodb.net/meetups?retryWrites=true&w=majority"
      );

      // if database does not exist yet it will be created
      const db = (await client).db();

      // meetup collection {if collection does not exist yet it will be created}
      const meetupsCollection = db.collection("meetups");

      // insert a single meetup document in the meetups collection {this also returns a promise}
      const result = await meetupsCollection.insertOne(data);

      console.log(res);

      // close database connection
      (await client).close();

      // send response back if successfully
      res.status(201).json({ message: "Meetup added successfully" });
    }
  } catch (error) {
    console.log(error);
  }
}
