import { DATE } from "$lib/constants/common";

export function triggerModal(modalId: string) {
  const modal = document.getElementById(modalId) as HTMLDialogElement | null;
  if (modal) {
    modal.showModal();
  } else {
    console.warn(`Modal with ID "${modalId}" not found`);
  }
}

export function closeModal(modalId: string) {
  const modal = document.getElementById(modalId) as HTMLDialogElement | null;

  modal?.close();
}

export function getFirstAndLastNameInitials(
  firstName: string,
  lastName: string,
): string {
  const firstInitial = firstName?.trim()?.[0] ?? "";
  const lastInitial = lastName?.trim()?.[0] ?? "";

  return (firstInitial + lastInitial).toUpperCase();
}

export function formatUnixEpoch(date: string) {
  if (date === DATE.NOT_YET_UPDATED_INDICATOR) {
    return DATE.NOT_YET_UPDATED_STRING;
  }
}

export function formatTimeAndDateUS(date: string) {
  return new Date(date).toLocaleString(
    DATE.FORMAT.DEFAULT.LOCALE,
    DATE.FORMAT.DEFAULT.OPTIONS,
  );
}

export function toProperCase(str: string): string {
  return str
    .split(" ") // Split by space
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
    .join(" "); // Join the words back together with spaces
}
