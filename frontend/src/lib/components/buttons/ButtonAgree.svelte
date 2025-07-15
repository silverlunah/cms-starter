<script lang="ts">
  interface Props {
    onclick: () => void;
    label: string;
    additionalClass?: string;
  }

  let { onclick, label, additionalClass = "" }: Props = $props();
</script>

<button class={"btn btn-success " + additionalClass} {onclick}>
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
