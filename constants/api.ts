export const BASE_URL = {
  DEV: 'http://localhost:3095',
};

export const API_PATH = {
  SIGNIN: '/api/users/login',
  SIGNOUT: '/api/users/logout',
  USERS: '/api/users',
  WORKSPACE: {
    USER: {
      ID: (workspace: any, userId: any) => `/api/workspaces/${workspace}/users/${userId}`,
    },
    MEMBERS: (workspace: any) => `/api/workspaces/${workspace}/members`,
    CHANNELS: (workspace: any) => `/api/workspaces/${workspace}/channels`,
    DM: {
      PAGES: (workspace: any, userId: any, index: number) =>
        `/api/workspaces/${workspace}/dms/${userId}/chats?perPage=20&page=${index + 1}`,
      CHATS: (workspace: any, userId: any) => `/api/workspaces/${workspace}/dms/${userId}/chats`,
    },
    CHANNEL: {
      ID: (workspace: any, channel: any) => `/api/workspaces/${workspace}/channels/${channel}`,
      PAGES: (workspace: any, channel: any, index: number) =>
        `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`,
      CHATS: (workspace: any, channel: any) => `/api/workspaces/${workspace}/channels/${channel}/chats`,
    },
  },
} as const;
