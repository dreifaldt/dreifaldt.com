<script lang="ts">
  import HeroBackground from './HeroBackground.svelte'
  import HeroTitle from './HeroTitle.svelte'
  import ScrollIndicator from './ScrollIndicator.svelte'

  let titleDone = $state(false)
  let tagline = $state('')
  const fullTagline = 'Code with confidence.'
  let showCursor = $state(true)
  let easterEggActive = $state(false)
  let keystrokeShake = $state(false)

  const SECRET = 'ai'
  let buffer = ''
  let shakeTimer: ReturnType<typeof setTimeout> | undefined

  function scrollToGuide() {
    document.getElementById('what-is-ai')?.scrollIntoView({ behavior: 'smooth' })
  }

  function triggerKeystrokeShake() {
    keystrokeShake = false
    clearTimeout(shakeTimer)
    requestAnimationFrame(() => {
      keystrokeShake = true
      shakeTimer = setTimeout(() => { keystrokeShake = false }, 200)
    })
  }

  function triggerEasterEgg() {
    keystrokeShake = false
    easterEggActive = true
    setTimeout(() => {
      window.open('https://www.youtube.com/shorts/9KwHJueAbiA', '_blank')
      easterEggActive = false
    }, 800)
  }

  $effect(() => {
    function onKeydown(e: KeyboardEvent) {
      const key = e.key.toLowerCase()
      const nextExpected = SECRET[buffer.length]
      if (key === nextExpected) {
        buffer += key
        triggerKeystrokeShake()
        if (key === 'a') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        if (buffer === SECRET) {
          buffer = ''
          triggerEasterEgg()
        }
      } else {
        buffer = key === SECRET[0] ? key : ''
        if (key === 'a') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    }
    window.addEventListener('keydown', onKeydown)
    return () => {
      window.removeEventListener('keydown', onKeydown)
      clearTimeout(shakeTimer)
    }
  })

  $effect(() => {
    if (!titleDone) return

    let i = 0
    const typing = setInterval(() => {
      if (i < fullTagline.length) {
        tagline = fullTagline.slice(0, i + 1)
        i++
      } else {
        clearInterval(typing)
      }
    }, 50)

    const blink = setInterval(() => {
      showCursor = !showCursor
    }, 530)

    return () => {
      clearInterval(typing)
      clearInterval(blink)
    }
  })
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<section id="hero" class="hero relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden cursor-pointer" class:easter-egg-glitch={easterEggActive} class:ee-keystroke-shake={keystrokeShake} onclick={scrollToGuide}>
  <HeroBackground />

  <div class="relative z-10 text-center">
    <HeroTitle text="Become a Claude Code Captain" onComplete={() => titleDone = true} />
    <div class="mt-6 font-mono text-lg md:text-xl text-cyan-400/80">
      <span class="terminal-prompt">$ </span>
      <span>{tagline}</span>
      <span class="cursor" class:opacity-0={!showCursor}>&#x2588;</span>
    </div>
  </div>

  <ScrollIndicator />
</section>

<style>
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.03) 2px,
      rgba(255, 255, 255, 0.03) 4px
    );
    z-index: 2;
    pointer-events: none;
  }

  .hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 50%,
      rgba(0, 0, 0, 0.4) 100%
    );
    z-index: 2;
    pointer-events: none;
  }

  .ee-keystroke-shake {
    animation: ee-shake 0.2s ease-out;
  }

  @keyframes ee-shake {
    0% { transform: translate(0); filter: hue-rotate(0deg); }
    25% { transform: translate(-2px, 1px); filter: hue-rotate(30deg) brightness(1.2); }
    50% { transform: translate(2px, -1px); filter: hue-rotate(-30deg) brightness(0.9); }
    75% { transform: translate(-1px, -1px); filter: hue-rotate(15deg) brightness(1.1); }
    100% { transform: translate(0); filter: hue-rotate(0deg) brightness(1); }
  }

  .easter-egg-glitch {
    animation: ee-glitch 0.8s ease-out;
  }

  @keyframes ee-glitch {
    0% { filter: hue-rotate(0deg) brightness(1); transform: translate(0); }
    10% { filter: hue-rotate(90deg) brightness(1.5); transform: translate(-3px, 2px); }
    20% { filter: hue-rotate(180deg) brightness(0.8); transform: translate(3px, -2px); }
    30% { filter: hue-rotate(270deg) brightness(1.3); transform: translate(-2px, -1px); }
    40% { filter: hue-rotate(360deg) brightness(1.6); transform: translate(2px, 1px); }
    50% { filter: hue-rotate(180deg) brightness(0.6); transform: translate(-1px, 3px); }
    60% { filter: hue-rotate(90deg) brightness(1.4); transform: translate(1px, -3px); }
    80% { filter: hue-rotate(45deg) brightness(1.1); transform: translate(0); }
    100% { filter: hue-rotate(0deg) brightness(1); transform: translate(0); }
  }

  .terminal-prompt {
    color: #4ade80;
    text-shadow:
      0 0 8px rgba(74, 222, 128, 0.3),
      0 0 16px rgba(74, 222, 128, 0.15);
  }

  .cursor {
    color: #22d3ee;
    transition: opacity 0.1s;
  }

  .opacity-0 {
    opacity: 0;
  }
</style>
