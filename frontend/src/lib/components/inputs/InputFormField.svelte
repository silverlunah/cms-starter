<script lang="ts">
  export let value: string;
  export let label: string;
  export let placeholder: string = "";
  export let additionalClass: string = "";
  export let fieldError: string | null = null;
  export let type: string = "";
</script>

<legend class="fieldset-legend">{label}</legend>
<input
  {type}
  {placeholder}
  class="input {fieldError ? 'input-error ' : ''} {additionalClass}"
  bind:value
/>
{#if fieldError}
  <p class="label text-error">{fieldError}</p>
{/if}
