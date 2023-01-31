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
