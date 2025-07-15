<script lang="ts">
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
  import { createUserSchema } from "$lib/zschemas/createUserSchema";

  interface Props {
    selectedUser?: User | null;
    listenRefreshUser: () => void;
  }

  let { selectedUser = null, listenRefreshUser }: Props = $props();

  /**-----------------------
   *  User Form Variables
   -----------------------*/
  let errorMessage = $state("");

  let firstName = $state("");
  let lastName = $state("");
  let username = $state("");
  let email = $state("");
  let address = $state("");
  let occupation = $state("");
  let organization = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let role = $state(0);

  let fieldErrors: Record<string, string> = $state({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    username: "",
  });

  /**-----------------------
   *   General Functions
   -----------------------*/
  function validateForm() {
    const result = createUserSchema.safeParse({
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
  <ModalSection label="Password">
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
