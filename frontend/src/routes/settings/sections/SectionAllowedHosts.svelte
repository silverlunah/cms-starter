<script lang="ts">
  import { z } from "zod";
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
  import SectionHeading from "$lib/components/pages/SectionHeading.svelte";
  import ButtonPagination from "$lib/components/buttons/ButtonPagination.svelte";
  import { triggerNotification } from "$lib/utils/notification";

  let error: string | null = null;
  let allowedHosts: AllowedHost[] = [];
  let selectedAllowedHost: AllowedHost | null = null;

  let fieldErrors: { [key: string]: string } = {}; // Store errors for each field

  let createDisplayName = "";
  let createUrl = "";

  let updateDisplayName = "";
  let updateUrl = "";

  let isAddingNewHost = false;

  let editingDisplayNameId: number | null = null;
  let editingUrlId: number | null = null;
  let editedValue = "";

  /**-----------------------
   *      Zod Schema
   -----------------------*/
  const allowedHostSchemaCreate = z.object({
    createDisplayName: z.string().min(1, "Display name is required"),
    createUrl: z
      .string()
      .url("URL is invalid. Make sure to include http:// or https://"),
  });

  const allowedHostSchemaUpdate = z.object({
    updateDisplayName: z.string().min(1, "Display name is required"),
    updateUrl: z
      .string()
      .url("URL is invalid. Make sure to include http:// or https://"),
  });

  /**-----------------------
   *   Users Pagination
   -----------------------*/
  let currentPage = 1;
  const usersPerPage = 5;

  $: totalPages = Math.ceil(allowedHosts.length / usersPerPage);

  $: paginatedAllowedHosts = allowedHosts.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  );

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

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

  function validateUniqueUrl(newUrl: string, excludeId?: number): boolean {
    const normalizedNewUrl = normalizeUrl(newUrl);
    const duplicate = allowedHosts.find(
      (h) =>
        normalizeUrl(h.url) === normalizedNewUrl &&
        (excludeId === undefined || Number(h.id) !== excludeId),
    );
    if (duplicate) {
      fieldErrors.updateUrl = "This URL is already in use";
      return false;
    }
    fieldErrors.updateUrl = "";
    return true;
  }

  /**-----------------------
   *  API Call Functions
   -----------------------*/
  async function handleCreateAllowedHost() {
    fieldErrors = {};

    if (!createDisplayName || !createUrl) {
      if (!createUrl) {
        fieldErrors.createUrl = "URL is required";
      }

      if (!createDisplayName) {
        fieldErrors.createDisplayName = "Display name is required";
      }
      return;
    }

    const validation = allowedHostSchemaCreate.safeParse({
      createUrl,
      createDisplayName,
    });

    if (!validation.success) {
      fieldErrors = {};
      for (const issue of validation.error.issues) {
        fieldErrors[issue.path[0]] = issue.message;
      }
      return;
    }

    try {
      const created = await createAllowedHost(createUrl, createDisplayName);
      triggerNotification("Successfully created " + createUrl, "success");
      allowedHosts = [created, ...allowedHosts];
      editedValue = "";
    } catch (err) {
      fieldErrors["createUrl"] =
        err instanceof Error ? err.message : "An unknown error occurred";
      return;
    }

    fieldErrors.url = "";
    updateDisplayName = "";
    updateUrl = "";
    listenRefreshAllowedHosts();
    isAddingNewHost = false;
  }

  async function handleUpdateAllowedHost(
    id: number,
    field: "displayName" | "url",
  ) {
    const host = allowedHosts.find((h) => Number(h.id) === id);
    if (!host) return;

    const updateDisplayName =
      field === "displayName" ? editedValue.trim() : host.displayName.trim();
    const updateUrl = field === "url" ? editedValue.trim() : host.url.trim();

    const isUnchanged =
      (field === "displayName" &&
        updateDisplayName === host.displayName.trim()) ||
      (field === "url" && normalizeUrl(updateUrl) === normalizeUrl(host.url));

    if (isUnchanged) {
      if (field === "displayName") {
        editingDisplayNameId = null;
      } else {
        editingUrlId = null;
      }
      return;
    }

    // Check if URL already exists
    if (!validateUniqueUrl(updateUrl, id)) return;

    // Zod schema validation
    const validation = allowedHostSchemaUpdate.safeParse({
      updateDisplayName,
      updateUrl,
    });

    if (!validation.success) {
      console.log(validation.error.issues);
      fieldErrors = {};
      for (const issue of validation.error.issues) {
        fieldErrors[issue.path[0]] = issue.message;
      }
      return;
    }

    try {
      const updatedHost = await updateAllowedHost(
        id,
        updateDisplayName,
        updateUrl,
      );

      triggerNotification("Successfully updated " + updateUrl, "success");

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
      triggerNotification(
        "Successfully deleted " + selectedAllowedHost.url,
        "success",
      );
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

{#if error}
  <p class="text-red-500">{error}</p>
{:else if allowedHosts.length === 0}
  <p>Loading Allowed Hosts Section...</p>
{:else}
  <div class="card w-96 md:w-3xl pixel-p p-4 text-center">
    <div class="w-full flex flex-col">
      <SectionHeading
        title="Allowed Hosts"
        description="If you have multiple websites that would utilize the CMS, you need
          to add each URL here to start making API calls."
      />
      <ButtonAdd
        onclick={() => (isAddingNewHost = !isAddingNewHost)}
        additionalClass="mr-auto"
        label="New"
      />
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
                    bind:value={createDisplayName}
                    class="input min-w-44 {fieldErrors.createDisplayName
                      ? 'input-error'
                      : ''}"
                    placeholder="Display Name"
                  />
                  {#if fieldErrors.createDisplayName}
                    <p class="label text-error">
                      {fieldErrors.createDisplayName}
                    </p>
                  {/if}
                </td>
                <td class="text-left">
                  <input
                    bind:value={createUrl}
                    class="input min-w-44 {fieldErrors.createUrl
                      ? 'input-error'
                      : ''}"
                    placeholder="URL"
                  />
                  {#if fieldErrors.createUrl}
                    <p class="label text-error">
                      {fieldErrors.createUrl}
                    </p>
                  {/if}
                </td>
                <td class="text-left">
                  <div class="flex justify-between gap-2">
                    <ButtonSave
                      label=""
                      onclick={() => handleCreateAllowedHost()}
                    />
                    <ButtonClose
                      label=""
                      onclick={() => {
                        updateDisplayName = "";
                        updateUrl = "";
                        isAddingNewHost = false;
                      }}
                    />
                  </div>
                </td>
                <td class="text-left"></td>
                <td class="text-left"></td>
              </tr>
            {/if}
            {#each paginatedAllowedHosts as allowedHost}
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
                      class="input min-w-44 {fieldErrors.updateDisplayName
                        ? 'input-error'
                        : ''}"
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
                    {#if fieldErrors.updateDisplayName}
                      <p class="label text-error">
                        {fieldErrors.updateDisplayName}
                      </p>
                    {/if}
                  {:else}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <!-- svelte-ignore a11y_missing_attribute -->
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
                      class="input min-w-44 {fieldErrors.updateUrl
                        ? 'input-error'
                        : ''}"
                      on:blur={(e) =>
                        handleKeyOrBlur(e, Number(allowedHost.id), "url")}
                      on:keydown={(e) =>
                        handleKeyOrBlur(e, Number(allowedHost.id), "url")}
                      autofocus
                    />
                    {#if fieldErrors.updateUrl}
                      <p class="label text-error">
                        {fieldErrors.updateUrl}
                      </p>
                    {/if}
                  {:else}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <!-- svelte-ignore a11y_missing_attribute -->
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
      <ButtonPagination {totalPages} {currentPage} {goToPage} />
    </div>
  </div>
{/if}

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
