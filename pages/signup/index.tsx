import React, { ChangeEvent, FormEvent, InputHTMLAttributes, useCallback, useState } from 'react';
import Link from 'next/link';
import Input from '@components/Input';
import useInput from '@hooks/useInput';
import useSWRMutation from 'swr/mutation';
import { postRequest } from 'apis/axios';
import { API_PATH } from 'constants/api';
import { PAGE_PATH } from 'constants/path';
import withOutAuth from '@hooks/HOC/withOutAuth';

const SignUp = () => {
  const { trigger, isMutating } = useSWRMutation(API_PATH.USERS, postRequest);
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
          {missMathError && <div className="mt-3 mb-2 font-bold text-error">비밀번호가 일치하지 않습니다.</div>}
          {!nickname && <div className="mt-3 mb-2 font-bold text-error">닉네임을 입력해 주세요.</div>}
          {signUpError && <div className="mt-3 mb-2 font-bold text-error">{signUpError}</div>}
          {signUpSuccess && <div className="mt-3 mb-2 font-bold text-success">회원가입되었습니다! 로그인해주세요.</div>}
        </label>
        <button type="submit" className="btn-primary">
          회원가입
        </button>
      </form>
      <p className=" ml-auto mr-auto mt-0 mb-2 w-[400px] text-sm text-gray-300">
        이미 계정이 있으신가요?&nbsp;
        <Link href={PAGE_PATH.SIGNIN} className="font-bold text-blue-300">
          로그인 하러가기
        </Link>
      </p>
    </div>
  );
};

export default withOutAuth(SignUp);
