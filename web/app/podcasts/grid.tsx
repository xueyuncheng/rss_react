'use client'
import React, { useEffect, useState } from 'react'
import { PodcastShow } from '@/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import Image from 'next/image'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { usePathname, useSearchParams } from 'next/navigation'
import { util } from '@/util/util'
import Link from 'next/link'

import { api } from '@/util/'

import { formatDistanceToNow } from 'date-fns'

const Grid = () => {
  const [podcasts, setPodcasts] = useState<PodcastShow[]>([])
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()
  const pageNo = Number(searchParams.get('page_no')) || 1
  const pageSize = Number(searchParams.get('page_size')) || 10
  const showID = Number(searchParams.get('show_id')) || 0
  const totalPage = Math.ceil(podcasts.length / pageSize)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    api.listPodcastShow(pageNo, pageSize).then((data) => {
      setPodcasts(data.data.items)
    })
    setLoading(false)
  }, [pageNo, pageSize, showID])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        {podcasts.map((podcast) => (
          <div key={podcast.id}>
            <Card className="h-128 w-64 transform transition-transform duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle>
                  <Link href={`/podcasts/${podcast.id}`} title={podcast.name}>
                    {podcast.name}
                  </Link>
                </CardTitle>
                <CardDescription
                  className="truncate"
                  title={podcast.description}
                >
                  {podcast.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/podcasts/latest_episodes?show_id=${podcast.id}`}>
                  <img
                    src={podcast.image_url}
                    alt={podcast.name}
                    height={240}
                    width={240}
                  />
                </Link>
              </CardContent>
              <CardFooter>
                <p>
                  {formatDistanceToNow(new Date(podcast.updated_at), {
                    addSuffix: true,
                  })}
                </p>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
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
                pageNo < totalPage
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

export default Grid
