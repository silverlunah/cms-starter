// src/lib/types/user.ts

// Keep RawUser for backend/internal use
export type RawUser = User & {
  password: string;
};

// User for frontend-safe usage
export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UsersResponse = {
  users: RawUser[];
};
