<script lang="ts">
  export let onclick: () => void;
  export let label: string;
  export let additionalClass: string = "";
</script>

<button
  class={"btn btn-soft btn-success " + additionalClass}
  on:click={onclick}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="size-6"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="m4.5 12.75 6 6 9-13.5"
    />
  </svg>

  {label}
</button>
