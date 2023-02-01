import api from './axios';

interface signInForm {
  email: string;
  password: string;
}

export const signInRequest = (url: string, { arg }: { arg: signInForm }) => {
  return api.post(url, arg, {
    withCredentials: true,
  });
};
