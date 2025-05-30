import { PUBLIC_API_URL } from "$env/static/public";
import type { User, UsersResponse } from "$lib/types/user";
import { toProperCase } from "$lib/utils/common";

export async function getUsers(): Promise<User[]> {
  const res = await fetch(PUBLIC_API_URL + "/users", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Failed to fetch users");
  }

  const data: UsersResponse = await res.json();
  return data.users
    .map(
      (user: User): User => ({
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        imgId: user.imgId,
        address: user.address,
        organization: user.organization,
        occupation: user.occupation,
        role: user.role,
        isActive: user.isActive,
        isLocked: user.isLocked,
        avatarUrl: user.avatarUrl,
        createdAt: new Date(user.createdAt).toLocaleString(),
        updatedAt: new Date(user.updatedAt).toLocaleString(),
      }),
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
}

export async function createUser(
  email: string,
  firstName: string,
  lastName: string,
  username: string,
  address: string,
  occupation: string,
  organization: string,
  password: string,
  role: number,
) {
  const res = await fetch(PUBLIC_API_URL + "/create-user", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.toLowerCase(),
      firstName: toProperCase(firstName),
      lastName: toProperCase(lastName),
      username: username,
      address: address,
      occupation: occupation,
      organization: organization,
      role: role,
      password,
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

  return await res.json();
}

export async function updateUser(
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  username: string,
  address: string,
  occupation: string,
  organization: string,
  password: string,
  role: number,
) {
  const body = {
    email: email.toLowerCase(),
    firstName: toProperCase(firstName),
    lastName: toProperCase(lastName),
    username: username,
    address: address,
    occupation: occupation,
    organization: organization,
    role,
    ...(password ? { password } : {}), // include password only if non-empty
  };

  const res = await fetch(`${PUBLIC_API_URL}/update-user/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || "Something went wrong");
  }

  return await res.json();
}

export async function toggleUserStatus(id: string, isActive: boolean) {
  const res = await fetch(`${PUBLIC_API_URL}/disable-user`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      isActive: isActive,
    }),
  });

  if (!res.ok) throw new Error("Failed to disable user");

  return res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`${PUBLIC_API_URL}/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to delete user");

  return res.json();
}
