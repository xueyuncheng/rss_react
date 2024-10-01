'use client'
import React, { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import AddNightSnackForm from '@/app/night_snack/AddNightSnackForm'
import EditNightSnackForm from '@/app/night_snack/EditNightSnackForm'
import List from '@/app/night_snack/List'
import { DefaultFetcher, ResponsePage } from '@/app/config/config'
import Modal from '@/app/night_snack/Modal'

type NightSnack = {
  id: number
  name: string
  weight: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const NightSnackComponent = () => {
  const [pageNo, setPageNo] = useState(1)
  const pageSize = 10

  const { data, error } = useSWR<ResponsePage<NightSnack>>(
    `/api/night_snacks?page_no=${pageNo}&page_size=${pageSize}`,
    fetcher
  )
  const [editingSnack, setEditingSnack] = useState<NightSnack | null>(null)
  const [showAddForm, setShowAddForm] = useState<boolean>(false)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const deleteItem = async (id: number) => {
    const response = await DefaultFetcher(`/night_snacks/${id}`, {
      method: 'DELETE',
    })
    if (response.err) {
      console.error('Error deleting asset', response.err)
    }
    mutate('/api/night_snacks')
  }

  const handleShowAddForm = () => {
    setShowAddForm(true)
  }

  const handleEditOption = (snack: NightSnack) => {
    setEditingSnack(snack)
  }

  const handleCloseEditForm = () => {
    setEditingSnack(null)
  }

  const totalPages = Math.ceil(data.data.total / pageSize)

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Dinner
        </h1>
        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            className="input input-bordered w-full text-center"
            placeholder="今晚吃什么"
            readOnly
          />
          <button className="btn btn-primary w-full" onClick={() => {}}>
            重新生成
          </button>
          <button
            className="btn btn-secondary w-full"
            onClick={handleShowAddForm}
          >
            添加
          </button>
        </div>
      </div>
      <Modal show={showAddForm} onClose={() => setShowAddForm(false)}>
        <AddNightSnackForm onClose={() => setShowAddForm(false)} />
      </Modal>
      <Modal show={!!editingSnack} onClose={handleCloseEditForm}>
        {editingSnack && (
          <EditNightSnackForm
            snack={editingSnack}
            onClose={handleCloseEditForm}
          />
        )}
      </Modal>
      <div className="mt-8 w-full max-w-md">
        <List
          night_snacks={data.data.items}
          onDelete={deleteItem}
          onEdit={handleEditOption}
        />
      </div>
      <div className="flex justify-center items-center space-x-2 mt-4 w-full max-w-md">
        <button
          className="btn btn-sm"
          onClick={() => pageNo > 1 && setPageNo(pageNo - 1)}
          disabled={pageNo === 1}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {pageNo} of {totalPages}
        </span>
        <button
          className="btn btn-sm"
          onClick={() => setPageNo(pageNo + 1)}
          disabled={pageNo === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default NightSnackComponent
