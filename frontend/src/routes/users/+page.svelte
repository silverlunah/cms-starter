<script lang="ts">
  import { PUBLIC_API_URL } from "$env/static/public";
  import { DATE } from "$lib/constants/common";
  import { onMount } from "svelte";
  import type { User, RawUser, UsersResponse } from "$lib/types/user";
  import {
    formatTimeAndDateUS,
    getFirstAndLastNameInitials,
    triggerModal,
  } from "$lib/utils/common";
  import ModalCreateUser from "$lib/components/modals/ModalCreateUser.svelte";
  import ModalEditUser from "$lib/components/modals/ModalEditUser.svelte";
  import ButtonAdd from "$lib/components/buttons/ButtonAdd.svelte";
  import DefaultAvatar from "$lib/components/user/DefaultAvatar.svelte";
  import InputSearch from "$lib/components/inputs/InputSearch.svelte";

  let users: User[] = [];
  let error: string | null = null;
  let selectedUser: User | null = null;
  let searchQuery = "";

  /**-----------------------
   *    Event Listeners
   -----------------------*/
  async function listenRefresh() {
    selectedUser = null;
    getUsers();
  }

  /**-----------------------
   *  Reactive Statements
    -----------------------*/
  $: filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  /**-----------------------
   *  API Call Functions
   -----------------------*/
  async function getUsers() {
    try {
      const res = await fetch(PUBLIC_API_URL + "/users", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch users");

      const data: UsersResponse = await res.json();

      users = data.users
        .map(
          (user: User): User => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            createdAt: new Date(user.createdAt).toLocaleString(),
            updatedAt: new Date(user.updatedAt).toLocaleString(),
          }),
        )
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
    } catch (err) {
      error = err instanceof Error ? err.message : "An unknown error occurred";
    }
  }

  /**-----------------------
   *   onMount Functions
   -----------------------*/
  onMount(async () => {
    await getUsers();
  });
</script>

<svelte:head>
  <title>Users</title>
</svelte:head>

<div class="relative text-white flex flex-col items-center justify-end p-4">
  {#if error}
    <p class="text-red-500">{error}</p>
  {:else if users.length === 0}
    <p>Loading users...</p>
  {:else}
    <div class="card w-96 md:w-3xl pixel-p p-4 text-center">
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
      <div class="overflow-x-auto w-full">
        <table class="table min-w-[800px] mt-4">
          <!-- head -->
          <thead>
            <tr>
              <th>Status</th>
              <th>Name</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {#each filteredUsers as user}
              <tr
                onclick={() => {
                  triggerModal("updateUserModal");
                  selectedUser = user;
                }}
              >
                <td class="text-center align-middle">
                  {#if !user.isActive}
                    <div
                      class="inline-grid place-items-center *:[grid-area:1/1]"
                    >
                      <div class="status status-error animate-ping"></div>
                      <div class="status status-error"></div>
                    </div>
                  {:else}
                    <div
                      class="inline-grid place-items-center *:[grid-area:1/1]"
                    >
                      <div class="status status-success animate-ping"></div>
                      <div class="status status-success"></div>
                    </div>
                  {/if}
                </td>
                <td>
                  <div class="flex items-center gap-3">
                    <DefaultAvatar
                      firstName={user.firstName}
                      lastName={user.lastName}
                      size="sm"
                    />
                    <div>
                      <div class="font-bold">
                        {user.firstName}
                        {user.lastName}
                      </div>
                      <div class="text-sm opacity-50">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {#if user.role === 0}
                    <span class="badge badge-secondary badge-sm">Admin</span>
                  {:else}
                    <span class="badge badge-primary badge-sm">User</span>
                  {/if}
                </td>
                <td>{formatTimeAndDateUS(user.createdAt)}</td>
                <td>
                  {#if user.updatedAt === DATE.NOT_YET_UPDATED_INDICATOR}
                    {DATE.NOT_YET_UPDATED_STRING}
                  {:else}
                    {formatTimeAndDateUS(user.updatedAt)}
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
  <ModalCreateUser {listenRefresh} />
  <ModalEditUser {selectedUser} {listenRefresh} />
</div>
