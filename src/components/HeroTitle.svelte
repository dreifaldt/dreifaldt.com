<script lang="ts">
  interface Props {
    text: string
    onComplete: () => void
  }

  const { text, onComplete }: Props = $props()

  const chars = '!@#$%^&*_-+=<>?/|'
  let displayText = $state('')
  let revealed = $state(0)
  let glitching = $state(false)

  $effect(() => {
    let tick = 0

    const interval = setInterval(() => {
      tick++

      let result = ''
      for (let i = 0; i < text.length; i++) {
        if (i < revealed) {
          result += text[i]
        } else if (text[i] === ' ') {
          result += ' '
        } else {
          result += chars[Math.floor(Math.random() * chars.length)]
        }
      }
      displayText = result

      if (tick % 3 === 0) {
        revealed++
      }

      if (revealed >= text.length) {
        clearInterval(interval)
        displayText = text
        glitching = true
        setTimeout(() => {
          glitching = false
          onComplete()
        }, 300)
      }
    }, 40)

    return () => {
      clearInterval(interval)
    }
  })
</script>

<h1
  class="hero-title font-mono font-bold tracking-tight text-glow"
  class:glitch={glitching}
>
  {displayText}
</h1>

<style>
  .hero-title {
    font-size: clamp(2rem, 6vw, 4.5rem);
    line-height: 1.1;
  }

  .text-glow {
    color: #e2e8f0;
    text-shadow:
      0 0 10px rgba(34, 211, 238, 0.2),
      0 0 20px rgba(34, 211, 238, 0.15),
      0 0 40px rgba(34, 211, 238, 0.08),
      0 0 80px rgba(34, 211, 238, 0.04);
    animation: glow-pulse 4s ease-in-out infinite;
  }

  @keyframes glow-pulse {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.08); }
  }

  .glitch {
    animation: glitch-effect 0.3s ease-out;
  }

  @keyframes glitch-effect {
    0% {
      clip-path: inset(20% 0 30% 0);
      transform: translate(-2px, 1px);
    }
    25% {
      clip-path: inset(50% 0 10% 0);
      transform: translate(2px, -1px);
    }
    50% {
      clip-path: inset(10% 0 60% 0);
      transform: translate(-1px, 2px);
    }
    75% {
      clip-path: inset(40% 0 20% 0);
      transform: translate(1px, -2px);
    }
    100% {
      clip-path: none;
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .text-glow {
      animation: none;
    }
    .glitch {
      animation: none;
    }
  }
</style>
