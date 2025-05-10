<script lang="ts">
  export let title: string;
  export let description: string;
</script>
<div class="mb-4">
    <div class="divider divider-start text-xl">{title}</div>
    <div class="w-full flex text-left mb-4">
    <p class="text-sm text-gray-400">{description}</p>
    </div>
</div>