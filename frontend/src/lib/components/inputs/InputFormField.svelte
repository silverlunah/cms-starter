<script lang="ts">
  interface Props {
    value: string;
    label?: string;
    placeholder?: string;
    fieldSetAdditionalClass?: string;
    inputAdditionalClass?: string;
    fieldError?: string | null;
    type?: string;
    description?: string;
    disabled?: boolean; // Add disabled prop
  }

  let {
    value = $bindable(),
    label = "",
    placeholder = "",
    fieldSetAdditionalClass = "",
    inputAdditionalClass = "",
    fieldError = null,
    type = "",
    description = "",
    disabled = false
  }: Props = $props();
</script>

<fieldset class={"fieldset " + fieldSetAdditionalClass}>
  {#if label}
    <legend class="fieldset-legend">{label}</legend>
  {/if}
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
