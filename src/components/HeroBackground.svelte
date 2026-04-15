<!-- Room background photo — full-bleed, covers scene -->
<div class="room-bg"></div>

<style>
  .room-bg {
    position: absolute;
    inset: 0;
    z-index: 0;

    background-image: url('https://www.svenssons.se/assets/contentful/5dqc39pi2ix6/Gow0uuArirwKzHpiZHJRP/4d481c464d1b81fec2882bfd9c19810a/BILDD.jpg');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;

    /* Slight warmth boost */
    filter: brightness(1.04) saturate(1.08);
  }

  /* Soft radial vignette so the glass panel pops */
  .room-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 90% 80% at 50% 40%,
      transparent 40%,
      rgba(220, 200, 170, 0.18) 100%
    );
    pointer-events: none;
  }
</style>
