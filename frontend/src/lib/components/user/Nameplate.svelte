<script lang="ts">
  import AvatarDefault from "./AvatarDefault.svelte";
  import AvatarHasImg from "./AvatarHasImg.svelte";

  interface Props {
    avatarUrl?: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    additionalClass?: string;
  }

  let {
    avatarUrl = "",
    username,
    firstName,
    lastName,
    email,
    additionalClass = "",
  }: Props = $props();
</script>

<div class={"flex items-center gap-3 " + additionalClass}>
  <div>
    {#if avatarUrl}
      <AvatarHasImg imgUrl={avatarUrl} size="sm" />
    {:else}
      <AvatarDefault {firstName} {lastName} size="sm" />
    {/if}
  </div>

  <!-- Info -->
  <div class="flex flex-col">
    <div class="text-sm font-bold text-base-content">
      {firstName}
      {lastName}
    </div>
    {#if username}
      <div class="text-xs dark:text-gray-400">
        @{username}
      </div>
    {/if}
    <div class="text-xs dark:text-gray-400">{email}</div>
  </div>
</div>
