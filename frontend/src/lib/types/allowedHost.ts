export type AllowedHost = {
  id: string;
  url: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
};

export type AllowedHostsResponse = {
  allowedHosts: AllowedHost[];
};
