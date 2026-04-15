<!-- Pure CSS wood-panel room — simulates visionOS passthrough of a warm physical space.
     No Three.js needed; this is faster and looks more accurate to the screenshot. -->
<div class="room">
  <!-- Ribbed architectural wood panels wall -->
  <div class="wall"></div>
  <!-- Subtle floor plane -->
  <div class="floor"></div>
  <!-- Warm ambient light bloom from upper-right (window) -->
  <div class="light-bloom"></div>
  <!-- Soft left-wall shadow -->
  <div class="left-shadow"></div>
</div>

<style>
  .room {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  /* ── MAIN WALL — ribbed vertical wood panels ─────────────── */
  .wall {
    position: absolute;
    inset: 0;

    /* Base warm amber wood tone */
    background-color: #8b6432;

    /* Multiple layers:
       1. Wood grain tone variation (horizontal gradient)
       2. Ribbed panel shadow lines (repeating vertical)
       3. Panel highlight shimmer (repeating vertical, offset) */
    background-image:
      /* Warm ambient gradient — darker at corners, lighter centre-top */
      radial-gradient(ellipse 100% 80% at 60% 0%, rgba(200, 160, 80, 0.25) 0%, transparent 65%),
      radial-gradient(ellipse 60% 100% at 0% 50%, rgba(40, 20, 0, 0.25) 0%, transparent 55%),
      radial-gradient(ellipse 40% 100% at 100% 50%, rgba(40, 20, 0, 0.18) 0%, transparent 55%),

      /* Ribbed panel dividers — the key texture */
      repeating-linear-gradient(
        90deg,
        rgba(0, 0, 0, 0)      0px,
        rgba(0, 0, 0, 0)      16px,
        rgba(0, 0, 0, 0.14)   16px,
        rgba(0, 0, 0, 0.14)   17px,
        rgba(255, 220, 120, 0.06) 17px,
        rgba(255, 220, 120, 0.06) 18px,
        rgba(0, 0, 0, 0)      18px
      ),

      /* Subtle horizontal wood grain variation */
      repeating-linear-gradient(
        180deg,
        rgba(0, 0, 0, 0)     0px,
        rgba(0, 0, 0, 0.015) 3px,
        rgba(0, 0, 0, 0)     6px
      );
  }

  /* ── FLOOR — lighter warm strip at the bottom ───────────── */
  .floor {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 18%;
    background: linear-gradient(
      180deg,
      rgba(110, 80, 35, 0) 0%,
      rgba(100, 75, 30, 0.55) 100%
    );
  }

  /* ── WINDOW LIGHT BLOOM — warm sunlight from upper right ─── */
  .light-bloom {
    position: absolute;
    top: -10%;
    right: -5%;
    width: 55%;
    height: 65%;
    background: radial-gradient(
      ellipse at 80% 20%,
      rgba(255, 220, 130, 0.22) 0%,
      rgba(240, 180, 80, 0.08) 40%,
      transparent 70%
    );
    pointer-events: none;
  }

  /* ── LEFT SHADOW — suggests room depth ──────────────────── */
  .left-shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 20%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(30, 15, 0, 0.28) 0%,
      transparent 100%
    );
    pointer-events: none;
  }
</style>
