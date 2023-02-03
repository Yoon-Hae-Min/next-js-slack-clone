import api from 'apis/axios';

export const fetcher = (url: string) => {
  return api
    .get(url, {
      withCredentials: true,
    })
    .then((data) => data.data);
};
