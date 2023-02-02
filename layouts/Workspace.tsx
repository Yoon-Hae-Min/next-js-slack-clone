import withAuth from '@hooks/HOC/withAuth';
import api from 'apis/axios';
import { userFetcher } from 'apis/user';
import { useRouter } from 'next/router';
import { PropsWithChildren, useCallback } from 'react';
import gravatar from 'gravatar';
import useSWR from 'swr';
import Image from 'next/image';

const Workspace = ({ children }: PropsWithChildren) => {
  const { data, mutate } = useSWR('/api/users', userFetcher);
  const router = useRouter();
  const handleLogOut = useCallback(() => {
    api
      .post('/api/users/logout', null, {
        withCredentials: true,
      })
      .then((data) => {
        mutate(false, false);
        router.push('/signin');
      });
  }, []);
  return (
    <div>
      <header
        className="shadow-[0_1px_0px_rgba(255, 255, 255, 0.1)] h-9
       bg-[#4a154b] p-1 text-center text-white"
      >
        slack
        <div className="float-right">
          <Image
            src={`https:${gravatar.url(data.nickname, { s: '28', d: 'retro' })}`}
            width={28}
            height={28}
            alt={data.nickname}
          />
          <button onClick={handleLogOut}>로그아웃</button>
        </div>
      </header>
      <div className="flex flex-1">
        <div className="inline-block w-16 flex-col items-center border-t border-r border-[#502551] bg-[#3f0e40] pt-4 text-center align-top">
          test
        </div>
        <nav className="inline-flex w-64 flex-col bg-[#3f0e40] align-top text-[rgb(188,171,188)]">
          <div className="inline-flex h-16 w-full cursor-pointer items-center overflow-hidden text-ellipsis whitespace-nowrap border-t border-b border-[#522653] pl-4 text-left text-2xl font-bold leading-10 text-white">
            Slack
          </div>
          <div className="  h-[calc(100vh-102px)] overflow-y-auto">MenuScroll</div>
        </nav>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default withAuth(Workspace);
