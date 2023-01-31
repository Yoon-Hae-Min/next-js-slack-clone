import React from 'react';
import Link from 'next/link';
import AuthorizationInput from '@components/AuthorizationInput';

const SignUp = () => {
  return (
    <div id="container">
      <header className="mt-12 mb-12 text-center text-5xl font-bold">Slack</header>
      <form className="m-auto w-[400px] max-w-[400px]">
        <label id="email-label" className="block cursor-pointer pb-1 text-left text-sm font-bold">
          <span className="mb-1 block">이메일 주소</span>
          <div>
            <AuthorizationInput type="email" id="email" name="email" />
          </div>
        </label>
        <label id="password-label" className="block cursor-pointer pb-1 text-left text-sm font-bold">
          <span className="mb-1 block">비밀번호</span>
          <div>
            <AuthorizationInput type="password" id="password" name="password" />
          </div>
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
        <Link href="/signup" className="font-bold text-[rgb(18,100,163)]">
          회원가입 하러가기
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
