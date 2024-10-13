'use client'
import Grid from './grid'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import PodcastShowForm from '@/components/PodcastShowForm'
import { useEffect, useState } from 'react'
import { PodcastShow } from '@/types'
import { useSearchParams } from 'next/navigation'
import { api } from '@/util'
import { useToast } from '@/hooks/use-toast'

const Podcast = () => {
  const searchParams = useSearchParams()
  const pageNo = Number(searchParams.get('page_no')) || 1
  const pageSize = Number(searchParams.get('page_size')) || 10
  const showID = Number(searchParams.get('show_id')) || 0
  const [shows, setShows] = useState<PodcastShow[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const listShow = async () => {
    setLoading(true)
    try {
      const res = await api.listPodcastShow(pageNo, pageSize)
      setShows(res.data.items)
    } catch (error) {
      console.error('Failed to fetch podcast shows', error)
      toast({ title: '获取播客节目失败', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const handleClose = () => {
    setIsDialogOpen(false)
    listShow()
  }

  const handleDelete = async (id: number) => {
    try {
      await api.deletePodcastShow(id)
      toast({ title: '删除成功' })
      listShow()
    } catch (error) {
      console.error('Failed to delete podcast show', error)
    } finally {
    }
  }

  useEffect(() => {
    listShow()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant={'outline'} className="w-16">
              添加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加播客节目</DialogTitle>
              <DialogDescription>请填写播客节目信息</DialogDescription>
            </DialogHeader>
            <PodcastShowForm
              type="Create"
              onClose={handleClose}
            ></PodcastShowForm>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div>加载中...</div>
      ) : (
        <Grid shows={shows} onDelete={handleDelete} />
      )}
    </div>
  )
}

export default Podcast
