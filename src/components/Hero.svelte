<script lang="ts">
  let tagline = $state('')
  const fullTagline = 'Code with confidence.'
  let showCursor = $state(true)

  $effect(() => {
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

<section class="flex flex-col items-center justify-center min-h-screen px-4">
  <div class="text-center">
    <h1 class="hero-title font-mono font-bold tracking-tight">
      <span class="text-glow">Claude Code Captain</span>
      <sup class="superscript">C&#xB3;</sup>
    </h1>
    <div class="mt-6 font-mono text-lg md:text-xl text-cyan-400/80">
      <span class="terminal-prompt">$ </span>
      <span>{tagline}</span>
      <span class="cursor" class:opacity-0={!showCursor}>&#x2588;</span>
    </div>
  </div>
</section>

<style>
  .hero-title {
    font-size: clamp(2rem, 6vw, 4.5rem);
    line-height: 1.1;
  }

  .text-glow {
    color: #e2e8f0;
    text-shadow:
      0 0 20px rgba(34, 211, 238, 0.15),
      0 0 40px rgba(34, 211, 238, 0.08);
  }

  .superscript {
    font-size: 0.4em;
    color: #22d3ee;
    vertical-align: super;
    margin-left: 0.1em;
    text-shadow: 0 0 12px rgba(34, 211, 238, 0.4);
  }

  .terminal-prompt {
    color: #4ade80;
    text-shadow: 0 0 8px rgba(74, 222, 128, 0.3);
  }

  .cursor {
    color: #22d3ee;
    transition: opacity 0.1s;
  }

  .opacity-0 {
    opacity: 0;
  }
</style>
