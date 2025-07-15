<script lang="ts">
  import { getFirstAndLastNameInitials } from "$lib/utils/common";
  interface Props {
    firstName: string;
    lastName: string;
    size: "sm" | "md" | "lg";
  }

  let { firstName, lastName, size }: Props = $props();

  let elementSizes: string = $state();

  switch (size) {
    default:
    case "sm":
      elementSizes = "w-12 text-xl";
      break;
    case "md":
      elementSizes = "w-24 text-3xl";
      break;
    case "lg":
      elementSizes = "w-36 text-4xl";
      break;
  }
</script>

<div class="avatar avatar-placeholder">
  <div
    class={"mask mask-squircle bg-gray-600 text-neutral-content " +
      elementSizes}
  >
    <span class="select-none">
      {getFirstAndLastNameInitials(firstName, lastName)}
    </span>
  </div>
</div>
