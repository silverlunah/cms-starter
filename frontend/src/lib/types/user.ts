// Keep RawUser for backend/internal use
export type RawUser = User & {
  password: string;
};

// User for frontend-safe usage
export type User = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  imgId: string;
  address: string;
  occupation: string;
  organization: string;
  role: number;
  isActive: boolean;
  isLocked: true;
  createdAt: string;
  updatedAt: string;
  avatarUrl: string;
};

export type UsersResponse = {
  users: RawUser[];
};
