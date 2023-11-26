'use client'
import { FC } from 'react'

interface Props {
  color?: string
  size?: number
}

export const Arrow: FC<Props> = ({ size = 24, color = 'black' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M7 11L12 6L17 11M12 18V7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
