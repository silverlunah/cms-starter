<script lang="ts">
  interface Props {
    title: string;
    description?: string;
  }

  let { title, description = "" }: Props = $props();
</script>

<div class="divider divider-start text-xl text-base-content">{title}</div>
<div class="w-full flex text-left">
  <p class="text-sm text-base-content">{description}</p>
</div>
