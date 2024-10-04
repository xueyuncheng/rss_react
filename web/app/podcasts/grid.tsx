'use client'
import React, { useState } from 'react'
import { Podcast } from '@/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import Image from 'next/image'
import pic from './economist.jpeg'
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

const podcastsData = [
  {
    id: 1,
    title: 'The Joe Rogan Experience',
    description: 'The Joe Rogan Experience podcast',
    image_url: 'https://via.placeholder.com/150',
    updated_at: '2021-10-01',
  },
  {
    id: 2,
    title: 'Serial',
    description: 'Serial podcast',
    image_url: 'https://via.placeholder.com/150',
    updated_at: '2021-09-15',
  },
  {
    id: 3,
    title: 'Radiolab',
    description: 'Radiolab podcast',
    image_url: 'https://via.placeholder.com/150',
    updated_at: '2021-08-20',
  },
  {
    id: 4,
    title: 'The Daily',
    description: 'The Daily podcast',
    image_url: 'https://via.placeholder.com/150',
    updated_at: '2021-07-30',
  },
  {
    id: 5,
    title: 'Stuff You Should Know',
    description: 'Stuff You Should Know podcast',
    image_url: 'https://via.placeholder.com/150',
    updated_at: '2021-06-25',
  },
]

const Grid = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>(podcastsData)

  const searchParams = useSearchParams()
  const pageNo = Number(searchParams.get('page_no')) || 1
  const pageSize = Number(searchParams.get('page_size')) || 10
  const totalPage = Math.ceil(podcasts.length / pageSize)
  const pathname = usePathname()

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        {podcasts.map((podcast) => (
          <div key={podcast.id}>
            <Card className="h-128 w-64 transform transition-transform duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle>
                  <Link href={`/podcasts/${podcast.id}`} title={podcast.title}>
                    {podcast.title}
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
                <Link href={`/podcasts/${podcast.id}`}>
                  <Image
                    src={pic}
                    alt={podcast.title}
                    height={240}
                    width={240}
                  />
                </Link>
              </CardContent>
              <CardFooter>
                <p>{podcast.updated_at}</p>
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
