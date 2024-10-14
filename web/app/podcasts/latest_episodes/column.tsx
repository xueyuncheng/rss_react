'use client'

import { PodcastEpisode } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { useEffect, useState } from 'react'

const HandleAudio = ({ row }: { row: { original: PodcastEpisode } }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (audio) {
      const handleEnded = () => setIsPlaying(false)
      audio.addEventListener('ended', handleEnded)
      return () => {
        audio.removeEventListener('ended', handleEnded)
      }
    }
  }, [audio])

  const togglePlayPause = () => {
    if (!audio) {
      const newAudio = new Audio(row.original.enclosure_url)
      setAudio(newAudio)
      newAudio.play()
      setIsPlaying(true)
    } else {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div>
      <Button variant="ghost" className="w-8 h-8 p-0" onClick={togglePlayPause}>
        {isPlaying ? <Pause /> : <Play />}
      </Button>
    </div>
  )
}

export const columns: ColumnDef<PodcastEpisode>[] = [
  {
    accessorKey: 'name',
    header: '标题',
  },
  {
    accessorKey: 'published_at',
    header: '发布日期',
    cell: ({ row }) => {
      const formated = formatDistanceToNow(
        new Date(row.original.published_at),
        { addSuffix: true }
      )

      return <div>{formated}</div>
    },
  },
  {
    accessorKey: 'duration',
    header: '时长',
  },
  {
    header: '操作',
    cell: HandleAudio,
  },
]
