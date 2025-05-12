<script lang="ts">
  import { z } from "zod";
  import { onMount } from "svelte";
  import type { User } from "$lib/types/user";
  import { closeModal } from "$lib/utils/common";
  import { createUser } from "$lib/api";
  import { triggerNotification } from "$lib/utils/notification";
  import ButtonAdd from "../../../lib/components/buttons/ButtonAdd.svelte";
  import ButtonClose from "../../../lib/components/buttons/ButtonClose.svelte";
  import AvatarDefault from "../../../lib/components/user/AvatarDefault.svelte";
  import InputFormField from "$lib/components/inputs/InputFormField.svelte";
  import ModalSection from "$lib/components/modals/ModalSection.svelte";
  import Modal from "$lib/components/modals/Modal.svelte";

  export let selectedUser: User | null = null;
  export let listenRefreshUser: () => void;

  /**-----------------------
   *      Zod Schema
   -----------------------*/
  const userSchema = z
    .object({
      firstName: z.string().min(1, { message: "First name is required" }),
      lastName: z.string().min(1, { message: "Last name is required" }),
      username: z
        .string()
        .min(6, { message: "Username must be at least 6 characters" }),
      address: z.string().optional(),
      occupation: z.string().optional(),
      organization: z.string().optional(),
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

  let fieldErrors: Record<string, string> = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    username: "",
  };

  /**-----------------------
   *   General Functions
   -----------------------*/
  function validateForm() {
    const result = userSchema.safeParse({
      firstName: selectedUser ? selectedUser.firstName : firstName,
      lastName: selectedUser ? selectedUser.lastName : lastName,
      username: selectedUser ? selectedUser.username : username,
      email: selectedUser ? selectedUser.email : email,
      address: selectedUser ? selectedUser.address : address,
      occupation: selectedUser ? selectedUser.occupation : occupation,
      organization: selectedUser ? selectedUser.organization : organization,
      password: selectedUser ? "" : password,
      confirmPassword: selectedUser ? "" : confirmPassword,
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

    fieldErrors = {};
    return true;
  }

  /**-----------------------
   *   API Call Functions
   -----------------------*/
  async function handleCreateUser() {
    if (!validateForm()) {
      errorMessage = "Please correct the highlighted fields.";
      return;
    }

    try {
      await createUser(
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

      triggerNotification("Successfully created " + email, "success");

      closeModal("createUserModal");
    } catch (err) {
      errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
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

      // Reset field errors
      fieldErrors = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        occupation: "",
        organization: "",
      };

      // Reset form
      firstName = "";
      lastName = "";
      username = "";
      email = "";
      address = "";
      occupation = "";
      organization = "";
      password = "";
      confirmPassword = "";
      role = 0;

      // Refresh parent
      listenRefreshUser();
    });
  });
</script>

<Modal
  id="createUserModal"
  label="Create New User"
  additionalClass="max-w-lg max-h-3/4"
>
  <ModalSection label="User Information">
    <div class="flex justify-center my-4">
      <!-- TODO: Upload Picture -->
      <AvatarDefault {firstName} {lastName} size="md" />
    </div>
    <div class="flex gap-4">
      <fieldset class="fieldset w-1/2">
        <InputFormField
          bind:value={firstName}
          type="text"
          label="First Name"
          placeholder="First Name"
          additionalClass="w-full"
          fieldError={fieldErrors.firstName}
        />
      </fieldset>
      <fieldset class="fieldset w-1/2">
        <InputFormField
          bind:value={lastName}
          type="text"
          label="Last Name"
          placeholder="Last Name"
          additionalClass="w-full"
          fieldError={fieldErrors.lastName}
        />
      </fieldset>
    </div>
    <fieldset class="fieldset">
      <InputFormField
        bind:value={username}
        type="text"
        label="Username"
        placeholder="Username"
        additionalClass="w-full"
        fieldError={fieldErrors.username}
      />
    </fieldset>
    <fieldset class="fieldset">
      <InputFormField
        bind:value={email}
        type="text"
        label="Email"
        placeholder="Email"
        additionalClass="w-full"
        fieldError={fieldErrors.email}
      />
    </fieldset>
    <fieldset class="fieldset">
      <InputFormField
        bind:value={address}
        type="text"
        label="Address"
        placeholder="Address"
        additionalClass="w-full"
        fieldError={fieldErrors.address}
      />
    </fieldset>
    <div class="flex gap-4">
      <fieldset class="fieldset w-1/2">
        <InputFormField
          bind:value={occupation}
          type="text"
          label="Occupation"
          placeholder="Occupation"
          additionalClass="w-full"
          fieldError={fieldErrors.occupation}
        />
      </fieldset>
      <fieldset class="fieldset w-1/2">
        <InputFormField
          bind:value={organization}
          type="text"
          label="Organization"
          placeholder="Organization"
          additionalClass="w-full"
          fieldError={fieldErrors.organization}
        />
      </fieldset>
    </div>
  </ModalSection>
  <ModalSection label="Password">
    <div class="flex gap-4">
      <fieldset class="fieldset w-1/2">
        <InputFormField
          bind:value={password}
          type="password"
          label="Password"
          placeholder="Password"
          additionalClass="w-full"
          fieldError={fieldErrors.password}
        />
      </fieldset>
      <fieldset class="fieldset w-1/2">
        <InputFormField
          bind:value={confirmPassword}
          type="password"
          label="Confirm Password"
          placeholder="Confirm Password"
          additionalClass="w-full"
          fieldError={fieldErrors.confirmPassword}
        />
      </fieldset>
    </div>
  </ModalSection>

  <ModalSection label="Settings">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Role</legend>
      <select class="select w-full" bind:value={role}>
        <option disabled>Select a role</option>
        <option value={0}>Admin</option>
        <option value={1}>User</option>
      </select>
    </fieldset>
  </ModalSection>
  <div class="server-error text-right text-sm text-error">
    {errorMessage}
  </div>
  <div class="modal-action mt-4">
    <ButtonAdd label="Create User" onclick={handleCreateUser} />
    <ButtonClose label="Close" onclick={() => closeModal("createUserModal")} />
  </div>
</Modal>
