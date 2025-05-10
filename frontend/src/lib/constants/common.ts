export const USER_ROLES = {
  ADMIN: 0,
  USER: 1,
} as const;

export const DATE = {
  NOT_YET_UPDATED_INDICATOR: "1/1/1970, 9:00:00 AM",
  NOT_YET_UPDATED_STRING: "Not Yet Updated",
  FORMAT: {
    DEFAULT: {
      OPTIONS: {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      },
      LOCALE: "en-US",
    },
  },
} as const;
