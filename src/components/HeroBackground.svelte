<script lang="ts">
  // ── SMOOTH MOUSE PARALLAX ────────────────────────────────────────────────────
  // Target and current positions, lerped every frame for buttery smoothness
  let targetX = 50  // % (0 = left, 100 = right of panorama)
  let currentX = 50

  let bgEl = $state<HTMLDivElement | undefined>()
  let rafId: number

  $effect(() => {
    if (!bgEl) return

    const onMouseMove = (e: MouseEvent) => {
      // Normalize cursor to -1 … +1, then map to 40–60% of the panorama
      const norm = (e.clientX / window.innerWidth) * 2 - 1  // -1 left, +1 right
      targetX = 50 + norm * 10  // ±10% of panorama width
    }

    window.addEventListener('mousemove', onMouseMove)

    const tick = () => {
      // Exponential ease: 6% per frame toward target ≈ ~60ms settling
      currentX += (targetX - currentX) * 0.06
      if (bgEl) {
        bgEl.style.backgroundPositionX = `${currentX}%`
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  })
</script>

<div class="room-bg" bind:this={bgEl}></div>

<style>
  .room-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    background-image: url('/room-bg.jpg');
    background-size: cover;
    /* Y fixed to show horizon; X driven by JS parallax */
    background-position: 50% 38%;
    background-repeat: no-repeat;
    /* GPU-promote for silky compositing */
    will-change: background-position;
  }

  /* Gentle gradient to ground the cards */
  .room-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 10, 30, 0.06) 0%,
      rgba(0, 10, 30, 0.26) 100%
    );
    pointer-events: none;
  }
</style>
