'use client'
import { PodcastEpisode } from '@/types'
import React, { useState } from 'react'
import { DataTable } from './data-table'
import { columns } from './column'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { usePathname, useSearchParams } from 'next/navigation'
import { util } from '@/util/util'

const episodesData: PodcastEpisode[] = [
  {
    id: 1,
    title: 'Episode 1',
    description: 'Description for episode 1',
    published_at: '2023-10-01',
    duration: '30:00',
    audio_url: 'https://example.com/episode1.mp3',
  },
  {
    id: 2,
    title: 'Episode 2',
    description: 'Description for episode 2',
    published_at: '2023-10-08',
    duration: '45:00',
    audio_url: 'https://example.com/episode2.mp3',
  },
  {
    id: 3,
    title: 'Episode 3',
    description: 'Description for episode 3',
    published_at: '2023-10-15',
    duration: '50:00',
    audio_url: 'https://example.com/episode3.mp3',
  },
]

const Page = () => {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>(episodesData)

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const pageNo = Number(searchParams.get('page_no')) || 1
  const pageSize = Number(searchParams.get('page_size')) || 10

  const total = episodes.length
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="w-full flex flex-col gap-2">
      <DataTable columns={columns} data={episodes} total={total} />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={
                pageNo > 1
                  ? util.createPageURL(
                      pathname,
                      new URLSearchParams(searchParams.toString()),
                      pageNo - 1
                    )
                  : '#'
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={
                pageNo < totalPages
                  ? util.createPageURL(
                      pathname,
                      new URLSearchParams(searchParams.toString()),
                      pageNo + 1
                    )
                  : '#'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default Page
