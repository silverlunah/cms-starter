<script lang="ts">
  interface Props {
    imgUrl: string;
    size: "sm" | "md" | "lg";
  }

  let { imgUrl, size }: Props = $props();

  let avatarSize: string = $state();

  switch (size) {
    default:
    case "sm":
      avatarSize = "w-12 text-xl";
      break;
    case "md":
      avatarSize = "w-24 text-3xl";
      break;
    case "lg":
      avatarSize = "w-36 text-4xl";
      break;
  }
</script>

<div class="avatar">
  <div class={"mask mask-squircle " + avatarSize}>
    <img alt="Change Image Avatar" src={imgUrl} />
  </div>
</div>
