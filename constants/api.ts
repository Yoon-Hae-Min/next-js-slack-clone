export const BASE_URL = {
  DEV: 'http://localhost:3095',
};

export const API_PATH = {
  SIGNIN: '/api/users/login',
  SIGNOUT: '/api/users/logout',
  USERS: '/api/users',
  WORKSPACE: {
    USERS: (workspace: any, userId: any) => `/api/workspaces/${workspace}/users/${userId}`,
    MEMBERS: (workspace: any) => `/api/workspaces/${workspace}/members`,
    CHANNELS: (workspace: any) => `/api/workspaces/${workspace}/channels`,
  },
};
