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
  import PageSectionHeading from "$lib/components/pages/PageSectionHeading.svelte";
  import ButtonPagination from "$lib/components/buttons/ButtonPagination.svelte";
  import { triggerNotification } from "$lib/utils/notification";
  import InputFormField from "$lib/components/inputs/InputFormField.svelte";
  import Modal from "$lib/components/modals/Modal.svelte";
  import PageSection from "$lib/components/pages/PageSection.svelte";
  import LoadingIndicatorPage from "$lib/components/loading/LoadingIndicatorPage.svelte";
  import { createAllowedHostSchema } from "$lib/zschemas/createAllowedHostSchema";
  import { updateAllowedHostSchema } from "$lib/zschemas/updateAllowedHostSchema";

  let error: string | null = $state(null);
  let allowedHosts: AllowedHost[] = $state([]);
  let selectedAllowedHost: AllowedHost | null = $state(null);

  let fieldErrors: { [key: string]: string } = $state({});

  let createDisplayName = $state("");
  let createUrl = $state("");

  let updateDisplayName = $state("");
  let updateUrl = $state("");

  let isAddingNewHost = $state(false);

  let editingDisplayNameId: string | null = $state(null);
  let editingUrlId: string | null = $state(null);
  let editedValue = $state("");

  /**-----------------------
   *   Users Pagination
   -----------------------*/
  let currentPage = $state(1);
  const usersPerPage = 5;

  let totalPages = $derived(Math.ceil(allowedHosts.length / usersPerPage));

  let paginatedAllowedHosts = $derived(
    allowedHosts.slice(
      (currentPage - 1) * usersPerPage,
      currentPage * usersPerPage,
    ),
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
    id: string,
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
    id: string,
    field: "displayName" | "url",
  ) {
    if (e instanceof KeyboardEvent && e.key !== "Enter") return;
    handleUpdateAllowedHost(id, field);
  }

  function validateUniqueUrl(newUrl: string, excludeId?: string): boolean {
    const normalizedNewUrl = normalizeUrl(newUrl);
    const duplicate = allowedHosts.find(
      (h) =>
        normalizeUrl(h.url) === normalizedNewUrl &&
        (excludeId === undefined || String(h.id) !== excludeId),
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

    const validation = createAllowedHostSchema.safeParse({
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
    createDisplayName = "";
    createUrl = "";
    listenRefreshAllowedHosts();
    isAddingNewHost = false;
  }

  async function handleUpdateAllowedHost(
    id: string,
    field: "displayName" | "url",
  ) {
    const host = allowedHosts.find((h) => String(h.id) === id);
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
    const validation = updateAllowedHostSchema.safeParse({
      updateDisplayName,
      updateUrl,
    });

    if (!validation.success) {
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
  <LoadingIndicatorPage />
{:else}
  <PageSectionHeading
    title="Allowed Hosts"
    description="If you have multiple websites that would utilize the CMS, you need
          to add each URL here to start making API calls."
  />
  <PageSection>
    <ButtonAdd
      onclick={() => (isAddingNewHost = !isAddingNewHost)}
      additionalClass="mr-auto"
      label="New"
    />
    <div class="flex flex-col">
      <div class="overflow-x-auto w-full">
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
                  <InputFormField
                    bind:value={createDisplayName}
                    type="text"
                    placeholder="Display Name"
                    fieldSetAdditionalClass="min-w-44 w-1/2"
                    inputAdditionalClass="w-full"
                    fieldError={fieldErrors.createDisplayName}
                  />
                </td>
                <td class="text-left">
                  <InputFormField
                    bind:value={createUrl}
                    type="text"
                    placeholder="URL"
                    fieldSetAdditionalClass="min-w-44 w-1/2"
                    inputAdditionalClass="w-full"
                    fieldError={fieldErrors.createUrl}
                  />
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
                  {#if editingDisplayNameId === allowedHost.id && normalizeUrl(allowedHost.url) !== normalizeUrl(window.location.origin)}
                    <input
                      bind:value={editedValue}
                      class="input min-w-44 {fieldErrors.updateDisplayName
                        ? 'input-error'
                        : ''}"
                      onblur={(e) =>
                        handleKeyOrBlur(e, allowedHost.id, "displayName")}
                      onkeydown={(e) =>
                        handleKeyOrBlur(e, allowedHost.id, "displayName")}
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
                      onclick={normalizeUrl(allowedHost.url) !==
                      normalizeUrl(window.location.origin)
                        ? () =>
                            startEditing(
                              allowedHost.id,
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
                  {#if editingUrlId === allowedHost.id && normalizeUrl(allowedHost.url) !== normalizeUrl(window.location.origin)}
                    <input
                      bind:value={editedValue}
                      class="input min-w-44 {fieldErrors.updateUrl
                        ? 'input-error'
                        : ''}"
                      onblur={(e) => handleKeyOrBlur(e, allowedHost.id, "url")}
                      onkeydown={(e) =>
                        handleKeyOrBlur(e, allowedHost.id, "url")}
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
                      onclick={normalizeUrl(allowedHost.url) !==
                      normalizeUrl(window.location.origin)
                        ? () =>
                            startEditing(allowedHost.id, allowedHost.url, "url")
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
  </PageSection>
{/if}

<Modal
  id="confirmDeleteAllowedHostModal"
  label="Confirm Delete"
  additionalClass="modal-box max-w-96 max-h-3/4"
>
  <p class="text-center">
    Are you sure you want to delete <strong>{selectedAllowedHost?.url}</strong>?
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
</Modal>
