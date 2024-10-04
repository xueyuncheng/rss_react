'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/util'
import { Dinner } from '@/types'

import { Button } from '@/components/ui/button'

import { usePathname, useSearchParams } from 'next/navigation'
import { DataTable } from '@/app/dinners/data-table'
import { columns } from '@/app/dinners/columns'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { util } from '@/util/util'

const Page = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [dinners, setDinners] = useState<Dinner[]>([])
  const [loading, setLoading] = useState(true)

  const pageNo = Number(searchParams.get('page_no')) || 1
  const pageSize = Number(searchParams.get('page_size')) || 10

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const response = await api.listDinner(pageNo, pageSize)
      setDinners(response.data.items)
      setTotal(response.data.total)
      setTotalPages(Math.ceil(response.data.total / pageSize))
      setLoading(false)
    }

    return () => {
      fetchData()
    }
  }, [pageNo, pageSize])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-1/2 flex-col space-y-2">
      <div className="flex justify-end mb-2 space-x-2">
        <Button asChild>
          <Link href="/dinners/create">新建</Link>
        </Button>
        <Button asChild>
          <Link href="/dinners/what_to_eat">今晚吃什么</Link>
        </Button>
      </div>

      <DataTable columns={columns} data={dinners} total={total} />

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
