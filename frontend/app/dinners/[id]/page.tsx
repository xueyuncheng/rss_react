'use client'
import { api } from '@/util'
import DinnerForm from '@/components/DinnerForm'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Dinner } from '@/types'

type Props = {}

const Page = (props: Props) => {
  const { id } = useParams<{ id: string }>()
  const [dinner, setDinner] = useState<Dinner>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getDinner(Number(id))
        setDinner(response.data)
      } catch (error) {
        alert(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <DinnerForm type="View" dinner={dinner} />
    </div>
  )
}

export default Page
