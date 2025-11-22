/**
 * 带动画效果的卡片组件
 */
'use client'

import { motion } from 'framer-motion'
import { Card, CardProps } from 'antd'
import { cardHover } from '@/lib/animations/variants'

interface AnimatedCardProps extends CardProps {
  children: React.ReactNode
  animationDisabled?: boolean
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  animationDisabled = false,
  ...props 
}) => {
  if (animationDisabled) {
    return <Card {...props}>{children}</Card>
  }

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={cardHover}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  )
}
