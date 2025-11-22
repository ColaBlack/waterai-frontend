'use client'

import React from 'react'
import { Empty } from 'antd'
import { CommentOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { fadeIn, float } from '@/lib/animations/variants'
import { GradientText } from '@/components/animations/GradientText'
import SampleQuestions from './SampleQuestions'

interface EmptyStateProps {
  onUseSample?: (question: string) => void
}

export default function EmptyState({ onUseSample }: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <Empty
        image={
          <motion.div variants={float} animate="animate">
            <CommentOutlined style={{ fontSize: '64px', color: '#667eea' }} />
          </motion.div>
        }
        description={
          <div>
            <GradientText>
              <h3 style={{ margin: '16px 0 8px' }}>开始新的对话</h3>
            </GradientText>
            <p style={{ color: '#999', margin: 0 }}>请输入您的问题，或点击下方示例问题</p>
          </div>
        }
      />
      {onUseSample && <SampleQuestions onUseSample={onUseSample} />}
    </motion.div>
  )
}
