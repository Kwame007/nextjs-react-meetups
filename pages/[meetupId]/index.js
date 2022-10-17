import React, { Fragment } from "react";
import Head from "next/head";
import MeetupDetail from "../../components/meetups/MeetupDetails";
import { MongoClient, ObjectId } from "mongodb";

const MeetupDetails = (props) => {
  const config = {
    image: props.meetupData.image,
    title: props.meetupData.title,
    address: props.meetupData.address,
    desc: props.meetupData.desc,
  };
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.desc} />
      </Head>
      <MeetupDetail {...config} />;
    </>
  );
};

// getStaticPaths()
export async function getStaticPaths() {
  const client = MongoClient.connect(
    "mongodb+srv://kwame007:N52ZCBwF4sgNuY9@cluster0.s5vcsem.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  // if database does not exist yet it will be created
  const db = (await client).db();

  // meetup collection {if collection does not exist yet it will be created}
  const meetupsCollection = db.collection("meetups");

  // get all meetup data

  // find returns all docs in our collection
  // we can pass arguments to find({1. filter option},2.{which field should be returned})
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  // close db connection
  (await client).close();

  return {
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),

    // [
    //   {
    //     params: {
    //       meetupId: "m1",
    //     },
    //   },
    //   {
    //     params: {
    //       meetupId: "m2",
    //     },
    //   },
    // ],
  };
}

export async function getStaticProps(context) {
  // fetch data for single meetup

  // get dynamic meetupID
  const meetupId = context.params.meetupId;

  const client = MongoClient.connect(
    "mongodb+srv://kwame007:N52ZCBwF4sgNuY9@cluster0.s5vcsem.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  // if database does not exist yet it will be created
  const db = (await client).db();

  // meetup collection {if collection does not exist yet it will be created}
  const meetupsCollection = db.collection("meetups");

  // get all meetup data

  // findOne() returns a single doc in our collection
  // we can pass arguments to find({1. an object that defines how we can find that document})
  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  // close db
  (await client).close();

  // NB: ObjectId() allows us to convert our _id to object form in order to find a doc in mondoDB collection.

  return {
    props: {
      // convert back to string
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        desc: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
