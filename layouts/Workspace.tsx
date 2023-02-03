import withAuth from '@hooks/HOC/withAuth';
import api from 'apis/axios';
import { userFetcher } from 'apis/user';
import { useRouter } from 'next/router';
import { PropsWithChildren, useCallback, useState } from 'react';
import gravatar from 'gravatar';
import useSWR from 'swr';
import Image from 'next/image';
import Menu from '@components/Menu';
import Link from 'next/link';
import { IUser } from 'types/db';
import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import AuthorizationInput from '@components/AuthorizationInput';
import { ToastContainer, toast } from 'react-toastify';
import CreateChannelModal from '@components/CreateChannelModal';
import InviteChannelModal from '@components/InviteChannelModal';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';

const Workspace = ({ children }: PropsWithChildren) => {
  const { data: userData, mutate } = useSWR<IUser | false>('/api/users', userFetcher);
  const router = useRouter();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const [newWorkspace, handleNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, handleNewUrl, setNewUrl] = useInput('');

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);

  const handleAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const toggleWorkspaceModal = () => {
    setShowWorkspaceModal((pre) => !pre);
  };

  const handleCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowWorkspaceModal(false);
    setShowInviteWorkspaceModal(false);
    setShowInviteChannelModal(false);
  }, []);

  const handleCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const toggleUserProfile = useCallback((e: any) => {
    e.stopPropagation();
    // 부모의 event handling에 영향을 받지 않게 해줌
    setShowUserMenu((prev) => !prev);
  }, []);

  const onCreateWorkspace = useCallback(
    (e: any) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      api
        .post(
          '/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          mutate();
          setShowCreateWorkspaceModal(false);
          setNewWorkspace('');
          setNewUrl('');
          toast.error('에러다', { position: 'bottom-center' });
        })
        .catch((error) => {
          console.dir(error);
        });
    },
    [newWorkspace, newUrl, mutate, setNewWorkspace, setNewUrl]
  );

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
            onClick={toggleUserProfile}
          />
          {showUserMenu && (
            <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={toggleUserProfile} closeButton>
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
                onClick={handleLogOut}
              >
                로그아웃
              </button>
            </Menu>
          )}
        </div>
      </header>
      <div className="flex flex-1">
        <div className="inline-block w-16 flex-col items-center border-t border-r border-[#502551] bg-[#3f0e40] pt-4 text-center align-top">
          {userData?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} href={`/workspace/${123}/channel/일반`}>
                <button className="mb-4 inline-block h-10 w-10 cursor-pointer rounded-xl border-4  border-[#3f0e40] bg-white text-lg font-bold text-black">
                  {ws.name.slice(0, 1).toUpperCase()}
                </button>
              </Link>
            );
          })}
          <button
            className=" inline-block h-10 w-10 cursor-pointer text-2xl text-white"
            onClick={handleCreateWorkspace}
          >
            +
          </button>
        </div>
        <nav className="inline-flex w-64 flex-col bg-[#3f0e40] align-top text-[rgb(188,171,188)]">
          <div
            onClick={toggleWorkspaceModal}
            className="inline-flex h-16 w-full cursor-pointer items-center overflow-hidden text-ellipsis whitespace-nowrap border-t border-b border-[#522653] pl-4 text-left text-2xl font-bold leading-10 text-white"
          >
            Slack
          </div>
          <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }} closeButton>
            <div className=" pt-2">
              <h2 className=" pl-5">Sleact</h2>
              <button
                onClick={onClickInviteWorkspace}
                className=" h-7 w-full cursor-pointer border-t border-[rgb(28,29,28)] bg-transparent p-1"
              >
                워크스페이스에 사용자 초대
              </button>
              <button
                className=" h-7 w-full cursor-pointer border-t border-[rgb(28,29,28)] bg-transparent p-1"
                onClick={handleAddChannel}
              >
                채널 만들기
              </button>
              <button
                className=" h-7 w-full cursor-pointer border-t border-[rgb(28,29,28)] bg-transparent p-1"
                onClick={handleLogOut}
              >
                로그아웃
              </button>
            </div>
          </Menu>
          <div className="  h-[calc(100vh-102px)] overflow-y-auto">MenuScroll</div>
        </nav>
        <div className="flex-1">{children}</div>
      </div>
      <Modal show={showCreateWorkspaceModal} onCloseModal={handleCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <label className="mb-4">
            <span className="block cursor-pointer pb-2 text-left font-bold">워크스페이스 이름</span>
            <AuthorizationInput value={newWorkspace} onChange={handleNewWorkspace} />
          </label>
          <label className="mb-4">
            <span className="block cursor-pointer pb-2 text-left font-bold">워크스페이스 url</span>
            <AuthorizationInput value={newUrl} onChange={handleNewUrl} />
          </label>
          <button
            className="shadow-[0_1px_4px_rgba(0, 0, 0, 0.3)] my-3
          h-11 w-full max-w-full cursor-pointer rounded bg-[#4a154b]
          text-lg font-bold text-white 
          transition-all duration-75 ease-linear
          hover:bg-[rgba(74,21,75,0.9)]
          focus:shadow-[0_0_0_5px_rgba(18,100,163,1),0_0_0_5px_rgba(29,155,209,0.3)]
          "
            type="submit"
          >
            생성하기
          </button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={handleCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={handleCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={handleCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </div>
  );
};

export default withAuth(Workspace);
