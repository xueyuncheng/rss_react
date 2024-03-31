import React, { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { DefaultFetcher, ResponsePage } from '../config/config'

type Domain = {
  id: number
  name: string
}

const AddInvestment = ({ hideModal }: { hideModal: () => void }) => {
  const [money, setMoney] = useState(0)
  const [domainID, setDomainID] = useState(0)
  const [domainName, setDomainName] = useState('')

  const { data, error } = useSWR<ResponsePage<Domain>>(
    '/domains',
    DefaultFetcher
  )

  useEffect(() => {
    if (data) {
      setDomainID(data.data.items[0].id)
      setDomainName(data.data.items[0].name)
    }
  }, [data])

  if (error) {
    return <div>Failed to load</div>
  }

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event?.preventDefault()
    console.log('submitting', money, domainID, domainName)
    try {
      const response = await DefaultFetcher('/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          money_yuan: money,
          domain_id: domainID,
          domain_name: domainName,
        }),
      })

      if (response.err) {
        console.error('Error adding investment item', response.err)
      }
    } catch (error) {
      console.error('Error adding investment item', error)
    }

    mutate('/investments')
    hideModal()
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box p-4 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              领域
            </label>
            <select
              className="select select-bordered w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => {
                const domain = data?.data.items.find(
                  (domain) => domain.id === Number(e.target.value)
                )
                setDomainID(domain?.id || 0)
                setDomainName(domain?.name || '')
              }}
            >
              {data?.data.items.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              金额(元):
            </label>
            <input
              type="number"
              className="input input-bordered w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}

type EditInvestmentProps = {
  id: number
  money_yuan: number
}

export const EditInvestment = ({
  editInvestmentProps,
  hideModal,
}: {
  editInvestmentProps: EditInvestmentProps
  hideModal: () => void
}) => {
  const [money, setMoney] = useState(editInvestmentProps.money_yuan)

  const handleSubmit = async () => {
    try {
      const response = await DefaultFetcher(
        `/investments/${editInvestmentProps.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editInvestmentProps.id,
            money_yuan: money,
          }),
        }
      )

      if (response.err) {
        console.error('Error adding domain', response.err)
      }
    } catch (error) {
      console.error('Error adding domain', error)
    }

    hideModal()
    mutate('/investments')
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <div className="">
          <label className="block text-sm text-gray-700 font-bold mb-2">
            金额
          </label>
          <input
            type="number"
            className="input input-bordered w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            value={money}
            onChange={(e) => setMoney(Number(e.target.value))}
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

export default AddInvestment
