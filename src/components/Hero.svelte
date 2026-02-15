<script lang="ts">
  import HeroBackground from './HeroBackground.svelte'
  import HeroTitle from './HeroTitle.svelte'
  import ScrollIndicator from './ScrollIndicator.svelte'

  let titleDone = $state(false)
  let tagline = $state('')
  const fullTagline = 'Code with confidence.'
  let showCursor = $state(true)

  function scrollToGuide() {
    document.getElementById('what-is-ai')?.scrollIntoView({ behavior: 'smooth' })
  }

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
<section id="hero" class="hero relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden cursor-pointer" onclick={scrollToGuide}>
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
