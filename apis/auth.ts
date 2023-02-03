import api from './axios';

interface signUpForm {
  email: string;
  password: string;
  nickname: string;
}

export const signUpRequest = (url: string, { arg }: { arg: signUpForm }) => {
  return api.post(url, arg, {
    withCredentials: true,
  });
};

export const signOutRequest = (url: string) => {
  return api.post(url, null, {
    withCredentials: true,
  });
};

interface signInForm {
  email: string;
  password: string;
}

export const signInRequest = (url: string, { arg }: { arg: signInForm }) => {
  return api.post(url, arg, {
    withCredentials: true,
  });
};
