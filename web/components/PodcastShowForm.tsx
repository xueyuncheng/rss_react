'use client'

import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'

import { api } from '@/util'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

const formSchema = z.object({
  address: z.string().min(1, { message: '地址不能为空' }),
})

type Props = {
  type: 'View' | 'Create' | 'Update'
  onClose: () => void
}

const PodcastShowForm = (props: Props) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
    },
  })

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      const res = await api.addPodcastShow(formData)
      if (res.err) {
        toast({
          variant: 'destructive',
          title: '添加失败',
          description: res.err,
        })
      }
    } catch (error) {
      console.log(error)
      toast({
        title: '添加失败',
        variant: 'destructive',
      })
    } finally {
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>地址</FormLabel>
              <FormControl>
                <Input placeholder="请输入地址" {...field} />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? '提交中...' : '提交'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PodcastShowForm
