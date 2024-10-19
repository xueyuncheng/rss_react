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

import { Ellipsis } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
            <Card className="h-128 w-64">
              <CardHeader>
                <CardTitle>
                  <Link href={`/podcasts/${show.id}`}>
                    <p className="truncate">{show.name}</p>
                  </Link>
                </CardTitle>
                <CardDescription>{show.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/podcasts/latest_episodes?show_id=${show.id}`}>
                  <Image
                    src={`/api/files/${show.image_object_name}`}
                    alt={show.name}
                    height={240}
                    width={240}
                  />
                </Link>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span>
                  {formatDistanceToNow(new Date(show.updated_at), {
                    addSuffix: true,
                  })}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Ellipsis />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link href={`/podcasts/${show.id}`}>查看</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(show.id)}>
                      删除
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/podcasts/${show.id}/edit`}>编辑</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
