'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { PodcastEpisode } from '@/types'
import { api } from '@/util'
import { util } from '@/util/util'

import { columns } from './column'
import { DataTable } from './data-table'

const Page = () => {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const pageNo = Number(searchParams.get('page_no')) || 1
  const pageSize = Number(searchParams.get('page_size')) || 10
  const showID = Number(searchParams.get('show_id')) || 0

  const totalPages = Math.ceil(total / pageSize)

  useEffect(() => {
    setLoading(true)
    api.listPodcastEpisode(pageNo, pageSize, showID).then((data) => {
      setEpisodes(data.data.items)
      setTotal(data.data.total)
    })
    setLoading(false)
  }, [pageNo, pageSize, showID])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <DataTable columns={columns} data={episodes} total={total} />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={
                pageNo > 1
                  ? util.createPageURL(pathname, searchParams, pageNo - 1)
                  : '#'
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={
                pageNo < totalPages
                  ? util.createPageURL(pathname, searchParams, pageNo + 1)
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
