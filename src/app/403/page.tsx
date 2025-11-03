'use client'

import React from 'react'
import { Button, Result } from 'antd'
import { useRouter } from 'next/navigation'
import GlobalLayout from '@/components/GlobalLayout'

export default function NoAuthPage() {
  const router = useRouter()

  return (
    <GlobalLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Result
          status="403"
          title="403"
          subTitle="抱歉，您没有权限访问此页面。"
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

