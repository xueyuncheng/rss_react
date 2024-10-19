'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PodcastShow } from '@/types'

const formSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: '名称不能为空' }),
  address: z.string().min(1, { message: '地址不能为空' }),
  description: z.string().min(1, { message: '描述不能为空' }),
  image_url: z.string().min(1, { message: '图片地址不能为空' }),
  image_object_name: z.string().min(1, { message: '图片名称不能为空' }),
  updated_at: z.string().min(1, { message: '更新时间不能为空' }),
})

type Props = {
  type: 'View' | 'Update'
  show: PodcastShow
}

const ViewEditPodcastShowForm = ({ type, show }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    disabled: type === 'View',
    defaultValues: show,
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>名称</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>地址</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>图片地址</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_object_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>图片名称</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="updated_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>更新时间</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === 'View' ? (
          <Button asChild>
            <Link href="/podcasts">返回</Link>
          </Button>
        ) : (
          <Button type="submit">确定</Button>
        )}
      </form>
    </Form>
  )
}

export default ViewEditPodcastShowForm
