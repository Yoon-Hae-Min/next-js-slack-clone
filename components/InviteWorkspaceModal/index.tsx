import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { IChannel, IUser } from 'types/db';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { userFetcher } from 'apis/user';
import Input from '@components/Input';
import Button from '@components/Button';

interface Props {
  show: boolean;
  onCloseModal: () => void;
}

const InviteWorkspaceModal: FC<Props> = ({ show, onCloseModal }) => {
  const router = useRouter();
  const { workspace } = router.query;
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { data: userData } = useSWR<IUser>('/api/users', userFetcher);

  const { mutate: revalidateMember } = useSWR<IChannel[]>(
    workspace && userData ? `/api/workspaces/${workspace}/members` : null,
    userFetcher
  );

  const onInviteMember = useCallback(
    (e: any) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        return;
      }
      axios
        .post(`/api/workspaces/${workspace}/members`, {
          email: newMember,
        })
        .then((response) => {
          revalidateMember();
          onCloseModal();
          setNewMember('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [workspace, newMember]
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Input.wrapper title="이메일">
          <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
        </Input.wrapper>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteWorkspaceModal;
