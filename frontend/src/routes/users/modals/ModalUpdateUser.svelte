<script lang="ts">
  import { z } from "zod";
  import type { User } from "$lib/types/user";
  import {
    closeModal,
    triggerModal,
    formatTimeAndDateUS,
  } from "$lib/utils/common";
  import { onMount } from "svelte";
  import { deleteUser, toggleUserStatus, updateUser } from "$lib/api";
  import { triggerNotification } from "$lib/utils/notification";
  import ButtonSave from "$lib/components/buttons/ButtonSave.svelte";
  import ButtonClose from "$lib/components/buttons/ButtonClose.svelte";
  import ButtonDelete from "$lib/components/buttons/ButtonDelete.svelte";
  import ButtonAgree from "$lib/components/buttons/ButtonAgree.svelte";
  import AvatarDefault from "$lib/components/user/AvatarDefault.svelte";
  import AvatarHasImg from "$lib/components/user/AvatarHasImg.svelte";
  import Modal from "$lib/components/modals/Modal.svelte";
  import ModalSection from "$lib/components/modals/ModalSection.svelte";
  import { currentUser } from "$lib/stores/currentUser";
  import type { CurrentUser } from "$lib/types/currentUser";
  import InputFormField from "$lib/components/inputs/InputFormField.svelte";

  export let selectedUser: User | null = null;
  export let listenRefreshUser: () => void;

  let users: User[] = [];
  let confirmDeleteEmail = "";
  let errorMessage = "";

  /**-----------------------
   *    Form Variables
   -----------------------*/
  let firstName = "";
  let lastName = "";
  let username = "";
  let email = "";
  let address = "";
  let occupation = "";
  let organization = "";
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
      username: z
        .string()
        .min(6, { message: "Username must be atleast 6 characters" }),
      address: z.string().optional(),
      occupation: z.string().optional(),
      organization: z.string().optional(),
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
    username = selectedUser.username;
    email = selectedUser.email;
    address = selectedUser.address;
    occupation = selectedUser.occupation;
    organization = selectedUser.organization;
    role = selectedUser.role;
  }

  $: isDirty =
    selectedUser &&
    (firstName !== selectedUser.firstName ||
      lastName !== selectedUser.lastName ||
      username !== selectedUser.username ||
      address !== selectedUser.address ||
      occupation !== selectedUser.occupation ||
      organization !== selectedUser.organization ||
      email.toLowerCase() !== selectedUser.email.toLowerCase() ||
      role !== selectedUser.role ||
      password.length > 0 || // only care if password is being updated
      confirmPassword.length > 0);

  $: roleSelectDisabled = selectedUser?.isLocked ?? false;

  /**-----------------------
   *   General Functions
   -----------------------*/
  function resetForm() {
    errorMessage = "";
    fieldErrors = {};
    firstName = "";
    lastName = "";
    email = "";
    address = "";
    occupation = "";
    organization = "";
    password = "";
    confirmPassword = "";
    confirmDeleteEmail = "";
    role = 0;
  }

  function validateForm() {
    const input = {
      firstName,
      lastName,
      username,
      address: address ?? undefined,
      occupation: occupation ?? undefined,
      organization: organization ?? undefined,
      email,
      password,
      confirmPassword,
    };

    const result = userSchema.safeParse(input);

    if (!result.success) {
      fieldErrors = result.error.errors.reduce(
        (acc, error) => {
          acc[error.path[0] as string] = error.message;
          return acc;
        },
        {} as Record<string, string>,
      );
      return false;
    }

    fieldErrors = {};
    return true;
  }

  function updateUserSessionVariables() {
    if ($currentUser?.id === selectedUser?.id) {
      console.log($currentUser?.id === selectedUser?.id);
      currentUser.update((u) =>
        u
          ? {
              ...u,
              email,
              firstName,
              lastName,
              username,
              role,
              // password usually omitted for security
            }
          : null,
      );
      const updatedUser: CurrentUser = {
        id: $currentUser?.id ?? "",
        avatarUrl: $currentUser?.avatarUrl ?? "",
        firstName,
        lastName,
        email,
        username,
        role,
      };

      currentUser.set(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  }

  /**-----------------------
   *  API Call Functions
   -----------------------*/
  async function handleUpdateUser() {
    if (!validateForm()) {
      errorMessage = "Please correct the highlighted fields.";
      return;
    }

    try {
      await updateUser(
        selectedUser?.id ?? "",
        email,
        firstName,
        lastName,
        username,
        address,
        occupation,
        organization,
        password,
        role,
      );

      triggerNotification("Successfully edited " + email, "success");

      closeModal("updateUserModal");
    } catch (err) {
      errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
    }

    updateUserSessionVariables();
    listenRefreshUser();
  }

  async function handleDisableUser() {
    if (!selectedUser) return;

    try {
      await toggleUserStatus(selectedUser.id, selectedUser.isActive);

      if (selectedUser) {
        users = users.filter((u) => u.id !== selectedUser?.id);
      }

      let statusInMessage = "disabled";
      if (!selectedUser.isActive) {
        statusInMessage = "enabled";
      }

      triggerNotification(
        "Successfully " + statusInMessage + " " + selectedUser.email,
        "success",
      );

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

      triggerNotification(
        "Successfully created " + selectedUser.email,
        "success",
      );

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

<Modal
  id="updateUserModal"
  label="Update User"
  additionalClass="max-w-lg max-h-3/4"
>
  {#if selectedUser}
    <ModalSection label="User Information">
      <div class="flex justify-center my-4">
        <!-- TODO: Change avatar upload -->
        {#if selectedUser.avatarUrl}
          <AvatarHasImg imgUrl={selectedUser.avatarUrl} size="md" />
        {:else}
          <AvatarDefault {firstName} {lastName} size="md" />
        {/if}
      </div>
      <div class="flex gap-4">
        <InputFormField
          bind:value={firstName}
          type="text"
          label="First Name"
          placeholder="First Name"
          fieldSetAdditionalClass="w-1/2"
          inputAdditionalClass="w-full"
          fieldError={fieldErrors.firstName}
        />
        <InputFormField
          bind:value={lastName}
          type="text"
          label="Last Name"
          placeholder="Last Name"
          fieldSetAdditionalClass="w-1/2"
          inputAdditionalClass="w-full"
          fieldError={fieldErrors.lastName}
        />
      </div>
      <InputFormField
        bind:value={username}
        type="text"
        label="Username"
        placeholder="Username"
        inputAdditionalClass="w-full"
        fieldError={fieldErrors.username}
      />
      <InputFormField
        bind:value={email}
        type="text"
        label="Email"
        placeholder="Email"
        inputAdditionalClass="w-full"
        fieldError={fieldErrors.email}
      />
      <InputFormField
        bind:value={address}
        type="text"
        label="Address"
        placeholder="Address"
        inputAdditionalClass="w-full"
        fieldError={fieldErrors.address}
      />
      <div class="flex gap-4">
        <InputFormField
          bind:value={occupation}
          type="text"
          label="Occupation"
          placeholder="Occupation"
          fieldSetAdditionalClass="w-1/2"
          inputAdditionalClass="w-full"
          fieldError={fieldErrors.occupation}
        />
        <InputFormField
          bind:value={organization}
          type="text"
          label="Organization"
          placeholder="Organization"
          fieldSetAdditionalClass="w-1/2"
          inputAdditionalClass="w-full"
          fieldError={fieldErrors.organization}
        />
      </div>
    </ModalSection>

    <ModalSection label="Update Password">
      <div class="flex gap-4">
        <InputFormField
          bind:value={password}
          type="password"
          label="Password"
          placeholder="Password"
          fieldSetAdditionalClass="w-1/2"
          inputAdditionalClass="w-full"
          fieldError={fieldErrors.password}
        />
        <InputFormField
          bind:value={confirmPassword}
          type="password"
          label="Confirm Password"
          placeholder="Confirm Password"
          fieldSetAdditionalClass="w-1/2"
          inputAdditionalClass="w-full"
          fieldError={fieldErrors.confirmPassword}
        />
      </div>
    </ModalSection>

    <ModalSection label="Settings">
      {#if selectedUser?.isLocked}
        <p class="text-xs text-error">This user is locked</p>
      {/if}

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Role</legend>
        <select
          class="select w-full"
          bind:value={role}
          disabled={roleSelectDisabled}
        >
          <option disabled>Select a role</option>
          <option value={0}>Admin</option>
          <option value={1}>User</option>
        </select>
        {#if fieldErrors.role}
          <p class="label text-error">{fieldErrors.role}</p>
        {/if}
      </fieldset>
    </ModalSection>

    <ModalSection label="Other Information">
      <div class="flex gap-4">
        <InputFormField
          value={formatTimeAndDateUS(selectedUser.createdAt)}
          type="text"
          label="Created"
          placeholder="Created At"
          fieldSetAdditionalClass="w-1/2"
          inputAdditionalClass="w-full"
          disabled
        />
        <InputFormField
          value={formatTimeAndDateUS(selectedUser.updatedAt)}
          type="text"
          label="Last Updated"
          placeholder="Updated At"
          fieldSetAdditionalClass="w-1/2"
          inputAdditionalClass="w-full"
          disabled
        />
      </div>
    </ModalSection>

    <ModalSection label="User Management">
      {#if selectedUser?.isLocked}
        <p class="text-xs text-error">This user is locked</p>
      {/if}

      <div class="gap-4">
        <fieldset class="fieldset">
          {#if !selectedUser.isActive}
            <legend class="fieldset-legend">This user is inactive</legend>
            <button
              class="btn btn-soft btn-success w-full"
              disabled={selectedUser?.isLocked || selectedUser?.role === 99}
              onclick={() => triggerModal("confirmUserStatusModal")}
              >Enable</button
            >
            <p class="label input-label">
              This user cannot login their account
            </p>
          {:else}
            <legend class="fieldset-legend">This user is active</legend>
            <button
              class="btn btn-error w-full"
              disabled={selectedUser?.isLocked || selectedUser?.role === 99}
              onclick={() => triggerModal("confirmUserStatusModal")}
              >Disable</button
            >
            <p class="label input-label">
              This user is allowed to login their account
            </p>
          {/if}
        </fieldset>
      </div>
      <div class="flex gap-4">
        <InputFormField
          bind:value={confirmDeleteEmail}
          type="text"
          label="Enter the email to delete"
          placeholder="Email"
          fieldSetAdditionalClass="w-1/2"
          inputAdditionalClass="w-full"
          fieldError={fieldErrors.password}
          disabled={selectedUser?.isLocked || selectedUser?.role === 99}
        />
        <fieldset class="fieldset w-1/2">
          <legend class="fieldset-legend">Click to Delete</legend>
          <ButtonDelete
            label="Delete"
            additionalClass="w-full"
            onclick={() => triggerModal("confirmDeleteUserModal")}
            disabled={confirmDeleteEmail !== selectedUser?.email ||
              selectedUser?.isLocked ||
              selectedUser?.role === 99}
          />
          <p class="label input-label">This is not reversible</p>
        </fieldset>
      </div>
    </ModalSection>
    <div class="server-error text-right text-sm text-error">
      {errorMessage}
    </div>
    <div class="modal-action mt-4">
      <ButtonSave label="Save" onclick={handleUpdateUser} disabled={!isDirty} />
      <ButtonClose
        label="Close"
        onclick={() => closeModal("updateUserModal")}
      />
    </div>

    <Modal
      id="confirmDeleteUserModal"
      label="Confirm Deletion"
      additionalClass="max-w-96 max-h-3/4"
    >
      <p class="text-center">
        Are you sure you want to delete <strong>{selectedUser?.email}</strong>?
        <br /><br />This action
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
    </Modal>

    <Modal
      id="confirmUserStatusModal"
      label={!selectedUser.isActive ? "Enable Access?" : "Remove Access?"}
      additionalClass="max-w-96 max-h-3/4"
    >
      {#if !selectedUser.isActive}
        <p class="text-center">
          Let <strong>{selectedUser?.email}</strong> login their account?
        </p>
      {:else}
        <p class="text-center">
          <strong>{selectedUser?.email}</strong> will not be able to login. Continue?
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
    </Modal>
  {/if}
</Modal>
