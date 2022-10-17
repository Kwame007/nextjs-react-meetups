import { Fragment } from "react";
import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";

// const MEET_UPS = [
//   {
//     id: "m1",
//     title: "First Meetup",
//     image:
//       "https://i.natgeofe.com/k/e800ca90-2b5b-4dad-b4d7-b67a48c96c91/spain-madrid.jpg?w=636&h=358",
//     address: "Some address",
//     description: "First meetup",
//   },
//   {
//     id: "m2",
//     title: "Second Meetup",
//     image:
//       "https://i.natgeofe.com/k/e800ca90-2b5b-4dad-b4d7-b67a48c96c91/spain-madrid.jpg?w=636&h=358",
//     address: "Some address",
//     description: "Second meetup",
//   },
//   {
//     id: "m3",
//     title: "Third Meetup",
//     image:
//       "https://i.natgeofe.com/k/e800ca90-2b5b-4dad-b4d7-b67a48c96c91/spain-madrid.jpg?w=636&h=358",
//     address: "Some address",
//     description: "Third meetup",
//   },
// ];

const HomePage = (props) => {
  return (
    <Fragment>
      {/* add meta data to nextJs apps this way */}
      <Head>
        <title>React Meetups</title>
        <meta name="description" content="Browse list of reactJs meetups" />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
};

// getStaticProps()
export async function getStaticProps() {
  // fetch some data...
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

  // find() method {this will find all documents inside of our collection}
  // returns a promise
  const meetups = await meetupsCollection.find().toArray();

  // close database connection
  (await client).close();

  // always return an object
  return {
    props: {
      // {when we fetch from mongoDB we need to transform our data to a more usable object literal}
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

// getServerSideProps()
// export const getServerSideProps = () => {
//   return {
//     props: {
//       meetups: MEET_UPS,
//     },
//   };
// };

export default HomePage;
