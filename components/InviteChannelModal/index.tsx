import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { IUser } from 'types/db';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { userFetcher } from 'apis/user';
import AuthorizationInput from '@components/AuthorizationInput';
import { useRouter } from 'next/router';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: (flag: boolean) => void;
}
const InviteChannelModal: FC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const router = useRouter();
  const { workspace, channel } = router.query;
  console.log(workspace, channel);
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { data: userData } = useSWR<IUser>('/api/users', userFetcher);
  const { mutate: mutateMembers } = useSWR<IUser[]>(
    userData && channel ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    userFetcher
  );

  const onInviteMember = useCallback(
    (e: any) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        return;
      }
      axios
        .post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
          email: newMember,
        })
        .then(() => {
          mutateMembers();
          setShowInviteChannelModal(false);
          setNewMember('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [channel, mutateMembers, newMember, setNewMember, setShowInviteChannelModal, workspace]
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <label className="block cursor-pointer pb-1 text-left text-sm font-bold">
          <span>채널 멤버 초대</span>
          <AuthorizationInput id="member" value={newMember} onChange={onChangeNewMember} />
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
          초대하기
        </button>
      </form>
    </Modal>
  );
};

export default InviteChannelModal;
