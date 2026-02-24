'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

// Variants for common animations
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: 'easeOut' }
}

// Motion component for div
interface MotionDivProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
}

export function MotionDiv({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Motion component for sections with scroll animations
interface MotionSectionProps extends HTMLMotionProps<'section'> {
  children: ReactNode
  className?: string
  viewport?: { once?: boolean; margin?: string }
  initial?: { opacity: number; y: number }
  whileInView?: { opacity: number; y: number }
}

export function MotionSection({ 
  children, 
  className, 
  viewport = { once: true, margin: '-100px' },
  initial = { opacity: 0, y: 30 },
  whileInView = { opacity: 1, y: 0 },
  ...props 
}: MotionSectionProps) {
  return (
    <motion.section
      className={className}
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      // Hint browser to optimize for scroll-triggered animations
      style={{ willChange: 'transform, opacity' }}
      {...props}
    >
      {children}
    </motion.section>
  )
}

// Motion component for cards with hover effects
interface MotionCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
}

export function MotionCard({ children, className, ...props }: MotionCardProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      // Use layout for smooth transform animations and prevent conflicts
      layout
      // Hint browser to optimize for transform changes
      style={{ willChange: 'transform, opacity' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Hero animation variants
export const heroVariants = {
  initial: {
    opacity: 0,
    y: 30
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      staggerChildren: 0.15
    }
  }
}

export const heroChildVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}
