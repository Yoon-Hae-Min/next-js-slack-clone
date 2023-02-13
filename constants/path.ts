export const PAGE_PATH = {
  CHANNEL: (workspace: any, channelName: any) => `/workspace/${workspace}/channel/${channelName}`,
  DM: (workspace: any, userName: any) => `/workspace/${workspace}/dm/${userName}`,
};
