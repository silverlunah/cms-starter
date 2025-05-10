import { PUBLIC_API_URL } from "$env/static/public";
import type { AllowedHost, AllowedHostsResponse } from "$lib/types/allowedHost";

export async function getAllowedHosts(): Promise<AllowedHost[]> {
  const res = await fetch(PUBLIC_API_URL + "/allowed-hosts", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Failed to fetch allowed hosts");
  }

  const data: AllowedHostsResponse = await res.json();

  return data.allowedHosts
    .map(
      (allowedHost: AllowedHost): AllowedHost => ({
        id: allowedHost.id,
        url: allowedHost.url,
        displayName: allowedHost.displayName,
        createdAt: new Date(allowedHost.createdAt).toLocaleString(),
        updatedAt: new Date(allowedHost.updatedAt).toLocaleString(),
      }),
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
}

export async function createAllowedHost(url: string, displayName: string) {
  const res = await fetch(`${PUBLIC_API_URL}/create-allowed-host`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, displayName }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Failed to create allowed host");
  }

  const data = await res.json();
  return data.allowedHost;
}

export async function updateAllowedHost(
  id: number,
  displayName: string,
  url: string,
): Promise<AllowedHost> {
  const res = await fetch(`${PUBLIC_API_URL}/update-allowed-host/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ displayName, url }),
  });

  if (!res.ok) {
    let message = "Failed to update allowed host";
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {}
    throw new Error(message);
  }

  const { allowedHost } = await res.json();
  return {
    ...allowedHost,
    createdAt: new Date(allowedHost.createdAt).toLocaleString(),
    updatedAt: new Date(allowedHost.updatedAt).toLocaleString(),
  };
}

export async function deleteAllowedHost(id: string) {
  const res = await fetch(`${PUBLIC_API_URL}/allowed-host/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to delete allowed host");

  return res.json();
}
