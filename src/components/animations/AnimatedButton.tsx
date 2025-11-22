/**
 * 带动画效果的按钮组件
 */
'use client'

import { motion } from 'framer-motion'
import { Button, ButtonProps } from 'antd'
import { buttonHover, buttonTap } from '@/lib/animations/variants'

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode
  animationDisabled?: boolean
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  animationDisabled = false,
  ...props 
}) => {
  if (animationDisabled) {
    return <Button {...props}>{children}</Button>
  }

  return (
    <motion.div
      whileHover={buttonHover}
      whileTap={buttonTap}
      style={{ display: 'inline-block' }}
    >
      <Button {...props}>{children}</Button>
    </motion.div>
  )
}
