/**
 * 加载动画 - 跳动的点
 */
'use client'

import { motion } from 'framer-motion'

interface LoadingDotsProps {
  size?: number
  color?: string
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ 
  size = 8, 
  color = '#1890ff' 
}) => {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -10 }
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: size / 2,
    alignItems: 'center',
    justifyContent: 'center'
  }

  const dotStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: color
  }

  return (
    <div style={containerStyle}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          style={dotStyle}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: index * 0.15
          }}
        />
      ))}
    </div>
  )
}
