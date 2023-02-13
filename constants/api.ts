export const BASE_URL = {
  DEV: 'http://localhost:3095',
};

export const API_PATH = {
  USERS: '/api/users',
  MEMBERS: (workspace: string | string[]) => `/api/workspaces/${workspace}/members`,
  CHANNELS: (workspace: string | string[]) => `/api/workspaces/${workspace}/channels`,
};
