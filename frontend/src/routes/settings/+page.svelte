<script lang="ts">
  import ButtonDelete from "$lib/components/buttons/ButtonDelete.svelte";
  import type { AllowedHost } from "$lib/types/allowedHost";
  import { formatTimeAndDateUS } from "$lib/utils/common";
  import { onMount } from "svelte";
  import { updateAllowedHost } from "$lib/api";
  import { getAllowedHosts } from "$lib/api/ApiAllowedHosts";

  let error: string | null = null;
  let allowedHosts: AllowedHost[] = [];

  let editingDisplayNameId: number | null = null;
  let editingUrlId: number | null = null;
  let editedValue = "";

  /**-----------------------
   *   General Functions
   -----------------------*/
  function startEditing(
    id: number,
    value: string,
    field: "displayName" | "url",
  ) {
    editedValue = value;
    if (field === "displayName") {
      editingDisplayNameId = id;
    } else {
      editingUrlId = id;
    }
  }

  function handleKeyOrBlur(
    e: KeyboardEvent | FocusEvent,
    id: number,
    field: "displayName" | "url",
  ) {
    if (e instanceof KeyboardEvent && e.key !== "Enter") return;
    submitEdit(id, field);
  }

  /**-----------------------
   *  API Call Functions
   -----------------------*/
  async function submitEdit(id: number, field: "displayName" | "url") {
    const host = allowedHosts.find((h) => Number(h.id) === id);
    if (!host) return;

    const newDisplayName =
      field === "displayName" ? editedValue : host.displayName;
    const newUrl = field === "url" ? editedValue : host.url;

    try {
      const updatedHost = await updateAllowedHost(id, newDisplayName, newUrl);

      allowedHosts = allowedHosts
        .map((h) => (h.id === updatedHost.id ? updatedHost : h))
        .filter((h): h is AllowedHost => h !== undefined);

      if (field === "displayName") {
        editingDisplayNameId = null;
      } else {
        editingUrlId = null;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "An unknown error occurred";
    }
  }

  /**-----------------------
   *  onMount Activities
   -----------------------*/
  onMount(async () => {
    allowedHosts = await getAllowedHosts();
  });
</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

<div class="relative text-white flex flex-col items-center justify-end p-4">
  {#if error}
    <p class="text-red-500">{error}</p>
  {:else if allowedHosts.length === 0}
    <p>Loading users...</p>
  {:else}
    <div class="card w-96 md:w-3xl pixel-p p-4 text-center">
      <div class="overflow-x-auto w-full">
        <table class="table min-w-[800px] mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>URL</th>
              <th>Actions</th>
              <th>Date Created</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {#each allowedHosts as allowedHost}
              <tr>
                <!-- Display Name -->
                <td class="text-left">
                  {#if editingDisplayNameId === Number(allowedHost.id)}
                    <input
                      bind:value={editedValue}
                      class="text-white p-1 w-full rounded"
                      onblur={(e) =>
                        handleKeyOrBlur(
                          e,
                          Number(allowedHost.id),
                          "displayName",
                        )}
                      onkeydown={(e) =>
                        handleKeyOrBlur(
                          e,
                          Number(allowedHost.id),
                          "displayName",
                        )}
                      autofocus
                    />
                  {:else}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <a
                      class="flex items-center justify-between gap-2 text-blue-500 cursor-pointer"
                      onclick={() =>
                        startEditing(
                          Number(allowedHost.id),
                          allowedHost.displayName,
                          "displayName",
                        )}
                    >
                      <p>{allowedHost.displayName}</p>
                    </a>
                  {/if}
                </td>

                <!-- URL -->
                <td class="text-left">
                  {#if editingUrlId === Number(allowedHost.id)}
                    <input
                      bind:value={editedValue}
                      class="text-white p-1 w-full rounded"
                      onblur={(e) =>
                        handleKeyOrBlur(e, Number(allowedHost.id), "url")}
                      onkeydown={(e) =>
                        handleKeyOrBlur(e, Number(allowedHost.id), "url")}
                      autofocus
                    />
                  {:else}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <a
                      class="flex items-center justify-between gap-2 text-blue-500 cursor-pointer"
                      onclick={() =>
                        startEditing(
                          Number(allowedHost.id),
                          allowedHost.url,
                          "url",
                        )}
                    >
                      <p>{allowedHost.url}</p>
                    </a>
                  {/if}
                </td>

                <!-- Actions -->
                <td class="text-left">
                  <ButtonDelete
                    label=""
                    additionalClass=""
                    onclick={() => alert("test")}
                  />
                </td>

                <!-- Created At -->
                <td class="text-left">
                  {formatTimeAndDateUS(allowedHost.createdAt)}
                </td>

                <!-- Updated At -->
                <td class="text-left">
                  {formatTimeAndDateUS(allowedHost.updatedAt)}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
