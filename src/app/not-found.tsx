'use client'

import React from 'react'
import { Button, Result } from 'antd'
import { useRouter } from 'next/navigation'
import GlobalLayout from '@/components/GlobalLayout'

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <GlobalLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Result
          status="404"
          title="404"
          subTitle="抱歉，您访问的页面不存在。"
          extra={
            <Button type="primary" onClick={() => router.push('/')}>
              返回首页
            </Button>
          }
        />
      </div>
    </GlobalLayout>
  )
}

