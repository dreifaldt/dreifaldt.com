<script lang="ts">
  let opacity = $state(1)

  $effect(() => {
    const onScroll = () => {
      opacity = Math.max(0, 1 - window.scrollY / 200)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  })
</script>

<div class="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2" style="opacity: {opacity}">
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="chevron"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
</div>

<style>
  .scroll-indicator {
    z-index: 10;
    color: #22d3ee;
    filter: drop-shadow(0 0 6px rgba(34, 211, 238, 0.4));
  }

  .chevron {
    animation: bounce 2s ease-in-out infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(6px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .chevron {
      animation: none;
    }
  }
</style>
