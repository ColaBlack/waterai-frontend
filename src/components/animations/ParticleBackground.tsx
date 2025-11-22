/**
 * 粒子背景动画组件
 * 创建动态的粒子效果背景
 */
'use client'

import React, { useEffect, useRef } from 'react'

interface ParticleBackgroundProps {
  particleCount?: number
  particleColor?: string
  lineColor?: string
  particleSize?: number
  speed?: number
  connectDistance?: number
  opacity?: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  particleCount = 80,
  particleColor = '#667eea',
  lineColor = '#667eea',
  particleSize = 2,
  speed = 0.5,
  connectDistance = 120,
  opacity = 0.6,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 初始化粒子
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius: particleSize,
        })
      }
    }
    initParticles()

    // 绘制粒子
    const drawParticle = (particle: Particle) => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      ctx.fillStyle = particleColor
      ctx.globalAlpha = opacity
      ctx.fill()
    }

    // 绘制连线
    const drawLine = (p1: Particle, p2: Particle, distance: number) => {
      const lineOpacity = (1 - distance / connectDistance) * opacity
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.strokeStyle = lineColor
      ctx.globalAlpha = lineOpacity
      ctx.lineWidth = 0.5
      ctx.stroke()
    }

    // 更新粒子位置
    const updateParticle = (particle: Particle) => {
      particle.x += particle.vx
      particle.y += particle.vy

      // 边界检测
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
    }

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current

      // 更新和绘制粒子
      particles.forEach((particle) => {
        updateParticle(particle)
        drawParticle(particle)
      })

      // 绘制连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectDistance) {
            drawLine(particles[i], particles[j], distance)
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [particleCount, particleColor, lineColor, particleSize, speed, connectDistance, opacity])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
