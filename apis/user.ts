import api from './axios';

export const userFetcher = (url: string) => {
  return api
    .get(url, {
      withCredentials: true,
    })
    .then((data) => data.data);
};
