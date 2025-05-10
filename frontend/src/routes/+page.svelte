<script lang="ts">
  import { goto } from "$app/navigation";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { isLoggedIn } from "$lib/stores/auth";

  let email = "";
  let password = "";
  let error = "";

  async function handleLogin() {
    const res = await fetch(PUBLIC_API_URL + "/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.ok) {
      isLoggedIn.set(true);
      await goto("/dashboard");
    } else {
      error = "Invalid credentials";
    }
  }

  // Handle "Enter" key to submit the form
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      handleLogin();
    }
  }
</script>

<form
  on:submit|preventDefault={handleLogin}
  class="max-w-sm mx-auto mt-10 p-6 bg-base-100 shadow-xl rounded-box"
>
  <h1 class="text-2xl font-bold mb-4 text-center">Login</h1>
  <input
    type="email"
    bind:value={email}
    placeholder="Email"
    required
    class="input input-bordered w-full mb-4"
  />
  <input
    type="password"
    bind:value={password}
    placeholder="Password"
    required
    class="input input-bordered w-full mb-4"
    on:keydown={handleKeyDown}
  />
  <button type="submit" class="btn btn-primary w-full">Login</button>

  {#if error}
    <p class="mt-4 text-error text-sm text-center">{error}</p>
  {/if}
</form>
