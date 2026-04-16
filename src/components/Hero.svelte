<script lang="ts">
  import HeroBackground from './HeroBackground.svelte'

  // ── SUGGESTION CHIPS ────────────────────────────────────────────────────────
  const suggestions = [
    { emoji: '🏗️', label: 'Full-Stack',  q: 'What full-stack technologies does Erik work with?' },
    { emoji: '📱', label: 'iOS / Swift', q: "What's Erik's mobile development experience?" },
    { emoji: '🤖', label: 'AI & Agents', q: 'What AI and LLM experience does Erik have?' },
    { emoji: '⚡', label: 'Systems',     q: "Tell me about Erik's systems and infrastructure experience" },
    { emoji: '💼', label: 'Consulting',  q: "How does Erik's consulting engagement work?" },
    { emoji: '🌍', label: 'Available',   q: 'Is Erik available for hire right now and what are his terms?' },
    { emoji: '⭐', label: 'Why Erik',    q: 'Give me your best pitch — why should I hire Erik Dreifaldt?' },
  ]

  // ── CHAT STATE ──────────────────────────────────────────────────────────────
  type ChatMsg = { role: 'user' | 'ai'; text: string }

  let messages  = $state<ChatMsg[]>([])
  let inputText = $state('')
  let orbState  = $state<'idle' | 'thinking' | 'done'>('idle')
  let currentReply = $state('')
  let inputEl = $state<HTMLInputElement | undefined>()
  let inputFocused = $state(false)
  let hoverPrompt  = $state('')

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
    setTimeout(() => { if (orbState === 'done') orbState = 'idle' }, 12000)
  }

  function onSuggestion(q: string) { ask(q); inputEl?.focus() }
  function onKey(e: KeyboardEvent) { if (e.key === 'Enter') ask(inputText) }

  // ── PING ────────────────────────────────────────────────────────────────────
  let pingState = $state<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function ping() {
    if (pingState !== 'idle') return
    pingState = 'sending'
    playChord([261, 330, 392, 523])
    try {
      const res = await fetch('/api/ping', { method: 'POST' })
      const d = (await res.json()) as { ok: boolean }
      pingState = d.ok ? 'sent' : 'error'
    } catch { pingState = 'error' }
    if (pingState === 'error') {
      setTimeout(() => { window.location.href = 'mailto:erik@dreifaldt.com?subject=Let%27s%20talk'; pingState = 'idle' }, 1000)
    }
  }

  const hireLabel = $derived(
    pingState === 'idle'    ? "Hire Erik →"
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
  function playChord(freqs: number[]) { freqs.forEach((f, i) => setTimeout(() => playTone(f, 0.5, 0.06), i * 55)) }

  // ── EASTER EGG ──────────────────────────────────────────────────────────────
  let keyBuf = ''
  let eggActive = $state(false)
  $effect(() => {
    const h = (e: KeyboardEvent) => {
      keyBuf = (keyBuf + e.key.toLowerCase()).slice(-8)
      if (keyBuf.includes('hire')) {
        keyBuf = ''; eggActive = true
        playChord([523, 659, 784, 1047])
        setTimeout(() => { eggActive = false }, 2800)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })
</script>

<!-- ══════════════════════════════════════════════════════════════════════
     DESKTOP SCENE
════════════════════════════════════════════════════════════════════════ -->
<div class="scene">
  <HeroBackground />

  {#if eggActive}
    <div class="egg-toast">
      <p class="egg-big">SMART.</p>
      <p class="egg-small">NOW DO SOMETHING ABOUT IT.</p>
    </div>
  {/if}

  <div class="cards-layout">

    <!-- ── CARD LEFT: orb + chat ──────────────────────────────────────── -->
    <div class="glass-card card-chat" style="position:relative">

      <!-- Flex spacer — shrinks when orb moves to corner -->
      <div class="orb-spacer" class:spacer-min={inputFocused}></div>

      <!-- Orb — absolutely positioned so it can glide to top-right -->
      <div
        class="orb-wrap"
        class:orb-thinking={orbState === 'thinking'}
        class:orb-done={orbState === 'done'}
        class:orb-minimized={inputFocused}
      >
        <!-- Amorphic colour blobs — the "living" layer -->
        <div class="orb-glow g1"></div>
        <div class="orb-glow g2"></div>
        <div class="orb-glow g3"></div>
        <div class="orb-glow g4"></div>

        <!-- Dark glass amoeba core -->
        <div class="orb-sphere">
          <div class="orb-gloss"></div>
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
          {:else}
            <div class="orb-idle-text">
              <p class="idle-headline">ASK ME<br/>ANYTHING</p>
            </div>
          {/if}
        </div>
      </div>

      <!-- Identity -->
      <div class="identity">
        <div class="identity-avatar">ED</div>
        <div class="identity-info">
          <span class="identity-name">Erik Dreifaldt</span>
          <span class="identity-role">Engineer & Consultant · Stockholm</span>
        </div>
        <span class="avail-dot"></span>
      </div>

      <!-- Input -->
      <div class="input-wrap">
        <input
          bind:this={inputEl}
          bind:value={inputText}
          class="chat-input"
          placeholder={hoverPrompt || "Ask about Erik's experience…"}
          onkeydown={onKey}
          onfocus={() => inputFocused = true}
          onblur={() => { inputFocused = false; hoverPrompt = '' }}
          disabled={orbState === 'thinking'}
          autocomplete="off"
          spellcheck="false"
        />
        {#if inputText.trim()}
          <button class="send-btn" onclick={() => ask(inputText)} disabled={orbState === 'thinking'}>↑</button>
        {/if}
      </div>

      <p class="card-disclaimer">Powered by Claude · Real Kafka ping on hire</p>
    </div>

    <!-- ── CARD RIGHT: about + chips + contact ────────────────────────── -->
    <div class="glass-card card-about">

      <!-- Header -->
      <div class="about-header">
        <div>
          <p class="about-tagline">Speed in Startups. Scaled in Enterprise. Leveraged with AI.</p>
          <h1 class="about-name">Erik<br/>Dreifaldt</h1>
        </div>
      </div>

      <!-- Chips -->
      <div class="chips-section">
        <p class="chips-label">Ask me about</p>
        <div class="chips-grid">
          {#each suggestions as s}
            <button
              class="chip"
              onclick={() => onSuggestion(s.q)}
              onmouseenter={() => hoverPrompt = s.q}
              onmouseleave={() => hoverPrompt = ''}
            >
              <span class="chip-icon">{s.emoji}</span>
              <span class="chip-label">{s.label}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- CTA row -->
      <div class="cta-row">
        <button
          class="btn-hire"
          class:btn-sent={pingState === 'sent'}
          onclick={ping}
          disabled={pingState === 'sending' || pingState === 'sent'}
        >{hireLabel}</button>

        <a
          class="btn-ghost"
          href="https://www.linkedin.com/in/erik-dreifaldt"
          target="_blank"
          rel="noopener noreferrer"
        >LinkedIn ↗</a>

        <a class="btn-ghost" href="mailto:erik@dreifaldt.com">Email ↗</a>
      </div>
    </div>

  </div><!-- /cards-layout -->
</div><!-- /scene -->

<!-- ══════════════════════════════════════════════════════════════════════
     MOBILE
════════════════════════════════════════════════════════════════════════ -->
<div class="mob">
  <HeroBackground />
  <div class="mob-inner">

    <div class="glass-card mob-card">
      <div class="mob-top">
        <span class="about-eyebrow" style="font-size:0.5rem">Erik Dreifaldt · Stockholm</span>
        <button class="btn-hire" onclick={ping}>{hireLabel}</button>
      </div>

      <div class="mob-orb">
        <div class="orb-wrap" class:orb-thinking={orbState === 'thinking'} class:orb-done={orbState === 'done'} class:orb-minimized={inputFocused} style="width:min(64vw,280px);height:min(64vw,280px)">
          <div class="orb-glow g1"></div>
          <div class="orb-glow g2"></div>
          <div class="orb-glow g3"></div>
          <div class="orb-glow g4"></div>
          <div class="orb-sphere">
            <div class="orb-gloss"></div>
            {#if currentReply && orbState !== 'thinking'}
              <div class="orb-reply"><p class="reply-text" style="font-size:0.72rem">{currentReply}</p></div>
            {:else if orbState === 'thinking'}
              <div class="orb-thinking-indicator">
                <span class="think-dot"></span><span class="think-dot"></span><span class="think-dot"></span>
              </div>
            {:else}
              <div class="orb-idle-text">
                <p class="idle-headline" style="font-size:clamp(1.3rem,7vw,1.8rem)">ASK ME<br/>ANYTHING</p>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <div class="chips-grid mob-chips">
        {#each suggestions.slice(0, 4) as s}
          <button class="chip" onclick={() => onSuggestion(s.q)}>
            <span class="chip-icon">{s.emoji}</span>
            <span class="chip-label">{s.label}</span>
          </button>
        {/each}
      </div>

      <div class="input-wrap">
        <input
          bind:value={inputText}
          class="chat-input"
          placeholder="Ask about Erik…"
          onkeydown={onKey}
          onfocus={() => inputFocused = true}
          onblur={() => inputFocused = false}
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
  /* ═══════════════════════════════════════════════════════════
     SCENE
  ══════════════════════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════════════════════
     CARD LAYOUT
  ══════════════════════════════════════════════════════════ */
  .cards-layout {
    position: relative;
    z-index: 10;
    display: flex;
    gap: 1.5rem;
    align-items: center;
    padding: 2rem;
    max-width: 1100px;
    width: 100%;
  }

  /* ═══════════════════════════════════════════════════════════
     GLASSMORPHISM CARD BASE
  ══════════════════════════════════════════════════════════ */
  .glass-card {
    background: rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(48px) saturate(180%);
    -webkit-backdrop-filter: blur(48px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.45);
    border-radius: 32px;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.70),
      inset 0 -1px 0 rgba(0, 0, 0, 0.06),
      0 8px 32px rgba(0, 20, 60, 0.18),
      0 32px 80px rgba(0, 20, 60, 0.22),
      0 2px 6px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }

  /* Left card — taller, narrower */
  .card-chat {
    flex: 0 0 340px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
    padding: 2rem 1.75rem 1.25rem;
    align-self: stretch;
  }

  /* Right card — wider */
  .card-about {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2.25rem 2.25rem 1.75rem;
    align-self: stretch;
  }

  /* ═══════════════════════════════════════════════════════════
     ORB — LIVING AMORPHIC BLOB
  ══════════════════════════════════════════════════════════ */

  /* Spacer holds vertical space in the flex column while orb is absolute */
  .orb-spacer {
    flex-shrink: 0;
    width: 100%;
    height: min(52vmin, 260px);
    transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                margin  0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .spacer-min {
    height: 0;
  }

  .orb-wrap {
    /* Lifted out of flex flow so it can slide freely */
    position: absolute;
    width: min(52vmin, 260px);
    height: min(52vmin, 260px);
    /* Normal: horizontally centred near top of card */
    top: 1.75rem;
    left: calc(50% - min(26vmin, 130px));
    transition:
      top     0.65s cubic-bezier(0.34, 1.1, 0.64, 1),
      left    0.65s cubic-bezier(0.34, 1.1, 0.64, 1),
      transform 0.65s cubic-bezier(0.34, 1.1, 0.64, 1),
      opacity   0.5s ease;
    will-change: transform, opacity, top, left;
  }

  /* ── Slide to top-right corner when input focused ───────── */
  .orb-minimized {
    top: 0.75rem;
    left: calc(100% - min(13vmin, 65px) - 0.9rem);
    transform: scale(0.24) !important;
    transform-origin: top left;
    opacity: 0.72;
  }

  /* Glow layers freeze and dim when minimised */
  .orb-minimized .orb-glow {
    animation-play-state: paused;
    opacity: 0.12 !important;
    filter: blur(8px) grayscale(0.9) !important;
    transition: opacity 0.4s, filter 0.4s;
  }

  /* ── Colour blob layers ──────────────────────────────────── */
  .orb-glow {
    position: absolute;
    will-change: transform, border-radius;
  }

  /* Deep indigo-blue — slow, large */
  .g1 {
    inset: -22%;
    background: radial-gradient(ellipse at 50% 50%, #3b1fcc 0%, #6b28e0 45%, transparent 70%);
    filter: blur(28px);
    opacity: 0.72;
    animation:
      morph-a 9s ease-in-out infinite,
      breathe-a 6s ease-in-out infinite,
      spin-slow 22s linear infinite;
  }

  /* Hot magenta-pink — medium speed */
  .g2 {
    inset: -14%;
    background: radial-gradient(ellipse at 40% 60%, #c0186a 0%, #e0408a 40%, transparent 68%);
    filter: blur(22px);
    opacity: 0.65;
    animation:
      morph-b 7s ease-in-out infinite,
      breathe-b 5s ease-in-out infinite,
      spin-rev  17s linear infinite;
  }

  /* Amber-orange — medium, offset */
  .g3 {
    inset: -10%;
    background: radial-gradient(ellipse at 65% 35%, #d05a10 0%, #e0900a 40%, transparent 66%);
    filter: blur(20px);
    opacity: 0.55;
    animation:
      morph-c 8s ease-in-out infinite,
      breathe-c 7s ease-in-out infinite,
      spin-slow 30s linear infinite reverse;
  }

  /* Teal-cyan accent — small, fast */
  .g4 {
    inset: -6%;
    background: radial-gradient(ellipse at 30% 70%, #0e8a98 0%, #1ab8d0 35%, transparent 60%);
    filter: blur(16px);
    opacity: 0.45;
    animation:
      morph-a 5s ease-in-out infinite reverse,
      breathe-a 4s ease-in-out infinite alternate;
  }

  /* ── Morphing border-radius animations ───────────────────── */
  @keyframes morph-a {
    0%   { border-radius: 62% 38% 46% 54% / 60% 44% 56% 40%; }
    17%  { border-radius: 44% 56% 60% 40% / 46% 58% 42% 58%; }
    33%  { border-radius: 55% 45% 38% 62% / 38% 62% 55% 45%; }
    50%  { border-radius: 38% 62% 54% 46% / 56% 38% 62% 38%; }
    67%  { border-radius: 58% 42% 48% 52% / 42% 56% 38% 62%; }
    83%  { border-radius: 46% 54% 62% 38% / 60% 40% 48% 52%; }
    100% { border-radius: 62% 38% 46% 54% / 60% 44% 56% 40%; }
  }

  @keyframes morph-b {
    0%   { border-radius: 40% 60% 55% 45% / 52% 48% 60% 40%; }
    20%  { border-radius: 62% 38% 40% 60% / 40% 60% 38% 62%; }
    40%  { border-radius: 48% 52% 62% 38% / 58% 42% 50% 50%; }
    60%  { border-radius: 56% 44% 46% 54% / 44% 56% 46% 54%; }
    80%  { border-radius: 38% 62% 58% 42% / 62% 38% 56% 44%; }
    100% { border-radius: 40% 60% 55% 45% / 52% 48% 60% 40%; }
  }

  @keyframes morph-c {
    0%   { border-radius: 50% 50% 40% 60% / 45% 55% 50% 50%; }
    25%  { border-radius: 38% 62% 56% 44% / 60% 40% 44% 56%; }
    50%  { border-radius: 62% 38% 44% 56% / 38% 62% 60% 40%; }
    75%  { border-radius: 44% 56% 62% 38% / 54% 46% 38% 62%; }
    100% { border-radius: 50% 50% 40% 60% / 45% 55% 50% 50%; }
  }

  /* ── Breathe (scale pulse) ───────────────────────────────── */
  @keyframes breathe-a {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.12); }
  }
  @keyframes breathe-b {
    0%, 100% { transform: scale(1.05); }
    50%       { transform: scale(0.92); }
  }
  @keyframes breathe-c {
    0%, 100% { transform: scale(0.95); }
    33%       { transform: scale(1.10); }
    66%       { transform: scale(0.98); }
  }

  /* ── Rotation ────────────────────────────────────────────── */
  @keyframes spin-slow { to { transform: rotate(360deg);  } }
  @keyframes spin-rev  { to { transform: rotate(-360deg); } }

  /* ── State modifiers ─────────────────────────────────────── */
  /* Thinking: faster, brighter, more saturated */
  .orb-thinking .g1 { animation-duration: 3s, 2s, 8s;  opacity: 0.92; filter: blur(24px) saturate(1.4); }
  .orb-thinking .g2 { animation-duration: 2.5s, 1.8s, 6s; opacity: 0.88; }
  .orb-thinking .g3 { animation-duration: 3.5s, 2.2s, 10s; opacity: 0.72; }
  .orb-thinking .g4 { animation-duration: 2s,   1.5s; opacity: 0.60; }

  /* Done: slower, settled */
  .orb-done .g1 { animation-duration: 11s, 8s, 28s; opacity: 0.78; }
  .orb-done .g2 { animation-duration: 9s,  6s, 21s; opacity: 0.68; }

  /* ── Dark glass amoeba core ──────────────────────────────── */
  .orb-sphere {
    position: absolute;
    inset: 8%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(
      circle at 38% 32%,
      rgba(80, 65, 130, 0.60) 0%,
      rgba(18, 14, 40, 0.92) 50%,
      rgba(6, 4, 18, 0.98) 100%
    );
    border: 0.5px solid rgba(255, 255, 255, 0.12);
    box-shadow:
      inset 0 0 60px rgba(60, 80, 180, 0.15),
      inset 0 -20px 60px rgba(160, 50, 80, 0.10);
    /* The sphere also morphs — slower, subtler */
    animation: morph-b 12s ease-in-out infinite;
  }

  .orb-gloss {
    position: absolute;
    top: 10%; left: 16%;
    width: 32%; height: 20%;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(255,255,255,0.09) 0%, transparent 100%);
    pointer-events: none;
  }

  /* ── Content inside orb ──────────────────────────────────── */
  .orb-reply {
    position: absolute;
    inset: 12%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    animation: fade-up 0.5s ease-out;
  }

  .reply-text {
    font-size: 0.78rem;
    font-weight: 400;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    letter-spacing: 0.01em;
    text-shadow: 0 1px 12px rgba(0, 0, 0, 0.6);
  }

  .orb-thinking-indicator { display: flex; gap: 6px; align-items: center; }
  .think-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    animation: dot-pulse 1.4s ease-in-out infinite;
  }
  .think-dot:nth-child(2) { animation-delay: 0.2s; }
  .think-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dot-pulse {
    0%, 100% { opacity: 0.3; transform: scale(0.85); }
    50%       { opacity: 1;   transform: scale(1.15); }
  }

  .orb-idle-text { text-align: center; padding: 0 14%; animation: fade-up 0.6s ease-out; }
  .idle-eyebrow {
    font-size: 0.44rem; font-weight: 500; letter-spacing: 0.22em;
    color: rgba(255, 255, 255, 0.3); margin-bottom: 0.5rem;
  }
  .idle-headline {
    font-family: 'Barlow', sans-serif;
    font-size: clamp(1.4rem, 4vmin, 2.2rem);
    font-weight: 900; line-height: 0.92;
    letter-spacing: -0.02em; color: rgba(255, 255, 255, 0.92);
  }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ═══════════════════════════════════════════════════════════
     IDENTITY ROW (left card)
  ══════════════════════════════════════════════════════════ */
  .identity {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    width: 100%;
  }

  .identity-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, #5a40c0, #c04080);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.58rem; font-weight: 700; color: white;
    border: 1.5px solid rgba(255,255,255,0.25);
    flex-shrink: 0;
  }

  .identity-info { display: flex; flex-direction: column; gap: 0.1rem; flex: 1; }
  .identity-name { font-size: 0.72rem; font-weight: 600; color: rgba(10, 6, 2, 0.82); letter-spacing: 0.03em; }
  .identity-role { font-size: 0.52rem; color: rgba(10, 6, 2, 0.42); letter-spacing: 0.04em; }

  .avail-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #34d399;
    box-shadow: 0 0 6px rgba(52,211,153,0.6);
    animation: blink 2.4s ease-in-out infinite;
    flex-shrink: 0;
  }

  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }

  /* ═══════════════════════════════════════════════════════════
     INPUT (shared)
  ══════════════════════════════════════════════════════════ */
  .input-wrap {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    width: 100%;
    background: rgba(255, 255, 255, 0.50);
    border: 1px solid rgba(255, 255, 255, 0.72);
    border-radius: 20px;
    padding: 0.7rem 0.9rem;
    box-shadow: inset 0 0.5px 0 rgba(255,255,255,0.90), 0 1px 4px rgba(0,0,0,0.06);
    transition: border-color 0.2s, background 0.2s;
  }
  .input-wrap:focus-within {
    background: rgba(255, 255, 255, 0.70);
    border-color: rgba(255, 255, 255, 0.95);
    box-shadow: inset 0 0.5px 0 rgba(255,255,255,1), 0 0 0 2.5px rgba(10,100,220,0.15), 0 1px 4px rgba(0,0,0,0.06);
  }

  .chat-input {
    flex: 1; background: none; border: none; outline: none;
    font-family: inherit; font-size: 0.82rem; font-weight: 400;
    color: rgba(10, 6, 2, 0.85);
  }
  .chat-input::placeholder { color: rgba(10, 6, 2, 0.32); }
  .chat-input:disabled { opacity: 0.5; }

  .send-btn {
    width: 28px; height: 28px; border-radius: 50%;
    background: rgba(10, 132, 255, 0.9);
    border: none; color: white; font-size: 0.8rem; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; box-shadow: 0 2px 10px rgba(10,132,255,0.45);
    transition: all 0.15s ease;
  }
  .send-btn:hover:not(:disabled) { background: rgba(10,132,255,1); transform: scale(1.05); }
  .send-btn:disabled { opacity: 0.5; cursor: default; }

  .card-disclaimer {
    font-size: 0.44rem; color: rgba(10, 6, 2, 0.28);
    letter-spacing: 0.07em; text-align: center;
  }

  /* ═══════════════════════════════════════════════════════════
     ABOUT CARD (right)
  ══════════════════════════════════════════════════════════ */
  .about-header { flex-shrink: 0; }

  .about-tagline {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em;
    color: rgba(10, 6, 2, 0.52); display: block;
    margin-bottom: 0.6rem; line-height: 1.45;
  }

  .about-name {
    font-family: 'Barlow', sans-serif;
    font-size: clamp(2.6rem, 5vw, 4rem);
    font-weight: 900; line-height: 0.88;
    letter-spacing: -0.03em;
    color: rgba(8, 4, 0, 0.85);
    margin-bottom: 0.6rem;
  }


  /* ── CHIPS ── */
  .chips-section { flex: 1; display: flex; flex-direction: column; gap: 0.6rem; }

  .chips-label {
    font-size: 0.58rem; font-weight: 600; color: rgba(10,6,2,0.38);
    letter-spacing: 0.10em; text-transform: uppercase;
  }

  .chips-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
    padding: 6px 2px;
  }

  .chip {
    display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
    background: none; border: none; padding: 0; cursor: pointer;
    flex-shrink: 0; transition: transform 0.18s ease;
  }
  .chip:hover { transform: scale(1.08); }
  .chip:active { transform: scale(0.96); }

  .chip-icon {
    width: 58px; height: 58px; border-radius: 50%;
    background: rgba(255, 255, 255, 0.60);
    border: 1px solid rgba(255, 255, 255, 0.80);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem;
    box-shadow: inset 0 0.5px 0 rgba(255,255,255,0.95), 0 2px 10px rgba(0,20,60,0.10);
    transition: background 0.2s, box-shadow 0.2s;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  .chip:hover .chip-icon {
    background: rgba(255, 255, 255, 0.85);
    box-shadow: inset 0 0.5px 0 rgba(255,255,255,1), 0 4px 16px rgba(0,20,60,0.14);
  }

  .chip-label {
    font-size: 0.52rem; font-weight: 600; color: rgba(10, 6, 2, 0.55);
    letter-spacing: 0.04em; white-space: nowrap;
  }

  /* ── CTA ROW ── */
  .cta-row {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-shrink: 0;
  }

  .btn-hire {
    padding: 0.65rem 1.5rem;
    background: rgba(10, 132, 255, 0.9);
    border: 1px solid rgba(100, 180, 255, 0.4);
    border-radius: 50px;
    color: white;
    font-family: inherit;
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.04em;
    box-shadow: inset 0 0.5px 0 rgba(255,255,255,0.28), 0 4px 18px rgba(10,132,255,0.40);
    transition: all 0.2s ease;
  }
  .btn-hire:hover:not(:disabled) {
    background: rgba(10, 132, 255, 1);
    box-shadow: inset 0 0.5px 0 rgba(255,255,255,0.32), 0 6px 24px rgba(10,132,255,0.55);
    transform: translateY(-1px);
  }
  .btn-hire:disabled { opacity: 0.7; cursor: default; }
  .btn-sent { background: rgba(52,211,153,0.3) !important; border-color: rgba(52,211,153,0.5) !important; color: rgba(10,6,2,0.75) !important; }

  .btn-ghost {
    padding: 0.65rem 1.1rem;
    background: rgba(255, 255, 255, 0.48);
    border: 1px solid rgba(255, 255, 255, 0.72);
    border-radius: 50px;
    color: rgba(10, 6, 2, 0.62);
    font-family: inherit;
    font-size: 0.68rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    box-shadow: inset 0 0.5px 0 rgba(255,255,255,0.90), 0 1px 4px rgba(0,0,0,0.06);
    transition: all 0.18s ease;
    letter-spacing: 0.03em;
    display: inline-flex; align-items: center;
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.72); color: rgba(10,6,2,0.88); transform: translateY(-1px); }

  /* ═══════════════════════════════════════════════════════════
     EASTER EGG
  ══════════════════════════════════════════════════════════ */
  .egg-toast {
    position: fixed; inset: 0; z-index: 9000;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    pointer-events: none;
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(4px);
    animation: fade-up 0.3s ease-out;
  }
  .egg-big {
    font-family: 'Barlow', sans-serif;
    font-size: clamp(4rem, 10vw, 8rem);
    font-weight: 900; color: rgba(255,255,255,0.95);
    letter-spacing: -0.02em; line-height: 1;
  }
  .egg-small {
    font-size: 0.7rem; font-weight: 500;
    letter-spacing: 0.25em; color: rgba(255,255,255,0.5); margin-top: 0.5rem;
  }

  /* ═══════════════════════════════════════════════════════════
     MOBILE
  ══════════════════════════════════════════════════════════ */
  .mob { display: none; position: relative; min-height: 100vh; overflow: hidden; flex-direction: column; }
  @media (max-width: 768px) { .mob { display: flex; } }

  .mob-inner {
    position: relative; z-index: 10; flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 1.25rem;
  }

  .mob-card {
    width: 100%;
    display: flex; flex-direction: column;
    align-items: center; gap: 1rem;
    padding: 1.5rem 1.25rem 1rem;
  }

  .mob-top {
    display: flex; align-items: center;
    justify-content: space-between; width: 100%;
  }

  .mob-orb { display: flex; justify-content: center; }

  .mob-chips {
    justify-content: center;
    width: 100%;
  }
</style>
