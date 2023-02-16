export const PAGE_PATH = {
  SIGNIN: '/signin',
  SIGNUP: 'signup',
  CHANNEL: (workspace: any, channelName: any) => `/workspace/${workspace}/channel/${channelName}`,
  DM: (workspace: any, userName: any) => `/workspace/${workspace}/dm/${userName}`,
} as const;
