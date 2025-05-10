<script lang="ts">
  import { z } from "zod";
  import { PUBLIC_API_URL } from "$env/static/public";
  import type { User } from "$lib/types/user";
  import {
    toProperCase,
    closeModal,
    getFirstAndLastNameInitials,
    triggerModal,
    formatTimeAndDateUS,
  } from "$lib/utils/common";
  import { onMount } from "svelte";
  import ButtonSave from "../buttons/ButtonSave.svelte";
  import ButtonClose from "../buttons/ButtonClose.svelte";
  import ButtonDelete from "../buttons/ButtonDelete.svelte";
  import ButtonAgree from "../buttons/ButtonAgree.svelte";
  import DefaultAvatar from "../user/DefaultAvatar.svelte";
  import { deleteUser, toggleUserStatus, updateUser } from "$lib/api";

  export let selectedUser: User | null = null;
  export let listenRefreshUser: () => void;

  let users: User[] = [];
  let confirmDeleteEmail = "";
  let errorMessage = "";
  let successMessage = "";

  /**-----------------------
   *    Form Variables
   -----------------------*/
  let firstName = "";
  let lastName = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let role = 0;

  let fieldErrors: Record<string, string> = {};

  /**-----------------------
   *      Zod Schema
   -----------------------*/
  const userSchema = z
    .object({
      firstName: z.string().min(1, { message: "First name is required" }),
      lastName: z.string().min(1, { message: "Last name is required" }),
      email: z.string().email({ message: "Invalid email format" }),
      password: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 6, {
          message: "Password must be at least 6 characters",
        }),
      confirmPassword: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 6, {
          message: "Password must be at least 6 characters",
        }),
    })
    .refine(
      (data) => {
        if (!data.password && !data.confirmPassword) return true;
        return data.password === data.confirmPassword;
      },
      {
        path: ["confirmPassword"],
        message: "Passwords do not match",
      },
    );

  /**-----------------------
   *  Reactive Statements
    -----------------------*/
  $: if (selectedUser) {
    firstName = selectedUser.firstName;
    lastName = selectedUser.lastName;
    email = selectedUser.email;
    role = selectedUser.role;
  }

  $: isDirty =
    selectedUser &&
    (firstName !== selectedUser.firstName ||
      lastName !== selectedUser.lastName ||
      email.toLowerCase() !== selectedUser.email.toLowerCase() ||
      role !== selectedUser.role ||
      password.length > 0 || // only care if password is being updated
      confirmPassword.length > 0);

  /**-----------------------
   *   General Functions
   -----------------------*/
  function resetForm() {
    errorMessage = "";
    successMessage = "";
    fieldErrors = {};
    firstName = "";
    lastName = "";
    email = "";
    password = "";
    confirmPassword = "";
    confirmDeleteEmail = "";
    role = 0;
  }

  function validateForm() {
    const result = userSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      fieldErrors = result.error.errors.reduce(
        (acc, error) => {
          acc[error.path[0]] = error.message;
          return acc;
        },
        {} as Record<string, string>,
      );
      return false;
    }

    fieldErrors = {};
    return true;
  }

  /**-----------------------
   *  API Call Functions
   -----------------------*/
  async function handleUpdateUser() {
    if (!validateForm()) {
      errorMessage = "Please correct the highlighted fields.";
      return;
    }

    console.log(selectedUser);

    try {
      const data = await updateUser(
        selectedUser?.id ?? "",
        email,
        firstName,
        lastName,
        password,
        role,
      );
      successMessage = data.message;
      closeModal("updateUserModal");
    } catch (error) {
      errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
    }
  }

  async function handleDisableUser() {
    if (!selectedUser) return;

    try {
      await toggleUserStatus(selectedUser.id, selectedUser.isActive);

      if (selectedUser) {
        users = users.filter((u) => u.id !== selectedUser?.id);
      }
      selectedUser = null;
      confirmDeleteEmail = "";
      closeModal("updateUserModal");
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    }

    listenRefreshUser();
  }

  async function handleDeleteUser() {
    if (!selectedUser || confirmDeleteEmail !== selectedUser.email) return;

    try {
      await deleteUser(selectedUser?.id);

      users = users.filter((u) => u.id !== selectedUser?.id);
      selectedUser = null;
      confirmDeleteEmail = "";
      closeModal("updateUserModal");
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    }

    listenRefreshUser();
  }

  /**-----------------------
   *  onMount activities
   -----------------------*/
  onMount(() => {
    document
      .getElementById("updateUserModal")
      ?.addEventListener("close", () => {
        resetForm();
        listenRefreshUser();
      });
  });
</script>

<dialog id="updateUserModal" class="modal">
  <div class="modal-box max-w-lg max-h-3/4">
    {#if selectedUser}
      <div class="flex flex-col gap-6">
        <h3 class="text-2xl font-bold text-center">Edit User</h3>
        <div class="modal-section">
          <div class="divider">
            <h3 class="text-lg font-bold">User Information</h3>
          </div>
          <div class="flex justify-center my-4">
            <!-- TODO: <a href="/dashboard" aria-label="Change Avatar"> -->

            <DefaultAvatar {firstName} {lastName} size="md" />
            <!-- </a> -->
          </div>
          <div class="flex gap-4">
            <fieldset class="fieldset w-1/2">
              <legend class="fieldset-legend">First Name</legend>
              <input
                type="text"
                placeholder="First Name"
                class="input w-full {fieldErrors.firstName
                  ? 'input-error'
                  : ''}"
                bind:value={firstName}
              />
              {#if fieldErrors.firstName}
                <p class="label input-label-warning">{fieldErrors.firstName}</p>
              {/if}
            </fieldset>
            <fieldset class="fieldset w-1/2">
              <legend class="fieldset-legend">Last Name</legend>
              <input
                type="text"
                placeholder="Last Name"
                class="input w-full {fieldErrors.lastName ? 'input-error' : ''}"
                bind:value={lastName}
              />
              {#if fieldErrors.lastName}
                <p class="label input-label-warning">{fieldErrors.lastName}</p>
              {/if}
            </fieldset>
          </div>
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Email</legend>
            <input
              type="text"
              placeholder="Email"
              class="input w-full {fieldErrors.email ? 'input-error' : ''}"
              bind:value={email}
            />
            {#if fieldErrors.email}
              <p class="label input-label-warning">{fieldErrors.email}</p>
            {/if}
          </fieldset>
        </div>

        <div class="modal-section">
          <div class="divider">
            <h3 class="text-lg font-bold">Update Password</h3>
          </div>
          <div class="flex gap-4">
            <fieldset class="fieldset w-1/2">
              <legend class="fieldset-legend">New Password</legend>
              <input
                type="password"
                placeholder="New Password"
                class="input w-full {fieldErrors.password ? 'input-error' : ''}"
                bind:value={password}
              />
              {#if fieldErrors.password}
                <p class="label input-label-warning">{fieldErrors.password}</p>
              {/if}
            </fieldset>
            <fieldset class="fieldset w-1/2">
              <legend class="fieldset-legend">Confirm Password</legend>
              <input
                type="password"
                placeholder="Confirm Password"
                class="input w-full {fieldErrors.confirmPassword
                  ? 'input-error'
                  : ''}"
                bind:value={confirmPassword}
              />
              {#if fieldErrors.confirmPassword}
                <p class="label input-label-warning">
                  {fieldErrors.confirmPassword}
                </p>
              {/if}
            </fieldset>
          </div>
        </div>

        <div class="modal-section">
          <div class="divider">
            <h3 class="text-lg font-bold">Settings</h3>
          </div>
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Role</legend>

            <select class="select w-full" bind:value={role}>
              <option disabled>Select a role</option>
              <option value={0}>Admin</option>
              <option value={1}>User</option>
            </select>
            {#if fieldErrors.role}
              <p class="label input-label-warning">{fieldErrors.role}</p>
            {/if}
          </fieldset>
        </div>

        <div class="modal-section">
          <div class="divider">
            <h3 class="text-lg font-bold">Other Information</h3>
          </div>
          <div class="flex gap-4">
            <fieldset class="fieldset w-1/2">
              <legend class="fieldset-legend">Created</legend>
              <input
                type="text"
                placeholder="Created At"
                class="input w-full"
                disabled
                value={formatTimeAndDateUS(selectedUser.createdAt)}
              />
            </fieldset>
            <fieldset class="fieldset w-1/2">
              <legend class="fieldset-legend">Last Updated</legend>
              <input
                type="text"
                placeholder="Updated At"
                class="input w-full"
                disabled
                value={formatTimeAndDateUS(selectedUser.updatedAt)}
              />
            </fieldset>
          </div>
        </div>

        <div class="modal-section">
          <div class="divider">
            <h3 class="text-lg font-bold">User Management</h3>
          </div>
          <div class="gap-4">
            <fieldset class="fieldset">
              {#if !selectedUser.isActive}
                <legend class="fieldset-legend">This user is inactive</legend>
                <button
                  class="btn btn-soft btn-success w-full"
                  onclick={() => triggerModal("confirmUserStatusModal")}
                  >Enable</button
                >
                <p class="label input-label">
                  This user cannot login their account.
                </p>
              {:else}
                <legend class="fieldset-legend">This user is active</legend>
                <button
                  class="btn btn-soft btn-primary w-full"
                  onclick={() => triggerModal("confirmUserStatusModal")}
                  >Disable</button
                >
                <p class="label input-label">
                  This user is allowed to login their account.
                </p>
              {/if}
            </fieldset>
          </div>
          <div class="flex gap-4">
            <fieldset class="fieldset w-1/2">
              <legend class="fieldset-legend">Enter the email to delete</legend>
              <input
                type="text"
                placeholder="Email"
                class="input w-full"
                bind:value={confirmDeleteEmail}
              />
            </fieldset>
            <fieldset class="fieldset w-1/2">
              <legend class="fieldset-legend">Click to Delete</legend>
              <ButtonDelete
                label="Delete"
                additionalClass="w-full"
                onclick={() => triggerModal("confirmDeleteUserModal")}
                disabled={confirmDeleteEmail !== selectedUser?.email}
              />
              <p class="label input-label">This is not reversible</p>
            </fieldset>
          </div>
        </div>
      </div>
      <div class="modal-action mt-4">
        <ButtonSave
          label="Save"
          onclick={handleUpdateUser}
          disabled={!isDirty}
        />
        <ButtonClose
          label="Close"
          onclick={() => closeModal("updateUserModal")}
        />
      </div>

      <dialog id="confirmDeleteUserModal" class="modal">
        <div class="modal-box max-w-96 max-h-3/4">
          <div class="flex flex-col gap-4">
            <h3 class="font-bold text-lg text-center">Confirm Deletion</h3>
            <p class="text-center">
              Are you sure you want to delete <strong
                >{selectedUser?.email}</strong
              >? <br /><br />This action
              <span class="text-red-500 font-semibold">cannot be undone</span>.
            </p>
            <div class="modal-action justify-center">
              <ButtonDelete
                label="Yes, Delete"
                onclick={() => {
                  handleDeleteUser();
                  closeModal("confirmDeleteUserModal");
                }}
              />
              <ButtonClose
                label="No"
                onclick={() => closeModal("confirmDeleteUserModal")}
              />
            </div>
          </div>
        </div>
      </dialog>

      <dialog id="confirmUserStatusModal" class="modal">
        <div class="modal-box max-w-96 max-h-3/4">
          <div class="flex flex-col gap-6">
            {#if !selectedUser.isActive}
              <h3 class="font-bold text-lg text-center">Confirm Enable</h3>
              <p class="text-center">
                Let <strong>{selectedUser?.email}</strong> login their account?
              </p>
            {:else}
              <h3 class="font-bold text-lg text-center">Confirm Disable</h3>
              <p class="text-center">
                <strong>{selectedUser?.email}</strong> will not be able to login.
                Continue?
              </p>
            {/if}

            <div class="modal-action justify-center">
              <ButtonAgree
                label="Yes"
                onclick={() => {
                  handleDisableUser();
                  closeModal("confirmUserStatusModal");
                }}
              />
              <ButtonClose
                label="No"
                onclick={() => closeModal("confirmUserStatusModal")}
              />
            </div>
          </div>
        </div>
      </dialog>
    {/if}
  </div>
</dialog>
