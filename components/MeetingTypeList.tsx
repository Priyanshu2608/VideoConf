"use client";

import Image from "next/image";
import React, { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from 'react-datepicker';
import { Input } from "./ui/input";

const MeetingTypeList = () => {
  const router = useRouter();

  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();

  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });

  const [callDetails, setCallDetails] = useState<Call | null>(null);
  const { user } = useUser();
  const client = useStreamVideoClient();

  const createMeeting = async () => {
    console.log("Create meeting clicked");

    if (!user) {
      console.log("User not loaded");
      return;
    }

    if (!client) {
      console.log("Stream client not ready");
      return;
    }

    try {
      if (!values.dateTime) {
        toast.error("Please select a valid date and time for the meeting.");
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Error creating call");

      const startsAt =
        values.dateTime instanceof Date
          ? values.dateTime.toISOString()
          : new Date().toISOString();

      const description = values.description || "Instant Meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      // FORCE redirect for instant meeting
      if (meetingState === "isInstantMeeting") {
        console.log("Redirecting to:", `/meeting/${call.id}`);
        router.push(`/meeting/${call.id}`);
      }
      toast.success("Meeting created successfully!");
    } catch (error) {
      console.log("Error creating meeting", error);
      toast.error("Error creating meeting. Please try again.");
    }
  };

  const meetingLink=`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
        className="bg-[#FF742E]"
      />

      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState("isScheduleMeeting")}
        className="bg-[#0E78F9]"
      />

      <HomeCard
        img="/icons/recordings.svg"
        title=" View Recordings"
        description="Check out your recordings"
        handleClick={() => router.push("/recordings")}
        className="bg-[#830EF9]"
      />

      <HomeCard
        img="/icons/join-meeting.svg"
        title="New Meeting"
        description="Via invitation link"
        handleClick={() => setMeetingState("isJoiningMeeting")}
        className="bg-[#F9A90E]"
      />
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          className="text-center"
          buttonText="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px]">
              Add a Description
            </label>
            <Textarea
              className="border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) => {
                setValues({ ...values, description: e.target.value });
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px]">
              Select Date and Time
            </label>
            <ReactDatePicker
            selected={values.dateTime}
            onChange={(date) => setValues({ ...values, dateTime: date! })}
            showTimeSelect
            timeFormat="HH:MM"
            timeIntervals={15}
            timeCaption="time"
            dateFormat='MMMM d, yyyy h:mm aa'
            className="w-full rounded bg-dark-1 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink)
              toast(`Meeting link copied to clipboard: ${meetingLink}`)
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copy Meeting Link"
        />
        
      )}
      <MeetingModal
          isOpen={meetingState === "isJoiningMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Type The Link Here"
          className="text-center"
          buttonText="Join Meeting"
          handleClick={()=> router.push(values.link)}
        >
          <Input
          placeholder="Meeting Link"
          onChange={(e)=> setValues({...values, link: e.target.value})}
          />

        </MeetingModal>
        <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
