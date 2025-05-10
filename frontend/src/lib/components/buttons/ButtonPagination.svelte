<script lang="ts">
  export let totalPages: number;
  export let currentPage: number;
  export let goToPage: (page: number) => void;
</script>

<div class="join mt-4 justify-center">
  <button
    class="join-item btn"
    on:click={() => goToPage(currentPage - 1)}
    disabled={currentPage === 1}
  >
    «
  </button>

  {#each Array(totalPages) as _, index}
    <button
      class="join-item btn {currentPage === index + 1 ? 'btn-active' : ''}"
      on:click={() => goToPage(index + 1)}
    >
      {index + 1}
    </button>
  {/each}

  <button
    class="join-item btn"
    on:click={() => goToPage(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    »
  </button>
</div>
