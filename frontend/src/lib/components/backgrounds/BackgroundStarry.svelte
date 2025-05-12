<script lang="ts">
  const numStars = 50;

  let stars = Array.from({ length: numStars }, () => generateStar());

  function generateStar() {
    const margin = 5;
    return {
      char: ["*", ".", "+"][Math.floor(Math.random() * 3)],
      top: Math.random() * (100 - margin * 2) + margin,
      left: Math.random() * (100 - margin * 2) + margin,
      size: Math.random() * 0.9 + 0.5,
    };
  }

  setInterval(() => {
    stars = stars.map(() => generateStar());
  }, 2000);
</script>

{#each stars as star (star)}
  <span
    class="absolute text-base-content opacity-30 animate-twinkle pointer-events-none transition-all duration-500 ease-in-out"
    style="
          left: {star.left}%;
          top: {star.top}%;
          font-size: {star.size}rem;
        "
  >
    {star.char}
  </span>
{/each}

<style>
  @keyframes twinkle {
    0%,
    100% {
      opacity: 0.2;
    }
    50% {
      opacity: 1;
    }
  }

  .animate-twinkle {
    animation: twinkle 2s infinite ease-in-out;
  }
</style>
