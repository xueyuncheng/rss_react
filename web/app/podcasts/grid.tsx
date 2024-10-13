'use client'
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

import { formatDistanceToNow } from 'date-fns'

import { Trash2 } from 'lucide-react'

type Props = {
  shows: PodcastShow[]
  onDelete: (id: number) => void
}

const Grid = ({ shows, onDelete }: Props) => {
  const searchParams = useSearchParams()
  const pageNo = Number(searchParams.get('page_no')) || 1
  const pageSize = Number(searchParams.get('page_size')) || 10
  const totalPage = Math.ceil(shows.length / pageSize)
  const pathname = usePathname()

  if (shows.length === 0) {
    return (
      <>
        <div>暂无播客节目</div>
      </>
    )
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        {shows.map((show) => (
          <div key={show.id}>
            <Card className="h-128 w-64 transform transition-transform duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle>
                  <Link href={`/podcasts/${show.id}`} title={show.name}>
                    {show.name}
                  </Link>
                </CardTitle>
                <CardDescription className="truncate" title={show.description}>
                  {show.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative group">
                <Link href={`/podcasts/latest_episodes?show_id=${show.id}`}>
                  <Image
                    src={`/api/files/${show.image_object_name}`}
                    alt={show.name}
                    height={240}
                    width={240}
                  />
                </Link>
                <button
                  onClick={() => onDelete(show.id)}
                  title="删除"
                  className="absolute bottom-8 right-8 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </CardContent>
              <CardFooter>
                <span>
                  {formatDistanceToNow(new Date(show.updated_at), {
                    addSuffix: true,
                  })}
                </span>
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
                  ? util.createPageURL(pathname, searchParams, pageNo - 1)
                  : '#'
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={
                pageNo < totalPage
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

export default Grid
