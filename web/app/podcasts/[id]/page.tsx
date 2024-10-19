'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import ViewEditPodcastShowForm from '@/components/ViewEditPodcastShowForm'
import { PodcastShow } from '@/types'
import { api } from '@/util'

const Page = () => {
  const { id } = useParams<{ id: string }>()
  const [show, setShow] = useState<PodcastShow>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getPodcastShow(Number(id))
      .then((data) => {
        setShow(data.data)
      })
      .catch((error) => {
        console.error('Failed to fetch podcast show', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  return show && <ViewEditPodcastShowForm type="View" show={show} />
}

export default Page
