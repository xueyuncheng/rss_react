'use client'
import { useState } from 'react'
import ChannelList from './channel/page'
import StoryList from './story/page'

export default function Home() {
  const [channelID, setChannelID] = useState(0)

  return (
    <main>
      <div className="flex justify-center mb-10">
        <div className="navbar bg-base-300 w-2/3 rounded-full flex justify-center">
          <div>
            <a className="btn btn-ghost text-xl" href="/">
              RSS阅读器
            </a>
          </div>
        </div>
      </div>
      <div className="ml-10 flex">
        <div className="flex-none max-w-max">
          <ChannelList setChannelID={setChannelID} />
        </div>
        <div className="flex-1 ml-5">
          <StoryList channel_id={channelID} />
        </div>
      </div>
    </main>
  )
}
