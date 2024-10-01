import React, { useState } from 'react'
import { mutate } from 'swr'
import { DefaultFetcher } from '../config/config'

const Domain = ({ hideModal }: { hideModal: () => void }) => {
  const [name, setName] = useState('')

  const handleSubmit = async () => {
    try {
      const response = await DefaultFetcher('/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name }), // replace with your data
      })

      if (response.err) {
        console.error('Error adding domain', response.err)
      }
    } catch (error) {
      console.error('Error adding domain', error)
    }

    mutate('/investments')
    hideModal()
  }

  return (
    <dialog className="modal modal-open ">
      <div className="modal-box">
        <div className="">
          <label className="block text-sm text-gray-700 font-bold mb-2">
            领域
          </label>
          <input
            type="text"
            className="input input-bordered w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex justify-end mt-4 space-x-4">
          <button className="btn btn-secondary" onClick={hideModal}>
            取消
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            提交
          </button>
        </div>
      </div>
    </dialog>
  )
}

type EditDomainProps = {
  id: number
  name: string
}

export const EditDomain = ({
  editDomainProps,
  hideModal,
}: {
  editDomainProps: EditDomainProps
  hideModal: () => void
}) => {
  const [editingName, setEditingName] = useState(editDomainProps.name)

  const handleSave = async () => {
    try {
      const response = await DefaultFetcher(`/domains/${editDomainProps.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editDomainProps.id,
          name: editingName,
        }),
      })

      if (response.err) {
        console.error('Error saving domain', response.err)
      }
    } catch (error) {
      console.error('Error saving domain', error)
    }

    hideModal()
    mutate('/investments')
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <div className="">
          <label className="block text-sm text-gray-700 font-bold mb-2">
            领域
          </label>
          <input
            type="text"
            value={editingName}
            className="input input-bordered w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            onChange={(e) => setEditingName(e.target.value)}
            onBlur={handleSave}
          />
        </div>
        <div className="flex justify-end mt-4 space-x-4">
          <button className="btn btn-secondary" onClick={hideModal}>
            取消
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            提交
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default Domain
