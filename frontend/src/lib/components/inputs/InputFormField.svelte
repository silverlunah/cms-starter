<script lang="ts">
  export let value: string;
  export let label: string;
  export let placeholder: string = "";
  export let fieldSetAdditionalClass: string = "";
  export let inputAdditionalClass: string = "";
  export let fieldError: string | null = null;
  export let type: string = "";
  export let description: string = "";
  export let disabled: boolean = false; // Add disabled prop
</script>

<fieldset class={"fieldset " + fieldSetAdditionalClass}>
  <legend class="fieldset-legend">{label}</legend>
  <input
    {type}
    {placeholder}
    class="input {fieldError ? 'input-error ' : ''} {inputAdditionalClass}"
    bind:value
    {disabled}
  />
  {#if description}
    <p class="label text-base-content">{description}</p>
  {/if}
  {#if fieldError}
    <p class="label text-error">{fieldError}</p>
  {/if}
</fieldset>
