'use client'
import { useState } from 'react'
import useSWR from 'swr'
import {
  Endpoint,
  DefaultFetcher,
  Response,
  ResponsePage,
} from '../config/config'

type Channel = {
  id: number
  name: string
  source: string
  title: string
  description: string
}

type ChannelListProps = {
  setChannelID: (channel_id: number) => void
}

function ChannelList({ setChannelID }: ChannelListProps) {
  const [show, setShow] = useState(false)
  const [source, setSource] = useState('')
  const [name, setName] = useState('')

  const { data, isLoading, error, mutate } = useSWR<ResponsePage<Channel>>(
    Endpoint + '/channels?page_no=1&page_size=100',
    DefaultFetcher
  )

  const handleSubmitClick = async function (
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.currentTarget.disabled = true
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        source: source,
      }),
    }

    const res: Response<any> = await fetch(
      Endpoint + '/channels',
      options
    ).then((res) => res.json())

    if (res.err !== '') {
      alert(res.err)
    }

    setShow(false)
    mutate()
  }

  const handleDeleteClick = async function (channel_id: number) {
    const options = {
      method: 'DELETE',
    }

    const res: Response<any> = await fetch(
      Endpoint + `/channels/${channel_id}`,
      options
    ).then((res) => res.json())

    if (res.err !== '') {
      alert(res.err)
    }

    mutate()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1>Channel 列表</h1>
        <button className="btn btn-sm" onClick={() => setShow(true)}>
          添加
        </button>
      </div>
      <hr />
      {isLoading && <h2>Loading</h2>}
      {error && <h2 className="bg-red-500">error</h2>}
      <ul className="flex flex-col space-y-2 mt-3">
        {data &&
          data.data.items.map((channel) => (
            <li key={channel.id} onClick={() => setChannelID(channel.id)}>
              <div className="flex justify-between items-center hover:bg-slate-200 rounded-full pl-2">
                {channel.name}
                <button
                  onClick={() => handleDeleteClick(channel.id)}
                  className="btn btn-sm ml-2"
                >
                  删除
                </button>
              </div>
            </li>
          ))}
      </ul>
      {show && (
        <dialog className="modal modal-open">
          <div className="modal-box w-fit">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setShow(false)}
            >
              ✕
            </button>
            <div className="flex flex-col space-y-3 mt-5">
              <div className="flex justify-end">
                <label>Channel名称:</label>
                <input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入channel名称"
                  className="border ml-2"
                />
              </div>
              <div className="flex justify-end">
                <label htmlFor="source">来源URL:</label>
                <input
                  id="source"
                  name="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="请输入来源URL"
                  className="border ml-2"
                />
              </div>
            </div>
            <div className="text-right mt-2">
              <button className="btn btn-sm" onClick={handleSubmitClick}>
                提交
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}

export default ChannelList
