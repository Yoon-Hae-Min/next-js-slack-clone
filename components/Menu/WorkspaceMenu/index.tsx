import Menu from '@components/Menu';
import useSignOutMutation from '@hooks/Mutations/useSignOutMutation';
import React, { FC } from 'react';

interface workspaceDropDownProps {
  isShow: boolean;
  closeDropDown: () => void;
  openInviteWorkspaceModal: () => void;
  openCreateChannelModal: () => void;
}

const WorkspaceDropDown: FC<workspaceDropDownProps> = ({
  isShow,
  closeDropDown,
  openInviteWorkspaceModal,
  openCreateChannelModal,
}) => {
  const { trigger: handleLogOut } = useSignOutMutation();
  return (
    <Menu show={isShow} onCloseModal={closeDropDown} style={{ top: 95, left: 80 }} closeButton>
      <div className=" pt-2">
        <h2 className=" pl-5">Sleact</h2>
        <button
          onClick={openInviteWorkspaceModal}
          className=" h-7 w-full cursor-pointer border-t border-[rgb(28,29,28)] bg-transparent p-1"
        >
          워크스페이스에 사용자 초대
        </button>
        <button
          className=" h-7 w-full cursor-pointer border-t border-[rgb(28,29,28)] bg-transparent p-1"
          onClick={openCreateChannelModal}
        >
          채널 만들기
        </button>
        <button
          className=" h-7 w-full cursor-pointer border-t border-[rgb(28,29,28)] bg-transparent p-1"
          onClick={() => handleLogOut()}
        >
          로그아웃
        </button>
      </div>
    </Menu>
  );
};

export default WorkspaceDropDown;
