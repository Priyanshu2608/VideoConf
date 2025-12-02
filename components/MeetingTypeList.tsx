"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'

const MeetingTypeList = () => {
    const router= useRouter();
    const[meetingState, setMeetingState]= useState<'isScheduleMeeting'|'isJoiningMeeting'|'isInstantMeeting'|undefined>()
  return (
   <section className='grid grid-cols-1 gap-5 md-grid-cols-2 xl:grid-cols-4'>
   <HomeCard
   img='/icons/add-meeting.svg'
   title='New Meeting'
   description='Start an instant meeting'
   handleClick={()=>setMeetingState('isJoiningMeeting')}
   className="bg-[#FF742E]"
   />
    <HomeCard
   img='/icons/schedule.svg'
   title='Schedule Meeting'
   description='Plan your meeting'
   handleClick={()=>setMeetingState('isScheduleMeeting')}
   className="bg-[#0E78F9]"
   />
    <HomeCard
   img='/icons/recordings.svg'
   title=' View Recordings'
   description='Check out your recordings'
   handleClick={()=>router.push('/recordings')}
    className="bg-[#830EF9]"
   />
    <HomeCard
   img='/icons/join-meeting.svg'
   title='New Meeting'
   description='Via invitation link'
   handleClick={()=>setMeetingState('isJoiningMeeting')}
    className="bg-[#F9A90E]"
   />
   </section>
  )
}

export default MeetingTypeList
