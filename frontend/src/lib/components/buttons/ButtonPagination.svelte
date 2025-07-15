<script lang="ts">
  interface Props {
    totalPages: number;
    currentPage: number;
    goToPage: (page: number) => void;
  }

  let { totalPages, currentPage, goToPage }: Props = $props();
</script>

<div class="join mt-4 justify-center">
  <button
    class="join-item btn"
    onclick={() => goToPage(currentPage - 1)}
    disabled={currentPage === 1}
  >
    «
  </button>

  {#each Array(totalPages) as _, index}
    <button
      class="join-item btn {currentPage === index + 1 ? 'btn-active' : ''}"
      onclick={() => goToPage(index + 1)}
    >
      {index + 1}
    </button>
  {/each}

  <button
    class="join-item btn"
    onclick={() => goToPage(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    »
  </button>
</div>
