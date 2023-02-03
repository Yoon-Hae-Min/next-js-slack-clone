import React, { ChangeEvent, FormEvent, InputHTMLAttributes, useCallback, useState } from 'react';
import Link from 'next/link';
import Input from '@components/Input';
import useInput from '@hooks/useInput';
import useSWRMutation from 'swr/mutation';
import { signUpRequest } from 'apis/auth';

const SignUp = () => {
  const { trigger, isMutating } = useSWRMutation('/api/users', signUpRequest);
  const [email, handleEmail] = useInput('');
  const [nickname, handleNickname] = useInput('');
  const [password, setPassword] = useState('');
  const [passwordValidation, setPasswordValidation] = useState('');
  const [missMathError, setMissMathError] = useState(false);

  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onChangePassword = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
      setMissMathError(event.target.value !== passwordValidation);
    },
    [passwordValidation]
  );

  const onChangePasswordValidation = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPasswordValidation(event.target.value);
      setMissMathError(event.target.value !== password);
    },
    [password]
  );

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!missMathError && nickname) {
        setSignUpError('');
        setSignUpSuccess(false);
        trigger(
          { email: email, nickname: nickname, password: password },
          {
            onSuccess: (data) => {
              setSignUpSuccess(true);
            },
            onError: (err) => {
              setSignUpError(err.response.data);
            },
          }
        );
      }
    },
    [email, missMathError, nickname, password, trigger]
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
          <span className="mb-1 block">닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={handleNickname} />
          </div>
        </label>
        <label id="password-label" className="block cursor-pointer pb-1 text-left text-sm font-bold">
          <span className="mb-1 block">비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" onChange={onChangePassword} />
          </div>
        </label>
        <label id="passwordValidate-label" className="block cursor-pointer pb-1 text-left text-sm font-bold">
          <span className="mb-1 block">비밀번호 확인</span>
          <div>
            <Input type="password" id="password" name="password" onChange={onChangePasswordValidation} />
          </div>
          {missMathError && <div className="mt-3 mb-2 font-bold text-[#e01e5a]">비밀번호가 일치하지 않습니다.</div>}
          {!nickname && <div className="mt-3 mb-2 font-bold text-[#e01e5a]">닉네임을 입력해 주세요.</div>}
          {signUpError && <div className="mt-3 mb-2 font-bold text-[#e01e5a]">{signUpError}</div>}
          {signUpSuccess && (
            <div className="mt-3 mb-2 font-bold text-[#2eb67d]">회원가입되었습니다! 로그인해주세요.</div>
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
          회원가입
        </button>
      </form>
      <p className=" ml-auto mr-auto mt-0 mb-2 w-[400px] text-sm text-[rgb(97,96,97)]">
        이미 계정이 있으신가요?&nbsp;
        <Link href="/signin" className="font-bold text-[rgb(18,100,163)]">
          로그인 하러가기
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
