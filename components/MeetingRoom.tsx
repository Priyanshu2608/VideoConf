import { cn } from '@/lib/utils'
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk'
import React, { use, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LayoutList, Users } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import EndCallButton from './EndCallButton'
import Loader from './Loader'
import { useRouter } from 'next/navigation'

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right'

const MeetingRoom = () => {
    const searchParams = useSearchParams();
    const isPersonalRoom= !!searchParams.get('personal');
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left')
  const [showParticipants, setShowParticipants] = useState(false)
  const {useCallCallingState}= useCallStateHooks();
  const callingState=useCallCallingState();
  const router = useRouter();
  React.useEffect(() => {
  if (callingState === CallingState.LEFT) {
    router.push('/')
  }
}, [callingState, router])


  if(callingState !== CallingState.JOINED) return <Loader/>

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout  />
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />
      default:
        return <SpeakerLayout participantsBarPosition="right" />
    }
  }

  return (
    <section className="relative h-screen w-full overflow-hidden pt-2 text-white">
      <div className="relative flex h-full w-full">
        
        {/* Video Layout */}
        <div className="flex flex-1 items-center justify-center max-w-[1300px] mx-auto">
          <CallLayout />
        </div>

        {/* Participants Panel */}
       <div
  className={cn(
    'absolute right-0 top-0  h-[calc(100vh-86px)] w-[300px] bg-[#0f172a] border-l border-gray-700 overflow-x-hidden rounded-2xl',
    showParticipants ? 'block' : 'hidden'
  )}
>
  <div className="h-full overflow-x-hidden px-3 py-2 rounded-2xl">
    <CallParticipantsList onClose={() => setShowParticipants(false)} />
  </div>
</div>
      </div>

      {/* Controls */}
      <div className="fixed bottom-0 z-20 flex w-full items-center justify-center gap-5 flex-wrap bg-black/50 py-3">
        <CallControls />

        {/* Layout Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <LayoutList size={20} className="text-white" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-[#0f172a] border border-gray-700 text-white">
            {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item) => (
              <DropdownMenuItem
                key={item}
                className="cursor-pointer"
                onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}
              >
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />

        {/* Toggle Participants */}
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton/>}
      </div>
    </section>
  )
}

export default MeetingRoom
