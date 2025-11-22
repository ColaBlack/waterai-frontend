'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { SAMPLE_QUESTIONS } from '@/lib/constants/chat'
import { staggerContainer, scaleIn } from '@/lib/animations/variants'

interface SampleQuestionsProps {
  onUseSample: (question: string) => void
}

export default function SampleQuestions({ onUseSample }: SampleQuestionsProps) {
  return (
    <div style={{
      marginTop: '32px',
      width: '100%',
      maxWidth: '600px',
    }}>
      <motion.h4
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          marginBottom: '16px',
          textAlign: 'center',
        }}
      >
        💡 示例问题
      </motion.h4>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '12px',
        }}
      >
        {SAMPLE_QUESTIONS.map((question, index) => (
          <motion.div
            key={index}
            variants={scaleIn}
            whileHover={{ 
              scale: 1.03,
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onUseSample(question)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              border: '1px solid #e5e6eb',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              transition: 'border-color 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e6eb'
            }}
          >
            {question}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}


