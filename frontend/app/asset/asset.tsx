'use client'
import React, { useState } from 'react'
import { DefaultFetcher } from '../config/config'
import { mutate } from 'swr'

export type Asset = {
  id: number
  date: string
  money_yuan: number
}

const AssetList = ({ items }: { items: Asset[] }) => {
  const [showModal, setShowModal] = useState(false)
  const [assetID, setAssetID] = useState(0)
  const [showOperationButton, setShowOperationButton] = useState(false)

  const deleteAsset = async (id: number) => {
    try {
      const response = await DefaultFetcher(`/assets/${id}`, {
        method: 'DELETE',
      })

      if (response.err) {
        console.error('Error deleting asset', response.err)
      }
    } catch (error) {
      console.error('Error deleting asset', error)
    }

    mutate('/assets')
  }

  return (
    <div className="text-center">
      <h2>Asset列表</h2>
      <div className="flex items-center justify-end space-x-2">
        <button
          className="btn btn-xs btn-primary"
          onClick={() => setShowModal(!showModal)}
        >
          添加
        </button>
        <button
          className="btn btn-xs btn-secondary"
          onClick={() => setShowOperationButton(!showOperationButton)}
        >
          编辑
        </button>
        {showModal && (
          <AssestModal
            assetProps={{ id: 0, date: '', money_yuan: 0 }}
            hideModal={() => setShowModal(!showModal)}
          />
        )}
      </div>
      <table className="table ">
        <thead>
          <tr>
            <th className="text-center">日期</th>
            <th className="text-center">金额</th>
            {showOperationButton && <th className="text-center">操作</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((asset) => (
            <tr key={asset.id}>
              <td className="text-center truncate">{asset.date}</td>
              <td className="text-center">{asset.money_yuan}</td>
              {showOperationButton && (
                <td>
                  <div className="flex space-x-2">
                    <button
                      className="btn btn-xs"
                      onClick={() => setAssetID(asset.id)}
                    >
                      编辑
                    </button>
                    {assetID === asset.id && (
                      <AssestModal
                        assetProps={asset}
                        hideModal={() => setAssetID(0)}
                      />
                    )}
                    <button
                      className="btn btn-xs"
                      onClick={() => deleteAsset(asset.id)}
                    >
                      删除
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const AssestModal = ({
  assetProps,
  hideModal,
}: {
  assetProps: Asset
  hideModal: () => void
}) => {
  const [date, setDate] = useState(assetProps.date)
  const [money, setMoney] = useState(assetProps.money_yuan)

  const handleSubmit = async () => {
    if (assetProps.id === 0) {
      await addAsset()
    } else {
      await updateAsset()
    }

    mutate('/assets')
    hideModal()
  }

  const addAsset = async () => {
    try {
      const response = await DefaultFetcher('/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          money_yuan: money,
        }),
      })

      if (response.err) {
        console.error('Error adding asset', response.err)
      }
    } catch (error) {
      console.error('Error adding asset', error)
    }
  }

  const updateAsset = async () => {
    try {
      const response = await DefaultFetcher(`/assets/${assetProps.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: assetProps.id,
          date,
          money_yuan: money,
        }),
      })

      if (response.err) {
        console.error('Error updating asset', response.err)
      }
    } catch (error) {
      console.error('Error updating asset', error)
    }
  }

  return (
    <dialog className="modal modal-open">
      <h2>添加资产</h2>
      <div className="modal-box">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            日期
          </label>
          <input
            type="date"
            className="input input-bordered w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            金额(元):
          </label>
          <input
            type="number"
            className="input input-bordered w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={money === 0 ? '' : money}
            onChange={(e) => setMoney(Number(e.target.value))}
          />
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={hideModal}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default AssetList
