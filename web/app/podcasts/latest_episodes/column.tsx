'use client'

import { Dinner, PodcastEpisode } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { api } from '@/util'

// {
//     id: 1,
//     title: 'Episode 1',
//     description: 'Description for episode 1',
//     published_at: '2023-10-01',
//     duration: '30:00',
//     audio_url: 'https://example.com/episode1.mp3',
//   },

export const columns: ColumnDef<PodcastEpisode>[] = [
  {
    header: '序号',
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>
    },
  },
  {
    accessorKey: 'title',
    header: '标题',
  },
  {
    accessorKey: 'description',
    header: '描述',
  },
  {
    accessorKey: 'published_at',
    header: '发布日期',
  },
  {
    accessorKey: 'duration',
    header: '时长',
  },
  {
    header: '操作',
    cell: ({ row }) => {
      return (
        <Button variant="ghost" className="w-8 h-8 p-0" asChild>
          <Link href={row.original.audio_url} target="_blank">
            播放
          </Link>
        </Button>
      )
    },
  },
]
