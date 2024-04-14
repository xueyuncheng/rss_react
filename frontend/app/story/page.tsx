import useSWR from 'swr'
import { DefaultFetcher, ResponsePage } from '../config/config'
import { useState } from 'react'

export type StoryListProps = {
  channel_id: number
}

type Story = {
  id: number
  title: string
  link: string
  description: string
  guid: string
  pub_date: string
  channel_id: number
  channel_title: string
}

function StoryList({ channel_id }: StoryListProps) {
  const [pageNo, setPageNo] = useState(1)

  const pages: any[] = []
  for (let i = 1; i <= pageNo; i++) {
    pages.push(<Page key={i} channel_id={channel_id} page_no={i} />)
  }

  return (
    <div>
      <h2>Story列表</h2>
      <div className="h-screen overflow-auto">
        <ul>{pages}</ul>
        <button
          className="btn btn-sm mt-2"
          onClick={() => setPageNo(pageNo + 1)}
        >
          加载更多
        </button>
      </div>
    </div>
  )
}

type PageProps = {
  channel_id: number
  page_no: number
}

function Page({ channel_id, page_no }: PageProps) {
  const { data, isLoading, error } = useSWR<ResponsePage<Story>>(
    `/stories?page_no=${page_no}&page_size=100&channel_id=${channel_id}`,
    DefaultFetcher
  )

  if (isLoading) {
    return []
  }

  if (error) {
    return []
  }

  return data?.data.items.map((story) => (
    <li key={story.id}>
      <a
        href={story.link}
        target="_blank"
        className="link text-blue-600 visited:text-purple-600"
      >
        {story.title}
      </a>
    </li>
  ))
}

export default StoryList
