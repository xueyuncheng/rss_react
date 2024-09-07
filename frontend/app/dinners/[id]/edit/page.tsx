'use client'
import { useGetDinner } from '@/util'
import DinnerForm from '@/components/DinnerForm'
import { useParams } from 'next/navigation'
import React from 'react'

type Props = {}

const Page = (props: Props) => {
  const { id } = useParams<{ id: string }>()

  const { data, error, isLoading } = useGetDinner(Number(id))
  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  return <DinnerForm type="Update" dinner={data?.data} />
}

export default Page
