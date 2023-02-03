import Menu from '@components/Menu';
import Image from 'next/image';
import React, { FC } from 'react';
import gravatar from 'gravatar';
import useSWR from 'swr';
import { IUser } from 'typings/db';
import { fetcher } from '@utils/fetcher';
import useSignOutMutation from '@hooks/Mutations/useSignOutMutation';

interface userDropDownProps {
  show: boolean;
  onCloseModal: () => void;
}

const UserDropDown: FC<userDropDownProps> = ({ show, onCloseModal }) => {
  const { data: userData, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const { trigger: handleLogOut } = useSignOutMutation();

  if (!userData) return null;
  return (
    <Menu style={{ right: 0, top: 38 }} show={show} onCloseModal={onCloseModal} closeButton>
      <div className="flex p-5">
        <Image
          src={`https:${gravatar.url(userData.nickname, { s: '36px', d: 'retro' })}`}
          width={36}
          height={36}
          alt={userData.nickname}
          className="flex"
        />
        <div className="ml-2 flex flex-col">
          <span className=" inline-block font-bold">{userData.nickname}</span>
          <span className=" inline-block text-sm">Active</span>
        </div>
      </div>
      <button
        className="  block h-8 w-full cursor-pointer border-t border-[rgb(29,28,29)] pt-1 pr-5 pb-1 text-sm outline-none"
        onClick={() => handleLogOut()}
      >
        로그아웃
      </button>
    </Menu>
  );
};

export default UserDropDown;
