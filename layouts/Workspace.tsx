import withAuth from '@hooks/HOC/withAuth';
import { fetcher } from '@utils/fetcher';
import { useRouter } from 'next/router';
import { PropsWithChildren, useCallback, useState } from 'react';
import gravatar from 'gravatar';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import type { IUser } from 'typings/db';
import CreateChannelModal from '@components/Modal/CreateChannelModal';
import InviteChannelModal from '@components/Modal/InviteChannelModal';
import InviteWorkspaceModal from '@components/Modal/InviteWorkspaceModal';
import useModal from '@hooks/useModal';
import CreateWorkspaceModal from '@components/Modal/CreateWorkspaceModal';
import WorkspaceDropDown from '@components/Menu/WorkspaceMenu';
import UserDropDown from '@components/Menu/UserMenu';
import { signOutRequest } from '@apis/auth';
import useSignOutMutation from '@hooks/Mutations/useSignOutMutation';
import ChannelList from '@components/ChannelList';
import DMList from '@components/DMList';

const Workspace = ({ children }: PropsWithChildren) => {
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);

  const [showUserMenu, openUserMenu, closeUserMenu] = useModal(false);
  const [showCreateWorkspaceModal, openCreateWorkspaceModal, closeCreateWorkspaceModal] = useModal(false);
  const [showCreateChannelModal, openCreateChannelModal, closeCreateChannelModal] = useModal(false);
  const [showWorkspaceDropDown, openWorkspaceDropDown, closeWorkspaceDropDown] = useModal(false);
  const [showInviteWorkspaceModal, openInviteWorkspaceModal, closeInviteWorkspaceModal] = useModal(false);
  const [showInviteChannelModal, openInviteChannelModal, closeInviteChannelModal] = useModal(false);

  if (!userData) return null;
  return (
    <div>
      <header
        className="shadow-[0_1px_0px_rgba(255, 255, 255, 0.1)] h-9
       bg-[#4a154b] p-1 text-center text-white"
      >
        slack
        <div className="float-right">
          <Image
            src={`https:${gravatar.url(userData.nickname, { s: '28', d: 'retro' })}`}
            width={28}
            height={28}
            alt={userData.nickname}
            onClick={openUserMenu}
          />
        </div>
        {showUserMenu && <UserDropDown show={showUserMenu} onCloseModal={closeUserMenu} />}
      </header>
      <div className="flex flex-1">
        <div className="inline-block w-16 flex-col items-center border-t border-r border-[#502551] bg-[#3f0e40] pt-4 text-center align-top">
          {userData?.Workspaces.map((ws) => (
            <Link key={ws.id} href={`/workspace/${ws.url}/channel/일반`}>
              <button className="mb-4 inline-block h-10 w-10 cursor-pointer rounded-xl border-4  border-[#3f0e40] bg-white text-lg font-bold text-black">
                {ws.name.slice(0, 1).toUpperCase()}
              </button>
            </Link>
          ))}
          <button
            className=" inline-block h-10 w-10 cursor-pointer text-2xl text-white"
            onClick={openCreateWorkspaceModal}
          >
            +
          </button>
        </div>
        <nav className="inline-flex w-64 flex-col bg-[#3f0e40] align-top text-[rgb(188,171,188)]">
          <div
            onClick={openWorkspaceDropDown}
            className="inline-flex h-16 w-full cursor-pointer items-center overflow-hidden text-ellipsis whitespace-nowrap border-t border-b border-[#522653] pl-4 text-left text-2xl font-bold leading-10 text-white"
          >
            Slack
          </div>
          <WorkspaceDropDown
            isShow={showWorkspaceDropDown}
            closeDropDown={closeWorkspaceDropDown}
            openInviteWorkspaceModal={openInviteWorkspaceModal}
            openCreateChannelModal={openCreateChannelModal}
          />
          <div className="h-[calc(100vh-102px)] overflow-y-auto">
            <ChannelList />
            <DMList />
          </div>
        </nav>
        <div className="flex-1">{children}</div>
      </div>
      <CreateWorkspaceModal show={showCreateWorkspaceModal} onCloseModal={closeCreateWorkspaceModal} />
      <CreateChannelModal show={showCreateChannelModal} onCloseModal={closeCreateChannelModal} />
      <InviteWorkspaceModal show={showInviteWorkspaceModal} onCloseModal={closeInviteWorkspaceModal} />
      <InviteChannelModal show={showInviteChannelModal} onCloseModal={closeInviteChannelModal} />
    </div>
  );
};

export default withAuth(Workspace);
