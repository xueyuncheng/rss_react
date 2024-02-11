'use client'
import { useState } from 'react'
import ChannelList from './channel/page'
import StoryList from './story/page'

export default function Home() {
  const [channelID, setChannelID] = useState(0)

  return (
    <main className="mx-24">
      <div className="flex justify-center mt-3 mb-10">
        <div className="navbar bg-slate-100 rounded-full flex justify-center">
          <div>
            <a
              className="btn btn-ghost rounded-full text-xl hover:bg-slate-200"
              href="/"
            >
              RSS阅读器
            </a>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="flex-none w-1/6">
          <ChannelList setChannelID={setChannelID} />
        </div>
        <div className="border-4 mx-2 border-green-200"></div>
        <div className="flex-auto">
          <StoryList channel_id={channelID} />
        </div>
      </div>
    </main>
  )
}
