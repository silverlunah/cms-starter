<script lang="ts">
  import {
    notificationMessage,
    notificationType,
  } from "$lib/stores/notification";
  import { onDestroy } from "svelte";
  import { fly } from "svelte/transition";

  let message = $state("");
  let type: "success" | "fail" | "standard" = $state("standard");
  let timeoutId: ReturnType<typeof setTimeout>;

  const unsubMessage = notificationMessage.subscribe((value) => {
    message = value;
    if (value) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        notificationMessage.set("");
      }, 5000);
    }
  });

  const unsubType = notificationType.subscribe((value) => {
    if (value === "success" || value === "fail" || value === "standard") {
      type = value;
    }
  });

  onDestroy(() => {
    clearTimeout(timeoutId);
    unsubMessage();
    unsubType();
  });

  let bubbleClass = $derived(
    type === "success"
      ? ""
      : type === "fail"
        ? "chat-bubble-error"
        : "chat-bubble-primary",
  );

  let icon = $derived(
    {
      success: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 animate-shake">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>`,
      fail: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size- animate-shake6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>`,
      standard: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 animate-shake">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
      </svg>`,
    }[type],
  );
</script>

{#if message}
  <div
    class={`chat-bubble fixed bottom-0 right-0 mb-4 mr-4 whitespace-nowrap ${bubbleClass} text-sm`}
    transition:fly={{ y: 20, duration: 300 }}
  >
    <div class="flex flex-row">
      {@html icon} &nbsp {message}
    </div>
  </div>
{/if}

<style>
  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    20%,
    60% {
      transform: translateX(-2px);
    }
    40%,
    80% {
      transform: translateX(2px);
    }
  }
  .animate-shake {
    animation: shake 0.4s ease-in-out;
  }
</style>
