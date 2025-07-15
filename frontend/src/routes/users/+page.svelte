<script lang="ts">
  import { DATE } from "$lib/constants/common";
  import { onMount } from "svelte";
  import type { User } from "$lib/types/user";
  import { getUsers } from "$lib/api";
  import { formatTimeAndDateUS, triggerModal } from "$lib/utils/common";
  import ModalCreateUser from "./modals/ModalCreateUser.svelte";
  import ModalUpdateUser from "./modals/ModalUpdateUser.svelte";
  import ButtonAdd from "$lib/components/buttons/ButtonAdd.svelte";
  import InputSearch from "$lib/components/inputs/InputSearch.svelte";
  import TextBackgroundDateAndTime from "$lib/components/textbackgrounds/TextBackgroundDateAndTime.svelte";
  import TextBackgroundRole from "$lib/components/textbackgrounds/TextBackgroundRole.svelte";
  import PageSectionHeading from "$lib/components/pages/PageSectionHeading.svelte";
  import ButtonPagination from "$lib/components/buttons/ButtonPagination.svelte";
  import PageWrapper from "$lib/components/pages/PageWrapper.svelte";
  import IndicatorIsLocked from "$lib/components/indicators/IndicatorIsLocked.svelte";
  import Nameplate from "$lib/components/user/Nameplate.svelte";
  import PageSection from "$lib/components/pages/PageSection.svelte";
  import LoadingIndicatorPage from "$lib/components/loading/LoadingIndicatorPage.svelte";

  let users: User[] = $state([]);
  let selectedUser: User | null = $state(null);

  let errorMessage: string | null = null;

  /**-----------------------
   *   Users Pagination
   -----------------------*/
  let currentPage = $state(1);
  const usersPerPage = 10;

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  /**-----------------------
   *    Event Listeners
   -----------------------*/
  async function listenRefreshUser() {
    selectedUser = null;
    users = await getUsers();
  }

  /**-----------------------
   *  Reactive Statements
    -----------------------*/
  let searchQuery = $state("");

  /**-----------------------
   *  onMount Activities
   -----------------------*/
  onMount(async () => {
    users = await getUsers();
  });
  let filteredUsers = $derived(
    users.filter((user) =>
      `${user.firstName} ${user.lastName} ${user.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    ),
  );
  let totalPages = $derived(Math.ceil(filteredUsers.length / usersPerPage));
  let paginatedUsers = $derived(
    filteredUsers.slice(
      (currentPage - 1) * usersPerPage,
      currentPage * usersPerPage,
    ),
  );
</script>

<svelte:head>
  <title>Users</title>
</svelte:head>

<PageWrapper>
  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {:else if users.length === 0}
    <LoadingIndicatorPage />
  {:else}
    <PageSectionHeading
      title="User Management"
      description="Manage your users in this page. Create, add, disable, and delete users. You can also change or assign roles."
    />
    <PageSection>
      <div class="flex gap-4">
        <InputSearch
          placeholder="Search"
          additionalClass="w-3/4"
          bind:value={searchQuery}
        />
        <ButtonAdd
          onclick={() => triggerModal("createUserModal")}
          additionalClass="flex items-center gap-2 w-1/4"
          label="New"
        />
      </div>
      <div class="flex flex-col">
        <div class="overflow-x-auto w-full">
          <table class="table min-w-[800px] mt-4">
            <!-- head -->
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Role</th>
                <th>Date Created</th>
                <th>Last Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {#each paginatedUsers as user}
                <tr
                  onclick={() => {
                    selectedUser = user;
                    triggerModal("updateUserModal");
                  }}
                >
                  <!-- Status -->
                  <td class="text-center align-middle">
                    <div class="flex items-center justify-center gap-3">
                      <!-- Lock status -->
                      {#if user.isLocked}
                        <div
                          class="inline-grid place-items-center *:[grid-area:1/1]"
                        >
                          <IndicatorIsLocked />
                        </div>
                      {/if}
                      <!-- Active status -->
                      <div
                        class="inline-grid place-items-center *:[grid-area:1/1]"
                      >
                        <div
                          class="status {user.isActive
                            ? 'status-success'
                            : 'status-errorMessage'} animate-ping"
                        ></div>
                        <div
                          class="status {user.isActive
                            ? 'status-success'
                            : 'status-errorMessage'}"
                        ></div>
                      </div>
                    </div>
                  </td>

                  <!-- Name -->
                  <td>
                    <!-- Avatar -->
                    <Nameplate
                      avatarUrl={user.avatarUrl}
                      username={user.username}
                      firstName={user.firstName}
                      lastName={user.lastName}
                      email={user.email}
                    />
                  </td>

                  <!-- Role -->
                  <td>
                    <TextBackgroundRole role={user.role} />
                  </td>

                  <!-- Created At -->
                  <td>
                    {#if user.createdAt === DATE.NOT_YET_UPDATED_INDICATOR}
                      <TextBackgroundDateAndTime
                        label={DATE.NOT_YET_UPDATED_STRING}
                      />
                    {:else}
                      <TextBackgroundDateAndTime
                        label={formatTimeAndDateUS(user.createdAt)}
                      />
                    {/if}
                  </td>

                  <!-- Updated At -->
                  <td>
                    {#if user.updatedAt === DATE.NOT_YET_UPDATED_INDICATOR}
                      <TextBackgroundDateAndTime
                        label={DATE.NOT_YET_UPDATED_STRING}
                      />
                    {:else}
                      <TextBackgroundDateAndTime
                        label={formatTimeAndDateUS(user.updatedAt)}
                      />
                    {/if}
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
  <ModalCreateUser {listenRefreshUser} />
  <ModalUpdateUser {selectedUser} {listenRefreshUser} />
</PageWrapper>
