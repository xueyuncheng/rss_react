'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { deleteDinner, listDinner } from '@/util'
import { Dinner } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useSearchParams } from 'next/navigation'

const Page = () => {
  const searchParams = useSearchParams()
  const pageNo = Number(searchParams.get('page_no')) || 1
  const [totalPage, setTotalPage] = useState(0)
  const [dinners, setDinners] = useState<Dinner[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const pageSize = 10
      setLoading(true)
      const response = await listDinner(pageNo, pageSize)
      setDinners(response.data.items)
      setTotalPage(Math.ceil(response.data.total / pageSize))
      setLoading(false)
    }

    return () => {
      fetchData()
    }
  }, [pageNo])

  const onDeleteDinner = async (id: number) => {
    try {
      await deleteDinner(id)
      // mutate()
    } catch (error) {
      alert(error)
    }
  }

  return (
    <div className="flex flex-col justify-center mx-auto w-1/2 space-y-4">
      <div className="flex justify-end mt-4">
        <Link href="/dinners/create">
          <Button className="w-16">添加</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>序号</TableHead>
            <TableHead>名称</TableHead>
            <TableHead>权重</TableHead>
            <TableHead className="text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                正在加载数据...
              </TableCell>
            </TableRow>
          ) : (
            dinners.map((dinner, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{dinner.name}</TableCell>
                <TableCell>{dinner.weight}</TableCell>
                <TableCell className="flex justify-center space-x-4">
                  <Link href={`dinners/${dinner.id}/edit`}>
                    <Button>编辑</Button>
                  </Link>
                  <Button onClick={() => onDeleteDinner(dinner.id)}>
                    删除
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          {pageNo > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href={`?page_no=${pageNo - 1}`}
              ></PaginationPrevious>
            </PaginationItem>
          )}
          <PaginationItem>{pageNo}</PaginationItem>
          {pageNo < totalPage && (
            <PaginationItem>
              <PaginationNext
                href={`/dinners?page_no=${pageNo + 1}`}
              ></PaginationNext>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default Page
