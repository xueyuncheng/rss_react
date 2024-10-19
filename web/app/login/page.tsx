'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

import { DefaultFetcher, Response } from '../config/config'

const Login = () => {
  const [name, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect_url = searchParams.get('redirect_url')

  const handleLogin = async () => {
    try {
      const response: Response<any> = await DefaultFetcher('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      })

      if (response.err) {
        console.error('Error logging in', response.err)
        return
      }

      console.log('success', response.data)
    } catch (error) {
      console.error('Error logging in', error)
      return
    }

    router.push(redirect_url || '/')
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 min-h-screen mx-auto">
      <div className="">
        <label>Username</label>
        <input
          type="text"
          className="input input-bordered w-full max-x-xs"
          onChange={(e) => setUsername(e.target.value)}
        ></input>
      </div>
      <div className="">
        <label>Password</label>
        <input
          type="password"
          className="input input-bordered w-full max-x-xs"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>
      <button className="btn btn-primary" onClick={handleLogin}>
        Login
      </button>
    </div>
  )
}

export default Login
