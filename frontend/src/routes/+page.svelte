<script lang="ts">
  import { goto } from "$app/navigation";
  import { PUBLIC_API_URL } from "$env/static/public";
  import ToggleTheme from "$lib/components/toggles/ToggleTheme.svelte";
  import { isLoggedIn } from "$lib/stores/auth";
  import { currentUser } from "$lib/stores/currentUser";

  let email = $state("");
  let password = $state("");
  let error = $state("");

  async function handleLogin() {
    const res = await fetch(PUBLIC_API_URL + "/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      currentUser.set(data.user);
      isLoggedIn.set(true);
      await goto("/dashboard");
    } else {
      error = "Invalid credentials";
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      handleLogin();
    }
  }
</script>

<div class="relative overflow-hidden p-4 w-full h-screen">
  <form
    onsubmit={handleLogin}
    class="max-w-sm mx-auto relative flex flex-col items-center p-4 gap-4"
  >
    <h1 class="font-bold text-center text-7xl md:text-4xl">CMS Starter</h1>
    <h2 class="font-bold text-center text-4xl md:text-xl">Login</h2>

    <div class="items-center">
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
        onkeydown={handleKeyDown}
      />
      <button type="submit" class="btn btn-primary w-full">Let's Go!</button>

      {#if error}
        <p class="mt-4 text-error text-sm text-center">{error}</p>
      {/if}
    </div>
    <div class="w-full flex justify-end">
      <ToggleTheme />
    </div>
  </form>
</div>
