import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'accent-orange': '#d97757',
        'accent-orange-dark': '#c0624a',
        'cream': '#faf9f5',
        'cream-dark': '#f5f4ea',
        'text-primary': '#0a0a0a',
        'text-secondary': '#666666',
        'warm-gray': '#e8e7dd',
      },
      fontSize: {
        'display-lg': 'clamp(3rem, 6vw, 5rem)',
        'display-md': 'clamp(2.5rem, 5vw, 4rem)',
        'display-sm': 'clamp(2rem, 4vw, 3rem)',
      },
    },
  },
}

export default config
