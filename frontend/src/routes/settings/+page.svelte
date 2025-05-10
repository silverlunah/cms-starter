<script lang="ts">
  import ButtonDelete from "$lib/components/buttons/ButtonDelete.svelte";
  import type { AllowedHost } from "$lib/types/allowedHost";
  import {
    closeModal,
    formatTimeAndDateUS,
    normalizeUrl,
    triggerModal,
  } from "$lib/utils/common";
  import { onMount } from "svelte";
  import {
    getAllowedHosts,
    createAllowedHost,
    updateAllowedHost,
    deleteAllowedHost,
  } from "$lib/api";
  import TextBackgroundDateAndTime from "$lib/components/textbackgrounds/TextBackgroundDateAndTime.svelte";
  import ButtonClose from "$lib/components/buttons/ButtonClose.svelte";
  import ButtonAdd from "$lib/components/buttons/ButtonAdd.svelte";
  import ButtonSave from "$lib/components/buttons/ButtonSave.svelte";

  let error: string | null = null;
  let allowedHosts: AllowedHost[] = [];
  let selectedAllowedHost: AllowedHost | null = null;

  let fieldErrors: { [key: string]: string } = {}; // Store errors for each field

  let newDisplayName = "";
  let newUrl = "";
  let isAddingNewHost = false;

  let editingDisplayNameId: number | null = null;
  let editingUrlId: number | null = null;
  let editedValue = "";

  /**-----------------------
   *    Event Listeners
   -----------------------*/
  async function listenRefreshAllowedHosts() {
    allowedHosts = await getAllowedHosts();
  }

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
    handleUpdateAllowedHost(id, field);
  }

  /**-----------------------
   *  API Call Functions
   -----------------------*/
  async function handleCreateUser() {
    
  }

  async function handleUpdateAllowedHost(
    id: number,
    field: "displayName" | "url",
  ) {
    const host = allowedHosts.find((h) => Number(h.id) === id);
    if (!host) return;

    const newDisplayName =
      field === "displayName" ? editedValue.trim() : host.displayName.trim();
    const newUrl = field === "url" ? editedValue.trim() : host.url.trim();

    const isUnchanged =
      (field === "displayName" && newDisplayName === host.displayName.trim()) ||
      (field === "url" && normalizeUrl(newUrl) === normalizeUrl(host.url));

    if (isUnchanged) {
      if (field === "displayName") {
        editingDisplayNameId = null;
      } else {
        editingUrlId = null;
      }
      return;
    }

    // Check if URL already exists
    const existingHost = allowedHosts.find(
      (h) => normalizeUrl(h.url) === normalizeUrl(newUrl),
    );
    if (existingHost) {
      fieldErrors.url = "This URL is already in use!";
      return;
    } else {
      fieldErrors.url = ""; // Clear the error if URL is unique
    }

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

    listenRefreshAllowedHosts();
  }

  async function handleDeleteAllowedHost() {
    if (!selectedAllowedHost || !selectedAllowedHost.id) return;

    try {
      await deleteAllowedHost(selectedAllowedHost?.id);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    }

    listenRefreshAllowedHosts();
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
  <h1 class="text-2xl">Settings</h1>

  {#if error}
    <p class="text-red-500">{error}</p>
  {:else if allowedHosts.length === 0}
    <p>Loading users...</p>
  {:else}
    <div class="card w-96 md:w-3xl pixel-p p-4 text-center">
      <div class="w-full flex flex-col">
        <div class="divider divider-start text-xl">Allowed Hosts</div>
        <div class="w-full flex text-left mb-4">
          <p class="text-sm w-3/4 text-gray-400">
            If you have multiple websites that would utilize the CMS, you need
            to add each URL here to start making API calls.
          </p>
          <ButtonAdd
            onclick={() => (isAddingNewHost = !isAddingNewHost)}
            additionalClass="ml-auto"
            label="New"
          />
        </div>
        <div class="overflow-x-auto max-h-[400px] overflow-y-auto w-full">
          <table class="table min-w-[800px] mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
                <th>Action</th>
                <th>Date Created</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {#if isAddingNewHost}
                <!-- New Row Input Fields -->
                <tr>
                  <td class="text-left">
                    <input
                      bind:value={newDisplayName}
                      class="input text-white min-w-44"
                      placeholder="Display Name"
                    />
                  </td>
                  <td class="text-left">
                    <input
                      bind:value={newUrl}
                      class="input text-white min-w-44"
                      placeholder="URL"
                    />
                  </td>
                  <td class="text-left">
                    <div class="flex justify-between gap-2">
                      <ButtonSave
                        label=""
                          onclick={() => {
                          newDisplayName = "";
                          newUrl = "";
                          
                          listenRefreshAllowedHosts();
                          isAddingNewHost = false;
                        }}
                      />
                      <ButtonClose
                        label=""
                        onclick={() => {
                          newDisplayName = "";
                          newUrl = "";
                          isAddingNewHost = false;
                        }}
                      />
                    </div>
                  </td>
                  <td class="text-left"></td>
                  <td class="text-left"></td>
                </tr>
              {/if}
              {#each allowedHosts as allowedHost}
                <tr
                  class={normalizeUrl(allowedHost.url) ===
                  normalizeUrl(window.location.origin)
                    ? "opacity-50 pointer-events-none"
                    : ""}
                >
                  <!-- Display Name -->
                  <td class="text-left">
                    {#if editingDisplayNameId === Number(allowedHost.id) && normalizeUrl(allowedHost.url) !== normalizeUrl(window.location.origin)}
                      <input
                        bind:value={editedValue}
                        class="input text-white min-w-44"
                        on:blur={(e) =>
                          handleKeyOrBlur(
                            e,
                            Number(allowedHost.id),
                            "displayName",
                          )}
                        on:keydown={(e) =>
                          handleKeyOrBlur(
                            e,
                            Number(allowedHost.id),
                            "displayName",
                          )}
                        autofocus
                      />
                    {:else}
                      <a
                        class="flex items-center justify-between gap-2 text-blue-500 {normalizeUrl(
                          allowedHost.url,
                        ) === normalizeUrl(window.location.origin)
                          ? 'cursor-not-allowed text-gray-400'
                          : 'cursor-pointer'}"
                        on:click={normalizeUrl(allowedHost.url) !==
                        normalizeUrl(window.location.origin)
                          ? () =>
                              startEditing(
                                Number(allowedHost.id),
                                allowedHost.displayName,
                                "displayName",
                              )
                          : null}
                      >
                        <p class="whitespace-nowrap">
                          {allowedHost.displayName}
                        </p>
                      </a>
                    {/if}
                  </td>

                  <!-- URL -->
                  <td class="text-left">
                    {#if editingUrlId === Number(allowedHost.id) && normalizeUrl(allowedHost.url) !== normalizeUrl(window.location.origin)}
                      <input
                        bind:value={editedValue}
                        class="input text-white min-w-44 {fieldErrors.url
                          ? 'input-error'
                          : ''}"
                        on:blur={(e) =>
                          handleKeyOrBlur(e, Number(allowedHost.id), "url")}
                        on:keydown={(e) =>
                          handleKeyOrBlur(e, Number(allowedHost.id), "url")}
                        autofocus
                      />
                      {#if fieldErrors.url}
                        <p class="label input-label-warning">
                          {fieldErrors.url}
                        </p>
                      {/if}
                    {:else}
                      <a
                        class="flex items-center justify-between gap-2 text-blue-500 {normalizeUrl(
                          allowedHost.url,
                        ) === normalizeUrl(window.location.origin)
                          ? 'cursor-not-allowed text-gray-400'
                          : 'cursor-pointer'}"
                        on:click={normalizeUrl(allowedHost.url) !==
                        normalizeUrl(window.location.origin)
                          ? () =>
                              startEditing(
                                Number(allowedHost.id),
                                allowedHost.url,
                                "url",
                              )
                          : null}
                      >
                        <p class="whitespace-nowrap">{allowedHost.url}</p>
                      </a>
                    {/if}
                  </td>

                  <!-- Actions -->
                  <td class="text-left">
                    <ButtonDelete
                      label="Delete"
                      additionalClass={normalizeUrl(allowedHost.url) ===
                      normalizeUrl(window.location.origin)
                        ? "btn-disabled"
                        : ""}
                      disabled={normalizeUrl(allowedHost.url) ===
                        normalizeUrl(window.location.origin)}
                      onclick={() => {
                        normalizeUrl(allowedHost.url) !==
                          normalizeUrl(window.location.origin);
                        selectedAllowedHost = allowedHost;
                        triggerModal("confirmDeleteAllowedHostModal");
                      }}
                    />
                  </td>

                  <!-- Created At -->
                  <td class="text-left">
                    <TextBackgroundDateAndTime
                      label={formatTimeAndDateUS(allowedHost.createdAt)}
                    />
                  </td>

                  <!-- Updated At -->
                  <td class="text-left">
                    <TextBackgroundDateAndTime
                      label={formatTimeAndDateUS(allowedHost.updatedAt)}
                    />
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}
</div>

<dialog id="confirmDeleteAllowedHostModal" class="modal">
  <div class="modal-box max-w-96 max-h-3/4">
    <div class="flex flex-col gap-6">
      <h3 class="font-bold text-lg text-center">Confirm Deletion</h3>
      <p class="text-center">
        Are you sure you want to delete <strong
          >{selectedAllowedHost?.url}</strong
        >?
        <br /><br />This action
        <span class="text-red-500 font-semibold">cannot be undone</span>.
      </p>
      <div class="modal-action justify-center">
        <ButtonDelete
          label="Yes, Delete"
          onclick={() => {
            handleDeleteAllowedHost();
            closeModal("confirmDeleteAllowedHostModal");
          }}
        />
        <ButtonClose
          label="No"
          onclick={() => closeModal("confirmDeleteAllowedHostModal")}
        />
      </div>
    </div>
  </div>
</dialog>
