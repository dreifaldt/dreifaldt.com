import { FC } from 'react'

interface Props {
  size?: number
}

export const Arrow: FC<Props> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-white dark:text-black">
    <path
      d="M7 11L12 6L17 11M12 18V7"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)
