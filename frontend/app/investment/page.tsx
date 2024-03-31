'use client'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { DefaultFetcher, Response } from '../config/config'
import Domain, { EditDomain } from './domain'
import AddInvestment, { EditInvestment } from './investment'

type Investment = {
  total_yuan: number
  domains: Domain[]
}

type Domain = {
  id: number
  name: string
  percent: number
  money_yuan: number
  items: Item[]
}

type Item = {
  id: number
  money_yuan: number
  tag_id: number
  tag_name: string
}

const Investment = () => {
  const [showDeleteDomain, setShowDeleteDomain] = useState(false)
  const [showAddDomain, setShowAddDomain] = useState(false)
  const [showEditDomain, setShowEditDomain] = useState(false)
  const [domainID, setDomainID] = useState(0)

  const [showAddInvestment, setShowAddInvestment] = useState(false)
  const [showDeleteInvestment, setShowDeleteInvestment] = useState(false)
  const [showEditInvestment, setShowEditInvestment] = useState(false)
  const [investmentID, setInvestmentID] = useState(0)

  const { data, error } = useSWR<Response<Investment>>(
    '/investments',
    DefaultFetcher
  )

  if (error) {
    return <div>Failed to load</div>
  }

  const handleAddDomain = async () => {
    try {
      const response = await DefaultFetcher('/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: '', percent: 0 }), // replace with your data
      })

      if (response.err) {
        console.error('Error adding domain', response.err)
      }
    } catch (error) {
      console.error('Error adding domain', error)
    }

    mutate('/investments')
  }

  const handleDeleteDomain = async (id: number) => {
    try {
      const response = await DefaultFetcher(`/domains/${id}`, {
        method: 'DELETE',
      })

      if (response.err) {
        console.error('Error deleting domain', response.err)
      }
    } catch (error) {
      console.error('Error deleting domain', error)
    }

    setShowDeleteDomain(false)
    mutate('/investments')
  }

  const handleDeleteInvestment = async (id: number) => {
    try {
      const response = await DefaultFetcher(`/investments/${id}`, {
        method: 'DELETE',
      })

      if (response.err) {
        console.error('Error deleting investment', response.err)
      }
    } catch (error) {
      console.error('Error deleting investment', error)
    }

    mutate('/investments')
    setShowDeleteInvestment(false)
  }

  return (
    <div className="flex flex-col items-center mt-10 ">
      <h1>Investment</h1>
      <div className="flex items-center justify-center space-x-4 mt-4">
        <button className="btn btn-xs" onClick={() => setShowAddDomain(true)}>
          新增领域
        </button>
        {showAddDomain && <Domain hideModal={() => setShowAddDomain(false)} />}
        <button
          className="btn btn-xs"
          onClick={() => setShowEditDomain(!showEditDomain)}
        >
          编辑领域
        </button>
        <button
          className="btn btn-xs"
          onClick={() => setShowDeleteDomain(!showDeleteDomain)}
        >
          删除领域
        </button>
      </div>
      <div className="flex items-center justify-center space-x-4 my-4">
        <button
          className="btn btn-xs"
          onClick={() => setShowAddInvestment(true)}
        >
          新增投资
        </button>
        {showAddInvestment && (
          <AddInvestment hideModal={() => setShowAddInvestment(false)} />
        )}
        <button
          className="btn btn-xs"
          onClick={() => {
            setShowEditInvestment(!showEditInvestment)
          }}
        >
          编辑投资
        </button>
        <button
          className="btn btn-xs"
          onClick={() => setShowDeleteInvestment(!showDeleteInvestment)}
        >
          删除投资
        </button>
      </div>

      <table className="table w-2/3">
        <thead>
          <tr>
            <td className="text-center">领域</td>
            <td className="text-center">占比</td>
            <td className="text-center">总计</td>
          </tr>
        </thead>
        <tbody>
          {data?.data.domains.map((domain) => {
            return (
              <tr key={domain.id} className="h-16 border-0">
                <td className="border text-center w-48">
                  <div>
                    {domain.name}
                    {showEditDomain && (
                      <button
                        className="btn btn-xs ml-4"
                        onClick={() => {
                          setDomainID(domain.id)
                        }}
                      >
                        编辑
                      </button>
                    )}
                    {domainID == domain.id && (
                      <EditDomain
                        editDomainProps={{
                          id: domain.id,
                          name: domain.name,
                        }}
                        hideModal={() => setDomainID(0)}
                      />
                    )}
                    {showDeleteDomain && (
                      <button
                        className="btn btn-xs ml-4"
                        onClick={() => handleDeleteDomain(domain.id)}
                      >
                        删除
                      </button>
                    )}
                  </div>
                </td>
                <td className="border text-center w-32">
                  {domain.percent.toFixed(2)}%
                </td>
                <td className="border text-center w-32 border-r-4 border-r-gray-200">
                  {domain.money_yuan}
                </td>

                {domain.items.map((item) => {
                  return (
                    <td key={item.id} className="border text-center w-32">
                      <div className="flex items-center justify-center space-x-4">
                        <div>{item.money_yuan}</div>
                        {showEditInvestment && (
                          <button
                            className="btn btn-xs"
                            onClick={() => {
                              setShowEditInvestment(true)
                              setInvestmentID(item.id)
                            }}
                          >
                            编辑
                          </button>
                        )}
                        {showEditInvestment && investmentID == item.id && (
                          <EditInvestment
                            editInvestmentProps={{
                              id: item.id,
                              money_yuan: item.money_yuan,
                            }}
                            hideModal={() => setInvestmentID(0)}
                          />
                        )}
                        {showDeleteInvestment && (
                          <button
                            className="btn btn-xs"
                            onClick={() => handleDeleteInvestment(item.id)}
                          >
                            删除
                          </button>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="mt-5 w-2/3">
        总金额(元):
        <span className="ml-2"> {data?.data.total_yuan}</span>
      </div>
    </div>
  )
}

export default Investment
