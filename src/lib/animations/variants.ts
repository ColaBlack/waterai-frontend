/**
 * Framer Motion 动画变体配置
 * 统一管理所有动画效果
 */

import { Variants } from 'framer-motion'

// 淡入动画
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
}

// 从下方滑入
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] // 自定义缓动函数
    }
  }
}

// 从上方滑入
export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
}

// 从左侧滑入
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.4,
      ease: 'easeOut'
    }
  }
}

// 从右侧滑入
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.4,
      ease: 'easeOut'
    }
  }
}

// 缩放动画
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

// 弹性缩放
export const scaleSpring: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
}

// 消息项动画（从左侧滑入 + 淡入）
export const messageItem: Variants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: { 
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 }
  }
}

// 侧边栏项动画
export const sidebarItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (index: number) => ({ 
    opacity: 1, 
    x: 0,
    transition: { 
      delay: index * 0.05, // 错开动画
      duration: 0.3
    }
  }),
  hover: {
    x: 4,
    transition: { duration: 0.2 }
  }
}

// 列表容器动画（子元素依次出现）
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 子元素间隔0.1秒
      delayChildren: 0.1
    }
  }
}

// 按钮悬停动画
export const buttonHover = {
  scale: 1.05,
  transition: { duration: 0.2 }
}

export const buttonTap = {
  scale: 0.95
}

// 卡片悬停动画
export const cardHover: Variants = {
  rest: { 
    scale: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
  },
  hover: { 
    scale: 1.02,
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    transition: { 
      duration: 0.3,
      ease: 'easeOut'
    }
  }
}

// 工具调用面板展开动画
export const expandPanel: Variants = {
  collapsed: { 
    height: 0,
    opacity: 0,
    transition: { duration: 0.3 }
  },
  expanded: { 
    height: 'auto',
    opacity: 1,
    transition: { 
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

// 打字机效果（流式文本）
export const typewriter: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.1
    }
  }
}

// 脉冲动画（加载指示器）
export const pulse: Variants = {
  initial: { scale: 1, opacity: 0.6 },
  animate: { 
    scale: [1, 1.2, 1],
    opacity: [0.6, 1, 0.6],
    transition: { 
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// 旋转动画（加载中）
export const rotate: Variants = {
  animate: { 
    rotate: 360,
    transition: { 
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
}

// 弹跳动画
export const bounce: Variants = {
  animate: { 
    y: [0, -10, 0],
    transition: { 
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// 闪烁动画
export const blink: Variants = {
  animate: { 
    opacity: [1, 0.3, 1],
    transition: { 
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// 渐变背景动画
export const gradientShift: Variants = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'linear'
    }
  }
}

// 页面过渡动画
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
}

// 模态框动画
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 }
  }
}

// 通知动画（从右侧滑入）
export const notification: Variants = {
  hidden: { opacity: 0, x: 100, scale: 0.8 },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: { duration: 0.2 }
  }
}

// 波纹效果
export const ripple: Variants = {
  initial: { scale: 0, opacity: 0.5 },
  animate: { 
    scale: 2,
    opacity: 0,
    transition: { duration: 0.6 }
  }
}

// 悬浮动画
export const float: Variants = {
  animate: { 
    y: [0, -8, 0],
    transition: { 
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// 震动动画（错误提示）
export const shake: Variants = {
  animate: { 
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
}

// 成功动画（勾选标记）
export const checkmark: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { 
    pathLength: 1,
    opacity: 1,
    transition: { 
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
}
