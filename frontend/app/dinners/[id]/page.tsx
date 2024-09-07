'use client'
import { useGetDinner, getDinner } from '@/util'
import DinnerForm from '@/components/DinnerForm'
import { useParams } from 'next/navigation'
import React from 'react'

type Props = {}

const Page = (props: Props) => {
  const { id } = useParams<{ id: string }>()

  // const { res } = getDinner(Number(id))

  // const { data, error, isLoading } = useSWR(id, getDinner)

  const { data, error, isLoading } = useGetDinner(Number(id))
  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <DinnerForm type="View" dinner={data?.data} />
    </div>
  )
}

export default Page
