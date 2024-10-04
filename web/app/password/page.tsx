'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState, useEffect } from 'react'
import { Copy } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

type Props = {}

const Password = (props: Props) => {
  const [password, setPassword] = useState('')

  const generateRandomPassword = () => {
    const length = 16
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-='
    let newPassword = ''
    for (let i = 0, n = charset.length; i < length; ++i) {
      newPassword += charset.charAt(Math.floor(Math.random() * n))
    }
    setPassword(newPassword)
  }

  useEffect(() => {
    generateRandomPassword()
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(password)
    toast({
      title: '密码已复制到剪贴板',
    })
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Input readOnly defaultValue={password} />
        <Button onClick={handleCopy}>
          <Copy />
        </Button>
      </div>
      <Button onClick={generateRandomPassword}>重新生成</Button>
    </div>
  )
}

export default Password
