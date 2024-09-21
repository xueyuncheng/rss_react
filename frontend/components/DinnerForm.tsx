'use client'

import React, { useState } from 'react'
import { Dinner } from '@/types'
import { api } from '@/util'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

const formSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: '名称不能为空' }),
  weight: z.number().int().min(1, { message: '权重必须大于0' }),
})

type Props = {
  type: 'View' | 'Create' | 'Update'
  dinner?: Dinner
}

const DinnerForm = (props: Props) => {
  const router = useRouter()

  const dinner = props.dinner || {
    id: 0,
    name: '',
    weight: 100,
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    disabled: props.type === 'View',
    defaultValues: {
      id: dinner.id,
      name: dinner.name,
      weight: dinner.weight,
    },
  })

  const { toast } = useToast()

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    if (props.type === 'Update') {
      try {
        const res = await api.updateDinner(formData)
      } catch (error) {
        alert(error)
      }
    }

    if (props.type === 'Create') {
      try {
        const res = await api.createDinner(formData)
      } catch (error) {
        alert(error)
      }
    }

    toast({ title: '成功', description: '保存成功' })

    router.push('/dinners')
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-center items-center space-y-4 mt-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>名称</FormLabel>
              <FormControl>
                <Input {...field}></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>权重</FormLabel>
              <FormControl>
                <Input {...field} type='number'></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {props.type === 'View' ? (
          <Link href="/dinners">
            <Button>返回</Button>
          </Link>
        ) : (
          <Button type="submit">确定</Button>
        )}
      </form>
    </Form>
  )
}

export default DinnerForm
