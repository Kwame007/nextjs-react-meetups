import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import NewMeetupForm from "../../components/meetups/NewMeetupForm";

const NewMeetupPage = () => {
  const router = useRouter();
  // function
  const addMeetupHandler = async (meetup) => {
    const results = await fetch(`/api/new-meetup`, {
      method: "POST",
      body: JSON.stringify(meetup),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await results.json();

    console.log(data);

    // redirect
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>Add New Meetup</title>
        <meta name="description" content="You are one step away" />
      </Head>
      <NewMeetupForm onAddMeetup={addMeetupHandler} />
    </>
  );
};

export default NewMeetupPage;
