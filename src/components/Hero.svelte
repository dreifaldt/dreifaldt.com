<script lang="ts">
  import HeroBackground from './HeroBackground.svelte'

  // ── ROTATING TAGLINES ──────────────────────────────────────────────────────
  const taglines = [
    'I BUILD THINGS THAT LAST.',
    'I SHIP BEFORE DEADLINES.',
    'I WRITE TESTS. SOMETIMES.',
    'YES, I READ THE DOCS.',
    'I DON\'T BREAK PROD. MUCH.',
    'HIRE ME OR REGRET IT.',
  ]
  let tagIdx = $state(0)
  let tagVisible = $state(true)

  $effect(() => {
    const iv = setInterval(() => {
      tagVisible = false
      setTimeout(() => {
        tagIdx = (tagIdx + 1) % taglines.length
        tagVisible = true
      }, 280)
    }, 2600)
    return () => clearInterval(iv)
  })

  // ── SKILL CARDS ────────────────────────────────────────────────────────────
  type Card = {
    num: string
    label: string
    sub: string
    items: string[]
    x: string
    y: string
    fd: string
    tone: number
  }

  const cards: Card[] = [
    {
      num: '01',
      label: 'FULL-STACK',
      sub: 'Web · Backend · APIs',
      items: ['TypeScript', 'Python', 'Svelte', 'Astro', 'Node.js'],
      x: '54%',
      y: '17%',
      fd: '0s',
      tone: 261,
    },
    {
      num: '02',
      label: 'MOBILE',
      sub: 'iOS · watchOS',
      items: ['Swift', 'SwiftUI', 'iOS', 'watchOS'],
      x: '72%',
      y: '30%',
      fd: '0.7s',
      tone: 330,
    },
    {
      num: '03',
      label: 'SYSTEMS',
      sub: 'Infra · Data · Events',
      items: ['Kafka', 'Docker', 'PostgreSQL', 'Event-driven arch'],
      x: '60%',
      y: '56%',
      fd: '1.4s',
      tone: 392,
    },
    {
      num: '04',
      label: 'CONSULTING',
      sub: 'Dreifaldt Consulting AB',
      items: ['Embedded in teams', 'End-to-end delivery', '[Add your clients]'],
      x: '40%',
      y: '44%',
      fd: '0.4s',
      tone: 440,
    },
    {
      num: '05',
      label: 'AI / LLMs',
      sub: 'Agents · Automation',
      items: ['Claude', 'Agent systems', 'Workflow design', 'Prompt engineering'],
      x: '76%',
      y: '65%',
      fd: '1.1s',
      tone: 523,
    },
  ]

  let activeCard = $state<string | null>(null)
  let discovered = $state<string[]>([])
  let allFound = $state(false)
  let allFoundMsg = $state(false)

  // Per-card 3D tilt
  let tilts = $state<Record<string, { rx: number; ry: number }>>({})

  function onCardEnter(c: Card) {
    activeCard = c.num
    if (!discovered.includes(c.num)) {
      discovered = [...discovered, c.num]
      playTone(c.tone)
      if (discovered.length + 1 === cards.length) {
        // will be updated next tick; handle in $effect
      }
    }
  }

  function onCardMove(e: MouseEvent, num: string) {
    const el = e.currentTarget as HTMLElement
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    tilts[num] = { rx: y * -20, ry: x * 20 }
  }

  function onCardLeave(num: string) {
    activeCard = null
    tilts[num] = { rx: 0, ry: 0 }
  }

  $effect(() => {
    if (discovered.length === cards.length && !allFound) {
      allFound = true
      setTimeout(() => {
        playChord([261, 330, 392, 523, 659])
        allFoundMsg = true
        setTimeout(() => {
          allFoundMsg = false
        }, 3200)
      }, 200)
    }
  })

  // ── WEB AUDIO ──────────────────────────────────────────────────────────────
  function playTone(freq: number, dur = 0.35, vol = 0.07) {
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      gain.gain.setValueAtTime(vol, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
      osc.start()
      osc.stop(ctx.currentTime + dur)
    } catch {
      // no audio context — fine
    }
  }

  function playChord(freqs: number[]) {
    freqs.forEach((f, i) => setTimeout(() => playTone(f, 0.5, 0.06), i * 55))
  }

  // ── PING + PARTICLES ───────────────────────────────────────────────────────
  type Particle = { id: number; x: number; y: number; dx: number; dy: number }
  type PingState = 'idle' | 'sending' | 'sent' | 'error'

  let pingState = $state<PingState>('idle')
  let particles = $state<Particle[]>([])
  let screenFlash = $state(false)

  async function ping(e: MouseEvent) {
    if (pingState !== 'idle') return
    pingState = 'sending'

    // particles burst from button center
    const btn = e.currentTarget as HTMLElement
    const r = btn.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    particles = Array.from({ length: 28 }, (_, i) => {
      const angle = (i / 28) * Math.PI * 2
      const dist = 50 + Math.random() * 80
      return {
        id: Date.now() + i,
        x: cx,
        y: cy,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
      }
    })
    screenFlash = true
    setTimeout(() => {
      screenFlash = false
      particles = []
    }, 700)

    playChord([261, 330, 392, 523])

    try {
      const res = await fetch('/api/ping', { method: 'POST' })
      const data = (await res.json()) as { ok: boolean }
      pingState = data.ok ? 'sent' : 'error'
    } catch {
      pingState = 'error'
    }

    if (pingState === 'error') {
      setTimeout(() => {
        window.location.href = 'mailto:erik@dreifaldt.com?subject=Let%27s%20talk'
        pingState = 'idle'
      }, 1200)
    }
  }

  const pingLabel = $derived(
    pingState === 'idle'
      ? 'PING ME →'
      : pingState === 'sending'
        ? 'SENDING...'
        : pingState === 'sent'
          ? '👁  THEY KNOW'
          : 'EMAIL ME →',
  )

  // ── CUSTOM CURSOR ──────────────────────────────────────────────────────────
  let cx = $state(-100)
  let cy = $state(-100)
  let cursorOnCard = $state(false)

  $effect(() => {
    const mv = (e: MouseEvent) => {
      cx = e.clientX
      cy = e.clientY
    }
    window.addEventListener('mousemove', mv)
    return () => window.removeEventListener('mousemove', mv)
  })

  // ── EASTER EGG: type "hire" ────────────────────────────────────────────────
  let buf = ''
  let eggActive = $state(false)

  $effect(() => {
    const onKey = (e: KeyboardEvent) => {
      buf = (buf + e.key.toLowerCase()).slice(-8)
      if (buf.includes('hire')) {
        buf = ''
        eggActive = true
        playChord([523, 659, 784, 1047])
        setTimeout(() => {
          eggActive = false
        }, 2800)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function cardTiltStyle(num: string, active: boolean): string {
    const t = tilts[num]
    if (!t || !active) return ''
    return `transform: translate(-50%, -50%) perspective(500px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(1.08);`
  }
</script>

<!-- ── CUSTOM CURSOR ────────────────────────────────────────────────────────── -->
<div
  class="cursor"
  class:cursor-card={cursorOnCard}
  style="left:{cx}px; top:{cy}px"
></div>

<!-- ── SCREEN FLASH ─────────────────────────────────────────────────────────── -->
{#if screenFlash}
  <div class="screen-flash"></div>
{/if}

<!-- ── PARTICLES ────────────────────────────────────────────────────────────── -->
{#each particles as p (p.id)}
  <div
    class="particle"
    style="left:{p.x}px; top:{p.y}px; --dx:{p.dx}px; --dy:{p.dy}px"
  ></div>
{/each}

<!-- ── EASTER EGG OVERLAY ────────────────────────────────────────────────────── -->
{#if eggActive}
  <div class="egg-overlay">
    <p class="egg-text">SMART.</p>
    <p class="egg-sub">NOW DO SOMETHING ABOUT IT.</p>
  </div>
{/if}

<!-- ── ALL-FOUND OVERLAY ─────────────────────────────────────────────────────── -->
{#if allFoundMsg}
  <div class="egg-overlay">
    <p class="egg-text">NICE.</p>
    <p class="egg-sub">NOW HIRE HIM.</p>
  </div>
{/if}

<!-- ── MAIN SCENE ────────────────────────────────────────────────────────────── -->
<div class="scene" class:scene-egg={eggActive || allFoundMsg}>
  <HeroBackground />

  <!-- NAV -->
  <nav class="nav">
    <span class="nav-name">ERIK DREIFALDT</span>
    <span class="nav-counter">
      SKILLS FOUND
      <span class="counter-val" class:counter-done={allFound}>
        {discovered.length}/{cards.length}
      </span>
    </span>
  </nav>

  <!-- FLOATING SKILL CARDS -->
  {#each cards as card}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="card"
      class:card-on={activeCard === card.num}
      class:card-found={discovered.includes(card.num)}
      style="
        --cx: {card.x};
        --cy: {card.y};
        --fd: {card.fd};
        {cardTiltStyle(card.num, activeCard === card.num)}
      "
      onmouseenter={() => { onCardEnter(card); cursorOnCard = true }}
      onmousemove={(e) => onCardMove(e, card.num)}
      onmouseleave={() => { onCardLeave(card.num); cursorOnCard = false }}
    >
      <div class="card-head">
        <span class="card-num">{card.num}</span>
        <span class="card-label">{card.label}</span>
        {#if discovered.includes(card.num)}
          <span class="card-check">✓</span>
        {/if}
      </div>
      <p class="card-sub">{card.sub}</p>
      <div class="card-items">
        {#each card.items as item, i}
          <span class="card-item" style="--di: {i * 40}ms">{item}</span>
        {/each}
      </div>
    </div>
  {/each}

  <!-- HEADLINE + CONTROLS -->
  <div class="headline-block">
    <p class="eyebrow">↓ SOFTWARE ENGINEER & CONSULTANT</p>

    <h1 class="headline" class:tag-out={!tagVisible} class:tag-in={tagVisible}>
      {taglines[tagIdx]}
    </h1>

    <div class="cta-row">
      <button
        class="ping-btn"
        class:btn-sending={pingState === 'sending'}
        class:btn-sent={pingState === 'sent'}
        class:btn-error={pingState === 'error'}
        disabled={pingState !== 'idle'}
        onclick={ping}
        onmouseenter={() => (cursorOnCard = true)}
        onmouseleave={() => (cursorOnCard = false)}
      >
        {pingLabel}
      </button>
      <a
        class="txt-link"
        href="https://www.linkedin.com/in/erik-dreifaldt"
        target="_blank"
        rel="noopener noreferrer"
      >LINKEDIN ↗</a>
      <a class="txt-link" href="mailto:erik@dreifaldt.com">EMAIL ↗</a>
    </div>

    <p class="ping-note">
      Real Kafka message → my local stream. I'll see it.
      <span class="egg-hint">try typing "hire"</span>
    </p>
  </div>

  <!-- BOTTOM BAR -->
  <footer class="bar">
    <span>DREIFALDT CONSULTING AB</span>
    <span class="dot">·</span>
    <span>SWEDEN</span>
    <span class="dot">·</span>
    <span class="bar-hint">HOVER THE CARDS →</span>
    <span class="dot">·</span>
    <a href="mailto:erik@dreifaldt.com">ERIK@DREIFALDT.COM</a>
  </footer>
</div>

<!-- ── MOBILE ────────────────────────────────────────────────────────────────── -->
<div class="mob">
  <HeroBackground />
  <nav class="nav">
    <span class="nav-name">ERIK DREIFALDT</span>
    <span class="nav-meta">
      <span class="live-dot"></span>OPEN
    </span>
  </nav>
  <div class="mob-body">
    <p class="eyebrow">↓ SOFTWARE ENGINEER & CONSULTANT</p>
    <h1 class="headline mob-h1">I BUILD<br />THINGS<br />THAT LAST.</h1>
    <div class="mob-cards">
      {#each cards as card}
        <div class="mob-card">
          <div class="card-head">
            <span class="card-num">{card.num}</span>
            <span class="card-label">{card.label}</span>
          </div>
          <div class="mob-items">
            {#each card.items as item}
              <span class="mob-item">{item}</span>
            {/each}
          </div>
        </div>
      {/each}
    </div>
    <div class="cta-row">
      <button
        class="ping-btn"
        class:btn-sent={pingState === 'sent'}
        disabled={pingState !== 'idle'}
        onclick={ping}
      >{pingLabel}</button>
      <a class="txt-link" href="https://www.linkedin.com/in/erik-dreifaldt" target="_blank" rel="noopener noreferrer">LINKEDIN ↗</a>
    </div>
  </div>
</div>

<style>
  /* ── GLOBAL ────────────────────────────────────────────────── */
  :global(body) {
    cursor: none;
  }

  /* ── CURSOR ────────────────────────────────────────────────── */
  .cursor {
    position: fixed;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #c8f000;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition:
      width 0.15s ease,
      height 0.15s ease,
      opacity 0.15s ease;
    mix-blend-mode: difference;
  }

  .cursor-card {
    width: 36px;
    height: 36px;
    background: rgba(200, 240, 0, 0.15);
    border: 1px solid #c8f000;
  }

  /* ── SCREEN FLASH ──────────────────────────────────────────── */
  .screen-flash {
    position: fixed;
    inset: 0;
    background: #c8f000;
    pointer-events: none;
    z-index: 8000;
    animation: flash 0.5s ease-out forwards;
  }

  @keyframes flash {
    0% {
      opacity: 0.45;
    }
    100% {
      opacity: 0;
    }
  }

  /* ── PARTICLES ─────────────────────────────────────────────── */
  .particle {
    position: fixed;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #c8f000;
    pointer-events: none;
    z-index: 7999;
    transform: translate(-50%, -50%);
    animation: pout 0.7s ease-out forwards;
  }

  @keyframes pout {
    0% {
      transform: translate(-50%, -50%) translate(0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(0);
      opacity: 0;
    }
  }

  /* ── EASTER EGG / ALL-FOUND OVERLAY ───────────────────────── */
  .egg-overlay {
    position: fixed;
    inset: 0;
    z-index: 7900;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(200, 240, 0, 0.06);
    pointer-events: none;
    animation: egg-in 0.3s ease-out;
  }

  @keyframes egg-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .egg-text {
    font-family: 'Barlow', sans-serif;
    font-size: clamp(4rem, 12vw, 10rem);
    font-weight: 900;
    color: #c8f000;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .egg-sub {
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.25em;
    color: rgba(200, 240, 0, 0.7);
    margin-top: 0.75rem;
  }

  /* ── SCENE ─────────────────────────────────────────────────── */
  .scene {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: #080a12;
    transition: filter 0.3s ease;
  }

  .scene-egg {
    filter: brightness(0.6);
  }

  @media (max-width: 768px) {
    .scene {
      display: none;
    }
  }

  /* ── NAV ───────────────────────────────────────────────────── */
  .nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.75rem 2.5rem;
  }

  .nav-name {
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.22em;
    color: #fff;
  }

  .nav-counter {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .counter-val {
    color: rgba(200, 240, 0, 0.5);
    transition: color 0.3s ease;
  }

  .counter-done {
    color: #c8f000;
  }

  .nav-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.35);
  }

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #c8f000;
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.25;
    }
  }

  /* ── SKILL CARDS ───────────────────────────────────────────── */
  .card {
    position: absolute;
    left: var(--cx);
    top: var(--cy);
    transform: translate(-50%, -50%);
    z-index: 20;
    padding: 1rem 1.25rem;
    background: rgba(8, 10, 18, 0.78);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 10px;
    backdrop-filter: blur(14px);
    min-width: 140px;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background 0.2s ease;
    animation: float var(--fd) 4s ease-in-out infinite;
    animation-delay: var(--fd);
    will-change: transform;
  }

  .card-found {
    border-color: rgba(200, 240, 0, 0.18);
  }

  .card-on {
    border-color: rgba(200, 240, 0, 0.6) !important;
    background: rgba(8, 10, 18, 0.97) !important;
    box-shadow:
      0 0 0 1px rgba(200, 240, 0, 0.2),
      0 12px 40px rgba(200, 240, 0, 0.12),
      0 0 60px rgba(200, 240, 0, 0.05);
    animation-play-state: paused;
    z-index: 25;
  }

  @keyframes float {
    0%,
    100% {
      transform: translate(-50%, -50%) translateY(0);
    }
    50% {
      transform: translate(-50%, -50%) translateY(-10px);
    }
  }

  .card-head {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    margin-bottom: 0.3rem;
  }

  .card-num {
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: #c8f000;
  }

  .card-label {
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    color: #fff;
  }

  .card-check {
    font-size: 0.55rem;
    color: #c8f000;
    margin-left: auto;
  }

  .card-sub {
    font-size: 0.57rem;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.28);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.22s ease, margin-bottom 0.22s ease;
  }

  .card-on .card-sub {
    max-height: 2rem;
    margin-bottom: 0.65rem;
  }

  .card-items {
    display: flex;
    flex-direction: column;
    gap: 0.22rem;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .card-on .card-items {
    max-height: 200px;
  }

  .card-item {
    font-size: 0.68rem;
    letter-spacing: 0.06em;
    color: rgba(255, 255, 255, 0.5);
    animation: none;
    opacity: 0;
  }

  .card-on .card-item {
    animation: item-in 0.25s ease-out var(--di, 0ms) forwards;
  }

  @keyframes item-in {
    from {
      opacity: 0;
      transform: translateX(-6px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* ── HEADLINE BLOCK ────────────────────────────────────────── */
  .headline-block {
    position: absolute;
    bottom: 4.5rem;
    left: 2.5rem;
    z-index: 20;
    max-width: 44%;
  }

  .eyebrow {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    color: #c8f000;
    margin-bottom: 0.875rem;
  }

  .headline {
    font-family: 'Barlow', sans-serif;
    font-size: clamp(2.8rem, 6.5vw, 5.5rem);
    font-weight: 900;
    line-height: 0.93;
    letter-spacing: -0.02em;
    color: #fff;
    margin-bottom: 2rem;
    transition:
      opacity 0.28s ease,
      transform 0.28s ease;
  }

  .tag-out {
    opacity: 0;
    transform: translateY(8px);
  }

  .tag-in {
    opacity: 1;
    transform: translateY(0);
  }

  .cta-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-bottom: 0.875rem;
  }

  .ping-btn {
    padding: 0.82rem 1.75rem;
    background: #c8f000;
    color: #080a12;
    font-family: 'Barlow', sans-serif;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.18em;
    border: none;
    border-radius: 5px;
    cursor: none;
    transition: all 0.18s ease;
  }

  .ping-btn:hover:not(:disabled) {
    background: #d8ff00;
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(200, 240, 0, 0.35);
  }

  .ping-btn:disabled {
    cursor: default;
  }

  .btn-sending {
    background: transparent !important;
    border: 1px solid #c8f000;
    color: #c8f000 !important;
    animation: pulse-b 1s ease-in-out infinite;
  }

  .btn-sent {
    background: rgba(200, 240, 0, 0.08) !important;
    border: 1px solid rgba(200, 240, 0, 0.4);
    color: #c8f000 !important;
    transform: none !important;
    box-shadow: none !important;
  }

  .btn-error {
    background: rgba(248, 113, 113, 0.1) !important;
    border: 1px solid #f87171;
    color: #f87171 !important;
  }

  @keyframes pulse-b {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.45;
    }
  }

  .txt-link {
    font-size: 0.63rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    color: rgba(255, 255, 255, 0.3);
    text-decoration: none;
    transition: color 0.18s;
  }

  .txt-link:hover {
    color: #fff;
  }

  .ping-note {
    font-size: 0.58rem;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.18);
    line-height: 1.6;
  }

  .egg-hint {
    margin-left: 0.75rem;
    color: rgba(200, 240, 0, 0.2);
    font-style: italic;
  }

  /* ── BOTTOM BAR ────────────────────────────────────────────── */
  .bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 30;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 0.9rem 2.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.2);
  }

  .bar a {
    color: rgba(255, 255, 255, 0.2);
    text-decoration: none;
    transition: color 0.2s;
  }

  .bar a:hover {
    color: #c8f000;
  }

  .bar-hint {
    color: rgba(200, 240, 0, 0.25);
  }

  .dot {
    color: rgba(255, 255, 255, 0.08);
  }

  /* ── MOBILE ────────────────────────────────────────────────── */
  .mob {
    display: none;
    position: relative;
    min-height: 100vh;
    background: #080a12;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    .mob {
      display: flex;
    }

    :global(body) {
      cursor: auto;
    }

    .cursor {
      display: none;
    }
  }

  .mob-body {
    position: relative;
    z-index: 10;
    flex: 1;
    padding: 1.5rem 1.5rem 2.5rem;
  }

  .mob-h1 {
    font-size: clamp(2.8rem, 13vw, 4.5rem) !important;
    margin-bottom: 2rem !important;
  }

  .mob-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.65rem;
    margin-bottom: 2rem;
  }

  .mob-card {
    padding: 0.875rem 1rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 8px;
  }

  .mob-items {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .mob-item {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.45);
    letter-spacing: 0.06em;
  }
</style>
