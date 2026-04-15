<script lang="ts">
  import HeroBackground from './HeroBackground.svelte'

  // ── SUGGESTION CHIPS ────────────────────────────────────────────────────────
  const suggestions = [
    { emoji: '🏗️', label: 'Full-Stack',   q: 'What full-stack technologies does Erik work with?' },
    { emoji: '📱', label: 'iOS / Swift',  q: "What's Erik's mobile development experience?" },
    { emoji: '🤖', label: 'AI & Agents',  q: 'What AI and LLM experience does Erik have?' },
    { emoji: '⚡', label: 'Systems',      q: 'Tell me about Erik\'s systems and infrastructure experience' },
    { emoji: '💼', label: 'Consulting',   q: 'How does Erik\'s consulting engagement work?' },
    { emoji: '🌍', label: 'Available',    q: 'Is Erik available for hire right now and what are his terms?' },
    { emoji: '⭐', label: 'Why Erik',     q: 'Give me your best pitch — why should I hire Erik Dreifaldt?' },
  ]

  // ── CHAT STATE ──────────────────────────────────────────────────────────────
  type ChatMsg = { role: 'user' | 'ai'; text: string }

  let messages = $state<ChatMsg[]>([])
  let inputText = $state('')
  let orbState = $state<'idle' | 'thinking' | 'done'>('idle')
  let currentReply = $state('')
  let inputEl = $state<HTMLInputElement | undefined>()

  async function ask(question: string) {
    if (orbState === 'thinking' || !question.trim()) return

    const q = question.trim()
    inputText = ''
    orbState = 'thinking'
    currentReply = ''
    messages = [...messages, { role: 'user', text: q }]

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: q }),
      })
      const data = (await res.json()) as { reply: string }
      currentReply = data.reply ?? ''
      messages = [...messages, { role: 'ai', text: currentReply }]
      orbState = 'done'
      playTone(440, 0.4, 0.05)
    } catch {
      currentReply = 'Something went sideways — but Erik is real. Email erik@dreifaldt.com!'
      messages = [...messages, { role: 'ai', text: currentReply }]
      orbState = 'done'
    }

    // Reset to idle after response is read
    setTimeout(() => {
      if (orbState === 'done') orbState = 'idle'
    }, 12000)
  }

  function onSuggestion(q: string) {
    ask(q)
    inputEl?.focus()
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter') ask(inputText)
  }

  // ── PING (Kafka) ─────────────────────────────────────────────────────────────
  let pingState = $state<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function ping() {
    if (pingState !== 'idle') return
    pingState = 'sending'
    playChord([261, 330, 392, 523])
    try {
      const res = await fetch('/api/ping', { method: 'POST' })
      const d = (await res.json()) as { ok: boolean }
      pingState = d.ok ? 'sent' : 'error'
    } catch {
      pingState = 'error'
    }
    if (pingState === 'error') {
      setTimeout(() => {
        window.location.href = 'mailto:erik@dreifaldt.com?subject=Let%27s%20talk'
        pingState = 'idle'
      }, 1000)
    }
  }

  const hireLabel = $derived(
    pingState === 'idle'    ? 'Hire Erik'
    : pingState === 'sending' ? '···'
    : pingState === 'sent'    ? 'Sent ✓'
    : 'Email →',
  )

  // ── AUDIO ───────────────────────────────────────────────────────────────────
  function playTone(freq: number, dur = 0.35, vol = 0.07) {
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.frequency.value = freq; osc.type = 'sine'
      gain.gain.setValueAtTime(vol, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
      osc.start(); osc.stop(ctx.currentTime + dur)
    } catch { /* no audio */ }
  }

  function playChord(freqs: number[]) {
    freqs.forEach((f, i) => setTimeout(() => playTone(f, 0.5, 0.06), i * 55))
  }

  // ── EASTER EGG: type "hire" ──────────────────────────────────────────────────
  let keyBuf = ''
  let eggActive = $state(false)

  $effect(() => {
    const h = (e: KeyboardEvent) => {
      keyBuf = (keyBuf + e.key.toLowerCase()).slice(-8)
      if (keyBuf.includes('hire')) {
        keyBuf = ''
        eggActive = true
        playChord([523, 659, 784, 1047])
        setTimeout(() => { eggActive = false }, 2800)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })
</script>

<!-- ══════════════════════════════════════════════════════════════════════════
     DESKTOP SCENE
═══════════════════════════════════════════════════════════════════════════ -->
<div class="scene">
  <!-- Wood-panel room passthrough -->
  <HeroBackground />

  <!-- Easter egg flash -->
  {#if eggActive}
    <div class="egg-toast">
      <p class="egg-big">SMART.</p>
      <p class="egg-small">NOW DO SOMETHING ABOUT IT.</p>
    </div>
  {/if}

  <!-- ── THE MAIN visionOS WINDOW ──────────────────────────────────────────── -->
  <div class="vision-window">

    <!-- Window specular edge highlight (top) -->
    <div class="win-specular"></div>

    <!-- ── TOP CHROME BAR ───────────────────────────────────────────────── -->
    <div class="win-topbar">
      <a
        class="topbar-pill"
        href="https://www.linkedin.com/in/erik-dreifaldt"
        target="_blank"
        rel="noopener noreferrer"
      >LinkedIn ↗</a>

      <span class="topbar-title">ERIK DREIFALDT</span>

      <button
        class="topbar-pill topbar-pill-cta"
        class:pill-sent={pingState === 'sent'}
        onclick={ping}
        disabled={pingState === 'sending' || pingState === 'sent'}
      >{hireLabel}</button>
    </div>

    <!-- ── ORB AREA ─────────────────────────────────────────────────────── -->
    <div class="orb-area">

      <!-- The glowing orb -->
      <div class="orb-wrap" class:orb-thinking={orbState === 'thinking'} class:orb-done={orbState === 'done'}>
        <!-- Rotating iridescent halo ring (behind the sphere) -->
        <div class="orb-halo"></div>
        <!-- Dark glass sphere -->
        <div class="orb-sphere">
          <div class="orb-gloss"></div>
          <!-- Response text floats inside the orb when available -->
          {#if currentReply && orbState !== 'thinking'}
            <div class="orb-reply">
              <p class="reply-text">{currentReply}</p>
            </div>
          {:else if orbState === 'thinking'}
            <div class="orb-thinking-indicator">
              <span class="think-dot"></span>
              <span class="think-dot"></span>
              <span class="think-dot"></span>
            </div>
          {:else if messages.length === 0}
            <div class="orb-idle-text">
              <p class="idle-eyebrow">↓ ASK ME ANYTHING</p>
              <p class="idle-headline">I BUILD<br />THINGS<br />THAT LAST.</p>
            </div>
          {/if}
        </div>
      </div>

      <!-- Identity label below orb -->
      <div class="orb-identity">
        <div class="identity-avatar">ED</div>
        <div class="identity-info">
          <span class="identity-name">Erik Dreifaldt</span>
          <span class="identity-role">Software Engineer & Consultant · Stockholm</span>
        </div>
      </div>
    </div>

    <!-- ── SUGGESTIONS ───────────────────────────────────────────────────── -->
    <div class="suggestions">
      <div class="suggestions-header">
        <span class="sug-title">Suggestions</span>
        <a class="sug-more" href="mailto:erik@dreifaldt.com">Contact directly ↗</a>
      </div>
      <div class="chips-row">
        {#each suggestions as s}
          <button class="chip" onclick={() => onSuggestion(s.q)}>
            <span class="chip-icon">{s.emoji}</span>
            <span class="chip-label">{s.label}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- ── INPUT BAR ─────────────────────────────────────────────────────── -->
    <div class="input-bar">
      <div class="input-wrap">
        <span class="input-icon">◎</span>
        <input
          bind:this={inputEl}
          bind:value={inputText}
          class="chat-input"
          placeholder="Ask about Erik's experience…"
          onkeydown={onKey}
          disabled={orbState === 'thinking'}
          autocomplete="off"
          spellcheck="false"
        />
        {#if inputText.trim()}
          <button class="send-btn" onclick={() => ask(inputText)} disabled={orbState === 'thinking'}>↑</button>
        {/if}
      </div>

      <div class="input-pills">
        <button class="ctx-pill" onclick={ping} disabled={pingState !== 'idle'}>
          <span class="ctx-dot"></span>
          Erik Dreifaldt
        </button>
        <span class="ctx-pill ctx-pill-static">
          💼 Available now
        </span>
        <a class="ctx-pill" href="mailto:erik@dreifaldt.com">+ Email</a>
      </div>
    </div>

    <!-- Beta disclaimer (matches visionOS style) -->
    <p class="win-disclaimer">
      Powered by Claude · Real Kafka ping on "Hire Erik" · Type <em>hire</em> anywhere
    </p>

  </div><!-- /vision-window -->
</div><!-- /scene -->

<!-- ══════════════════════════════════════════════════════════════════════════
     MOBILE
═══════════════════════════════════════════════════════════════════════════ -->
<div class="mob">
  <HeroBackground />
  <div class="mob-inner">
    <div class="mob-header">
      <span class="topbar-title" style="font-size:0.62rem">ERIK DREIFALDT</span>
      <button class="topbar-pill topbar-pill-cta" onclick={ping}>{hireLabel}</button>
    </div>

    <div class="mob-orb-wrap">
      <div class="orb-wrap" class:orb-thinking={orbState === 'thinking'} class:orb-done={orbState === 'done'} style="width:min(72vw,320px);height:min(72vw,320px)">
        <div class="orb-halo"></div>
        <div class="orb-sphere">
          <div class="orb-gloss"></div>
          {#if currentReply && orbState !== 'thinking'}
            <div class="orb-reply"><p class="reply-text" style="font-size:0.75rem">{currentReply}</p></div>
          {:else if orbState === 'thinking'}
            <div class="orb-thinking-indicator">
              <span class="think-dot"></span><span class="think-dot"></span><span class="think-dot"></span>
            </div>
          {:else}
            <div class="orb-idle-text">
              <p class="idle-eyebrow" style="font-size:0.42rem">↓ ASK ME ANYTHING</p>
              <p class="idle-headline" style="font-size:clamp(1.4rem,8vw,2rem)">I BUILD<br/>THINGS<br/>THAT LAST.</p>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <div class="mob-chips">
      {#each suggestions.slice(0, 4) as s}
        <button class="chip" onclick={() => onSuggestion(s.q)}>
          <span class="chip-icon">{s.emoji}</span>
          <span class="chip-label">{s.label}</span>
        </button>
      {/each}
    </div>

    <div class="input-bar mob-input-bar">
      <div class="input-wrap">
        <span class="input-icon">◎</span>
        <input
          bind:value={inputText}
          class="chat-input"
          placeholder="Ask about Erik…"
          onkeydown={onKey}
          disabled={orbState === 'thinking'}
        />
        {#if inputText.trim()}
          <button class="send-btn" onclick={() => ask(inputText)}>↑</button>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  /* ══════════════════════════════════════════════════════════
     SCENE + WINDOW SHELL
  ═══════════════════════════════════════════════════════════ */
  .scene {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) { .scene { display: none; } }

  /* The main floating visionOS window — light mode frosted glass */
  .vision-window {
    position: relative;
    z-index: 10;
    width: min(92vw, 820px);
    height: min(94vh, 880px);
    display: flex;
    flex-direction: column;

    /* Light frosted glass — just like visionOS light mode */
    background: rgba(250, 246, 240, 0.42);
    backdrop-filter: blur(64px) saturate(200%) brightness(1.06);
    -webkit-backdrop-filter: blur(64px) saturate(200%) brightness(1.06);
    border: 0.5px solid rgba(255, 255, 255, 0.80);
    border-radius: 42px;
    overflow: hidden;

    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.90),
      inset 0 -0.5px 0 rgba(0, 0, 0, 0.06),
      0 2px 8px rgba(0, 0, 0, 0.06),
      0 24px 60px rgba(0, 0, 0, 0.18),
      0 64px 120px rgba(0, 0, 0, 0.12);
  }

  /* Subtle rainbow shimmer on bottom edge */
  .vision-window::after {
    content: '';
    position: absolute;
    bottom: -0.5px;
    left: 25%;
    right: 25%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(100, 120, 255, 0.25),
      rgba(200, 80, 255, 0.2),
      rgba(255, 120, 60, 0.2),
      transparent
    );
  }

  .win-specular {
    position: absolute;
    top: 0;
    left: 15%;
    right: 15%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.95) 30%,
      rgba(255, 255, 255, 0.95) 70%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 5;
  }

  /* ══════════════════════════════════════════════════════════
     TOP CHROME BAR
  ═══════════════════════════════════════════════════════════ */
  .win-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.1rem 1.5rem 0.9rem;
    flex-shrink: 0;
  }

  .topbar-title {
    font-size: 0.64rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    color: rgba(40, 28, 12, 0.55);
    flex: 1;
    text-align: center;
  }

  .topbar-pill {
    padding: 0.42rem 1rem;
    background: rgba(255, 255, 255, 0.50);
    border: 0.5px solid rgba(255, 255, 255, 0.70);
    border-radius: 50px;
    color: rgba(30, 20, 8, 0.65);
    font-family: inherit;
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    min-width: 80px;
    justify-content: center;
    transition: all 0.2s ease;
    box-shadow: inset 0 0.5px 0 rgba(255,255,255,0.85), 0 1px 4px rgba(0,0,0,0.08);
  }

  .topbar-pill:hover { background: rgba(255, 255, 255, 0.70); color: rgba(30,20,8,0.85); }

  .topbar-pill-cta {
    background: rgba(10, 132, 255, 0.85);
    border-color: rgba(100, 180, 255, 0.3);
    color: rgba(255, 255, 255, 0.97);
    box-shadow:
      inset 0 0.5px 0 rgba(255, 255, 255, 0.28),
      0 4px 16px rgba(10, 132, 255, 0.4);
  }

  .topbar-pill-cta:hover:not(:disabled) {
    background: rgba(10, 132, 255, 1);
    box-shadow:
      inset 0 0.5px 0 rgba(255, 255, 255, 0.3),
      0 6px 24px rgba(10, 132, 255, 0.55);
  }

  .topbar-pill-cta:disabled { opacity: 0.7; cursor: default; }
  .pill-sent { background: rgba(52, 211, 153, 0.25) !important; border-color: rgba(52,211,153,0.4) !important; }

  /* ══════════════════════════════════════════════════════════
     ORB AREA
  ═══════════════════════════════════════════════════════════ */
  .orb-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    min-height: 0;
    gap: 1rem;
  }

  /* ── ORB WRAPPER + HALO ──────────────────────────────────── */
  .orb-wrap {
    position: relative;
    width: min(46vmin, 340px);
    height: min(46vmin, 340px);
    flex-shrink: 0;
  }

  /* The iridescent rotating halo ring */
  .orb-halo {
    position: absolute;
    inset: -6%;
    border-radius: 50%;
    background: conic-gradient(
      from 195deg at 48% 52%,
      #2244cc,
      #5a28b8,
      #9a2090,
      #c83848,
      #d86028,
      #d09020,
      #c04868,
      #8030a8,
      #4040d0,
      #2244cc
    );
    filter: blur(22px);
    opacity: 0.82;
    animation: halo-spin 14s linear infinite;
    will-change: transform;
  }

  .orb-thinking .orb-halo {
    animation: halo-spin 3.5s linear infinite;
    opacity: 1;
    filter: blur(18px);
  }

  .orb-done .orb-halo {
    animation: halo-spin 10s linear infinite;
    opacity: 0.95;
  }

  @keyframes halo-spin {
    to { transform: rotate(360deg); }
  }

  /* The dark glass sphere */
  .orb-sphere {
    position: absolute;
    inset: 5%;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    background: radial-gradient(
      circle at 38% 32%,
      rgba(80, 65, 130, 0.55) 0%,
      rgba(18, 14, 40, 0.94) 50%,
      rgba(6, 4, 18, 0.99) 100%
    );
    border: 0.5px solid rgba(255, 255, 255, 0.1);
    box-shadow:
      inset 0 0 50px rgba(60, 80, 180, 0.12),
      inset 0 -15px 50px rgba(160, 50, 80, 0.08);
  }

  /* Subtle top-left gloss */
  .orb-gloss {
    position: absolute;
    top: 10%;
    left: 16%;
    width: 28%;
    height: 18%;
    border-radius: 50%;
    background: radial-gradient(
      ellipse,
      rgba(255, 255, 255, 0.07) 0%,
      transparent 100%
    );
    pointer-events: none;
  }

  /* ── CONTENT INSIDE ORB ──────────────────────────────────── */
  .orb-reply {
    position: absolute;
    inset: 12%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    animation: fade-up 0.5s ease-out;
  }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .reply-text {
    font-size: 0.82rem;
    font-weight: 400;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    letter-spacing: 0.01em;
    text-shadow: 0 1px 12px rgba(0, 0, 0, 0.6);
  }

  .orb-thinking-indicator {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .think-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    animation: dot-pulse 1.4s ease-in-out infinite;
  }

  .think-dot:nth-child(2) { animation-delay: 0.2s; }
  .think-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dot-pulse {
    0%, 100% { opacity: 0.3; transform: scale(0.85); }
    50%       { opacity: 1;   transform: scale(1.15); }
  }

  .orb-idle-text {
    text-align: center;
    padding: 0 14%;
    animation: fade-up 0.6s ease-out;
  }

  .idle-eyebrow {
    font-size: 0.48rem;
    font-weight: 500;
    letter-spacing: 0.22em;
    color: rgba(255, 255, 255, 0.3);
    margin-bottom: 0.5rem;
  }

  .idle-headline {
    font-family: 'Barlow', sans-serif;
    font-size: clamp(1.5rem, 4vmin, 2.4rem);
    font-weight: 900;
    line-height: 0.92;
    letter-spacing: -0.02em;
    color: rgba(255, 255, 255, 0.92);
  }

  /* ── IDENTITY LABEL ──────────────────────────────────────── */
  .orb-identity {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  .identity-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #5a40c0, #c04080);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.58rem;
    font-weight: 700;
    color: white;
    border: 1.5px solid rgba(255,255,255,0.2);
    flex-shrink: 0;
  }

  .identity-info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .identity-name {
    font-size: 0.68rem;
    font-weight: 600;
    color: rgba(30, 20, 8, 0.78);
    letter-spacing: 0.04em;
  }

  .identity-role {
    font-size: 0.54rem;
    color: rgba(40, 28, 12, 0.40);
    letter-spacing: 0.05em;
  }

  /* ══════════════════════════════════════════════════════════
     SUGGESTIONS
  ═══════════════════════════════════════════════════════════ */
  .suggestions {
    padding: 0 1.5rem 0.5rem;
    flex-shrink: 0;
  }

  .suggestions-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .sug-title {
    font-size: 0.7rem;
    font-weight: 600;
    color: rgba(40, 28, 12, 0.60);
    letter-spacing: 0.04em;
  }

  .sug-more {
    font-size: 0.6rem;
    font-weight: 500;
    color: rgba(10, 100, 220, 0.85);
    text-decoration: none;
    letter-spacing: 0.04em;
  }

  .chips-row {
    display: flex;
    gap: 0.8rem;
    /* No overflow clipping — lets scale(1.08) breathe */
    padding: 8px 2px;
  }

  /* ── CHIP ───────────────────────────────────────────────── */
  .chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.45rem;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    flex-shrink: 0;
    transition: transform 0.18s ease;
  }

  .chip:hover { transform: scale(1.08); }
  .chip:active { transform: scale(0.96); }

  .chip-icon {
    width: 62px;
    height: 62px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.60);
    border: 0.5px solid rgba(255, 255, 255, 0.80);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    box-shadow:
      inset 0 0.5px 0 rgba(255,255,255,0.95),
      0 2px 10px rgba(0,0,0,0.10),
      0 1px 3px rgba(0,0,0,0.06);
    transition: background 0.2s, box-shadow 0.2s;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .chip:hover .chip-icon {
    background: rgba(255, 255, 255, 0.82);
    box-shadow:
      inset 0 0.5px 0 rgba(255,255,255,1),
      0 4px 16px rgba(0,0,0,0.14);
  }

  .chip-label {
    font-size: 0.56rem;
    font-weight: 500;
    color: rgba(40, 28, 12, 0.55);
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  /* ══════════════════════════════════════════════════════════
     INPUT BAR
  ═══════════════════════════════════════════════════════════ */
  .input-bar {
    padding: 0.65rem 1.25rem 0.9rem;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    flex-shrink: 0;
  }

  .input-wrap {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: rgba(255, 255, 255, 0.55);
    border: 0.5px solid rgba(255, 255, 255, 0.80);
    border-radius: 24px;
    padding: 0.7rem 1rem;
    box-shadow:
      inset 0 0.5px 0 rgba(255,255,255,0.95),
      0 1px 4px rgba(0,0,0,0.07);
    transition: border-color 0.2s, background 0.2s;
  }

  .input-wrap:focus-within {
    border-color: rgba(255, 255, 255, 0.95);
    background: rgba(255, 255, 255, 0.72);
    box-shadow:
      inset 0 0.5px 0 rgba(255,255,255,1),
      0 0 0 2.5px rgba(10, 100, 220, 0.15),
      0 1px 4px rgba(0,0,0,0.07);
  }

  .input-icon {
    font-size: 0.9rem;
    color: rgba(40, 28, 12, 0.30);
    flex-shrink: 0;
  }

  .chat-input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 400;
    color: rgba(30, 20, 8, 0.85);
  }

  .chat-input::placeholder { color: rgba(40, 28, 12, 0.30); }
  .chat-input:disabled { opacity: 0.5; }

  .send-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(10, 132, 255, 0.9);
    border: none;
    color: white;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 10px rgba(10,132,255,0.45);
    transition: all 0.15s ease;
  }

  .send-btn:hover:not(:disabled) { background: rgba(10, 132, 255, 1); transform: scale(1.05); }
  .send-btn:disabled { opacity: 0.5; cursor: default; }

  /* Context pills below input */
  .input-pills {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 0 0.25rem;
  }

  .ctx-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.32rem 0.8rem;
    background: rgba(255, 255, 255, 0.52);
    border: 0.5px solid rgba(255, 255, 255, 0.75);
    border-radius: 50px;
    font-family: inherit;
    font-size: 0.58rem;
    font-weight: 500;
    color: rgba(30, 20, 8, 0.62);
    cursor: pointer;
    text-decoration: none;
    box-shadow: inset 0 0.5px 0 rgba(255,255,255,0.90), 0 1px 3px rgba(0,0,0,0.06);
    transition: background 0.18s, color 0.18s;
    white-space: nowrap;
  }

  .ctx-pill:hover { background: rgba(255,255,255,0.75); color: rgba(30,20,8,0.85); }
  .ctx-pill-static { cursor: default; }
  .ctx-pill-static:hover { background: rgba(255,255,255,0.52); color: rgba(30,20,8,0.62); }

  .ctx-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #34d399;
    animation: blink 2.4s ease-in-out infinite;
    flex-shrink: 0;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.2; }
  }

  /* ── DISCLAIMER ─────────────────────────────────────────── */
  .win-disclaimer {
    text-align: center;
    font-size: 0.48rem;
    color: rgba(40, 28, 12, 0.28);
    letter-spacing: 0.08em;
    padding: 0 1rem 0.75rem;
    flex-shrink: 0;
  }

  /* ══════════════════════════════════════════════════════════
     EASTER EGG TOAST
  ═══════════════════════════════════════════════════════════ */
  .egg-toast {
    position: fixed;
    inset: 0;
    z-index: 9000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(4px);
    animation: fade-up 0.3s ease-out;
  }

  .egg-big {
    font-family: 'Barlow', sans-serif;
    font-size: clamp(4rem, 10vw, 8rem);
    font-weight: 900;
    color: rgba(255, 255, 255, 0.95);
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .egg-small {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.25em;
    color: rgba(255, 255, 255, 0.45);
    margin-top: 0.5rem;
  }

  /* ══════════════════════════════════════════════════════════
     MOBILE
  ═══════════════════════════════════════════════════════════ */
  .mob {
    display: none;
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    .mob { display: flex; }
  }

  .mob-inner {
    position: relative;
    z-index: 10;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }

  .mob-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .mob-orb-wrap {
    display: flex;
    justify-content: center;
  }

  .mob-chips {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .mob-input-bar {
    padding: 0 !important;
  }
</style>
