import { fetcher } from '@utils/fetcher';
import { useRouter } from 'next/router';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import gravatar from 'gravatar';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import type { IChannel, IUser } from '@typings/db';
import CreateChannelModal from '@components/Modal/CreateChannelModal';
import InviteChannelModal from '@components/Modal/InviteChannelModal';
import InviteWorkspaceModal from '@components/Modal/InviteWorkspaceModal';
import useModal from '@hooks/useModal';
import CreateWorkspaceModal from '@components/Modal/CreateWorkspaceModal';
import WorkspaceDropDown from '@components/Menu/WorkspaceMenu';
import UserDropDown from '@components/Menu/UserMenu';
import ChannelList from '@components/ChannelList';
import DMList from '@components/DMList';
import useSocket from '@hooks/useSocket';
import { API_PATH } from 'constants/api';

const Workspace = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { workspace } = router.query;
  const { data: userData } = useSWR<IUser | false>(API_PATH.USERS, fetcher);
  const { data: channelData } = useSWR<IChannel[]>(workspace ? API_PATH.WORKSPACE.CHANNELS(workspace) : null, fetcher);

  const [showUserMenu, openUserMenu, closeUserMenu] = useModal(false);
  const [showCreateWorkspaceModal, openCreateWorkspaceModal, closeCreateWorkspaceModal] = useModal(false);
  const [showCreateChannelModal, openCreateChannelModal, closeCreateChannelModal] = useModal(false);
  const [showWorkspaceDropDown, openWorkspaceDropDown, closeWorkspaceDropDown] = useModal(false);
  const [showInviteWorkspaceModal, openInviteWorkspaceModal, closeInviteWorkspaceModal] = useModal(false);
  const [showInviteChannelModal, openInviteChannelModal, closeInviteChannelModal] = useModal(false);

  const [socket, disconnect] = useSocket(workspace as string);

  useEffect(() => {
    if (channelData && userData && socket) {
      socket.emit('login', { id: userData.id, channels: channelData.map((v) => v.id) });
    }
  }, [channelData, socket, userData]);

  if (!userData) return null;
  return (
    <div>
      <header
        className="h-9 bg-primary
       p-1 text-center text-white shadow-sm"
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
        <div className="inline-block w-16 flex-col items-center border-t border-r border-primary-200 bg-primary-400 pt-4 text-center align-top">
          {userData?.Workspaces.map((ws) => (
            <Link key={ws.id} href={`/workspace/${ws.url}/channel/일반`}>
              <button className="mb-4 inline-block h-10 w-10 cursor-pointer rounded-xl border-4  border-primary-400 bg-white text-lg font-bold text-black">
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
        <nav className="inline-flex w-64 flex-col bg-primary-200 align-top text-[#bcabbc]">
          <div
            onClick={openWorkspaceDropDown}
            className="inline-flex h-16 w-full cursor-pointer items-center overflow-hidden text-ellipsis whitespace-nowrap border-t border-b border-primary-250 pl-4 text-left text-2xl font-bold leading-10 text-white"
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

export default Workspace;
