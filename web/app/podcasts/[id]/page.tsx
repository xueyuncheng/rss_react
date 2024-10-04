'use client'
import { Label } from '@/components/ui/label'
import { Podcast } from '@/types'
import React, { useState } from 'react'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
})

const Page = () => {
  const initialPodcast: Podcast = {
    id: 0,
    title: 'Tech Talks: Exploring the Future',
    description:
      'A comprehensive podcast that delves into the intricacies of modern technology, exploring the latest trends, innovations, and insights from industry experts. Each episode features in-depth discussions, interviews, and analyses that cater to tech enthusiasts, professionals, and anyone interested in the ever-evolving world of technology. Join us as we uncover the stories behind the tech that shapes our lives and the future.',
    image_url: 'xx',
    updated_at: '',
  }

  const [podcast, setPodcast] = useState<Podcast>(initialPodcast)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    disabled: true,
    defaultValues: podcast,
  })

  function onSubmit(data: z.infer<typeof formSchema>) {}

  return (
    <Form {...form}>
      <form className="w-full space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标题</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
                <Textarea {...field} className="min-h-32" />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" asChild>
          <Link href="/podcasts">确定</Link>
        </Button>
      </form>
    </Form>
  )
}

export default Page
