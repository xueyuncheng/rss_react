'use client'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { DefaultFetcher, ResponsePage } from '../config/config'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Draw = {
  id: number
  name: string
  data?: string
}

const Page = () => {
  const [editingID, setEditingID] = useState(0)
  const [editingName, setEditingName] = useState('')

  const { data, error, isLoading } = useSWR<ResponsePage<Draw>>(
    '/draws',
    DefaultFetcher
  )

  const router = useRouter()

  const handleCreate = async () => {
    try {
      const response = await DefaultFetcher('/draws', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'New Draw', data: '{}' }), // replace with your data
      })

      const draw: Draw = response.data

      router.push(`/draw/${draw.id}`)
    } catch (error) {
      console.error('Error creating draw', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await DefaultFetcher(`/draws/${id}`, {
        method: 'DELETE',
      })

      if (response.err) {
        console.error('Error deleting draw', response.err)
      }
    } catch (error) {
      console.error('Error deleting draw', error)
    }

    mutate('/draws')
  }

  const handleSave = async () => {
    const draw: Draw = {
      id: editingID,
      name: editingName,
    }
    const response = await DefaultFetcher(`/draws/${editingID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(draw),
    })

    if (response.err) {
      console.error('Error saving draw', response.err)
    }

    setEditingID(0)
    mutate('/draws')
  }

  return (
    <div className="flex flex-col items-center justify-center mt-5">
      <div className="flex justify-between w-1/2">
        <h2 className="mb-5">Draw列表</h2>
        <button className="btn btn-sm" onClick={handleCreate}>
          Create
        </button>
      </div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Failed to load</div>}
      {data && (
        <table className="table w-1/2">
          <thead>
            <tr>
              <th className="text-center">ID</th>
              <th className="text-center">Name</th>
              <th className="text-center">Operation</th>
            </tr>
          </thead>
          <tbody>
            {data.data.items.map((draw) => (
              <tr key={draw.id}>
                <td className="text-center">{draw.id}</td>
                <td className="text-center overflow-hidden text-ellipsis whitespace-nowrap w-48">
                  {editingID === draw.id ? (
                    <input
                      type="text"
                      value={editingName}
                      className="input input-bordered input-sm text-center"
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={handleSave}
                    />
                  ) : (
                    draw.name
                  )}
                </td>
                <td>
                  <div className="flex items-center justify-center space-x-2">
                    <Link
                      className="btn btn-sm"
                      href={`draw/${draw.id}`}
                      target="_blank"
                    >
                      Open
                    </Link>

                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        setEditingID(draw.id)
                        setEditingName(draw.name)
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm"
                      onClick={() => handleDelete(draw.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Page
