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
    class="w-5 h-5"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
  {label}
</button>
