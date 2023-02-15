import React, { FormEvent, useCallback, useState } from 'react';
import Link from 'next/link';
import Input from '@components/Input';
import { useRouter } from 'next/router';
import useInput from '@hooks/useInput';
import useSWRMutation from 'swr/mutation';
import { signInRequest } from 'apis/auth';
import { API_PATH } from 'constants/api';
import { PAGE_PATH } from 'constants/path';
import withOutAuth from '@hooks/HOC/withOutAuth';

const SignIn = () => {
  const router = useRouter();
  const { trigger } = useSWRMutation(API_PATH.SIGNIN, signInRequest);

  const [email, handleEmail] = useInput('');
  const [password, setPassword] = useInput('');

  const [signInError, setSignInError] = useState(false);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      trigger(
        { email: email, password: password },
        {
          onSuccess: (data) => {
            console.log(data);
            router.push('/workspace/sleact/channel/일반');
          },
          onError: (err) => {
            setSignInError(true);
          },
        }
      );
    },
    [email, password, router, trigger]
  );

  return (
    <div id="container">
      <header className="mt-12 mb-12 text-center text-5xl font-bold">Slack</header>
      <form className="m-auto w-[400px] max-w-[400px]" onSubmit={onSubmit}>
        <label id="email-label" className="block cursor-pointer pb-1 text-left text-sm font-bold">
          <span className="mb-1 block">이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={handleEmail} />
          </div>
        </label>
        <label id="password-label" className="block cursor-pointer pb-1 text-left text-sm font-bold">
          <span className="mb-1 block">비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={setPassword} />
          </div>
          {signInError && (
            <div className="mt-3 mb-2 font-bold text-[#e01e5a]">이메일과 비밀번호 조합이 일치하지 않습니다.</div>
          )}
        </label>
        <button
          type="submit"
          className="shadow-[0_1px_4px_rgba(0, 0, 0, 0.3)] my-3
          h-11 w-full max-w-full cursor-pointer rounded bg-[#4a154b]
          text-lg font-bold text-white 
          transition-all duration-75 ease-linear
          hover:bg-[rgba(74,21,75,0.9)]
          focus:shadow-[0_0_0_5px_rgba(18,100,163,1),0_0_0_5px_rgba(29,155,209,0.3)]
          "
        >
          로그인
        </button>
      </form>
      <p className=" ml-auto mr-auto mt-0 mb-2 w-[400px] text-sm text-[rgb(97,96,97)]">
        아직 회원이 아니신가요?&nbsp;
        <Link href={PAGE_PATH.SIGNUP} className="font-bold text-[rgb(18,100,163)]">
          회원가입 하러가기
        </Link>
      </p>
    </div>
  );
};

export default withOutAuth(SignIn);
