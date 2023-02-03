import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { IUser } from 'typings/db';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { fetcher } from '@utils/fetcher';
import Input from '@components/Input';
import { useRouter } from 'next/router';
import Button from '@components/Button';

interface Props {
  show: boolean;
  onCloseModal: () => void;
}
const InviteChannelModal: FC<Props> = ({ show, onCloseModal }) => {
  const router = useRouter();
  const { workspace, channel } = router.query;
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { mutate: mutateMembers } = useSWR<IUser[]>(
    userData && channel ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher
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
          onCloseModal();
          setNewMember('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newMember, workspace, channel, mutateMembers, onCloseModal, setNewMember]
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Input.wrapper title="채널 맴버 초대">
          <Input id="member" value={newMember} onChange={onChangeNewMember} />
        </Input.wrapper>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteChannelModal;
