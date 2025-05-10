<script lang="ts">
  import { z } from "zod";
  import { onMount } from "svelte";
  import { PUBLIC_API_URL } from "$env/static/public";
  import type { User } from "$lib/types/user";
  import {
    toProperCase,
    closeModal,
    getFirstAndLastNameInitials,
  } from "$lib/utils/common";
  import ButtonAdd from "../buttons/ButtonAdd.svelte";
  import ButtonClose from "../buttons/ButtonClose.svelte";
  import DefaultAvatar from "../user/DefaultAvatar.svelte";

  export let selectedUser: User | null = null;
  export let listenRefresh: () => void;

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
        .min(6, { message: "Password must be at least 6 characters" })
        .optional(),
      confirmPassword: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"], // this is where the error will be shown
      message: "Passwords do not match",
    });

  /**-----------------------
   *  User Form Variables
   -----------------------*/
  let errorMessage = "";
  let successMessage = "";

  let firstName = "";
  let lastName = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let role = 0;

  let fieldErrors: Record<string, string> = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  };

  /**-----------------------
   *   General Functions
   -----------------------*/
  function validateForm() {
    const result = userSchema.safeParse({
      firstName: selectedUser ? selectedUser.firstName : firstName,
      lastName: selectedUser ? selectedUser.lastName : lastName,
      email: selectedUser ? selectedUser.email : email,
      password: selectedUser ? "" : password, // Only validate password if new user
      confirmPassword: selectedUser ? "" : confirmPassword, // Only validate confirmPassword if new user
    });

    if (!result.success) {
      fieldErrors = result.error.errors.reduce(
        (acc: Record<string, string>, error) => {
          acc[error.path[0]] = error.message;
          return acc;
        },
        {},
      );
      return false;
    }

    return true;
  }

  /**-----------------------
   *   API Call Functions
   -----------------------*/
  async function createNewUser() {
    if (!validateForm()) {
      errorMessage = "Please correct the highlighted fields.";
      return;
    }

    try {
      const res = await fetch(PUBLIC_API_URL + "/create-user", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password,
          firstName: toProperCase(firstName),
          lastName: toProperCase(lastName),
          role: role,
        }),
      });

      if (!res.ok) {
        let errorText;
        try {
          const data = await res.json();
          errorText = data?.error || JSON.stringify(data);
        } catch {
          errorText = await res.text();
        }
        throw new Error(errorText || "Something went wrong");
      }

      const data = await res.json();
      successMessage = data.message;

      closeModal("createUserModal");
    } catch (error) {
      errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
    }
  }

  /**-----------------------
   *   onMount activities
   -----------------------*/
  onMount(() => {
    let modal = document.getElementById("createUserModal");

    modal?.addEventListener("close", () => {
      // Reset main errors
      errorMessage = "";
      successMessage = "";

      // Reset field errors
      fieldErrors = {
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      };

      // Reset form
      firstName = "";
      lastName = "";
      email = "";
      password = "";
      confirmPassword = "";
      role = 0;

      // Refresh parent
      listenRefresh();
    });
  });
</script>

<dialog id="createUserModal" class="modal">
  <div class="modal-box max-w-lg max-h-3/4">
    <div class="flex flex-col gap-6">
      <h3 class="text-2xl font-bold text-center">Add New User</h3>
      {#if errorMessage}
        <p class="text-red-500">{errorMessage}</p>
      {/if}
      {#if successMessage}
        <p class="text-green-500">{successMessage}</p>
      {/if}
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
              class="input w-full {fieldErrors.firstName ? 'input-error' : ''}"
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
          <h3 class="text-lg font-bold">Password</h3>
        </div>
        <div class="flex gap-4">
          <fieldset class="fieldset w-1/2">
            <legend class="fieldset-legend">Password</legend>
            <input
              type="password"
              placeholder="Password"
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
        </fieldset>
      </div>
    </div>

    <div class="modal-action mt-4">
      <ButtonAdd label="Create User" onclick={createNewUser} />
      <ButtonClose
        label="Close"
        onclick={() => closeModal("createUserModal")}
      />
    </div>
  </div>
</dialog>
