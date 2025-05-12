<script lang="ts">
  export let firstName: string;
  export let lastName: string;
  export let size: "sm" | "md" | "lg";

  import { getFirstAndLastNameInitials } from "$lib/utils/common";

  let elementSizes: string;

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
