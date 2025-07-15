<script lang="ts">
  interface Props {
    label: string;
  }

  let { label }: Props = $props();
</script>

<div class="badge badge-sm badge-ghost whitespace-nowrap">{label}</div>
