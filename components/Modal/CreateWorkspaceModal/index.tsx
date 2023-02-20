import Button from '@components/Button';
import Input from '@components/Input';
import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { IUser } from '@typings/db';
import api from 'apis/axios';
import { fetcher } from '@utils/fetcher';
import React, { FC, useCallback } from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface createWorkspaceModalProps {
  show: boolean;
  onCloseModal: () => void;
}

const CreateWorkspaceModal: FC<createWorkspaceModalProps> = ({ show, onCloseModal }) => {
  const { data: userData, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const [newWorkspace, handleNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, handleNewUrl, setNewUrl] = useInput('');
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
          onCloseModal();
          setNewWorkspace('');
          setNewUrl('');
          toast.error('에러다', { position: 'bottom-center' });
        })
        .catch((error) => {
          console.dir(error);
        });
    },
    [newWorkspace, newUrl, mutate, onCloseModal, setNewWorkspace, setNewUrl]
  );
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateWorkspace}>
        <Input.wrapper title="워크스페이스 이름">
          <Input value={newWorkspace} onChange={handleNewWorkspace} />
        </Input.wrapper>
        <Input.wrapper title="워크스페이스 url">
          <Input value={newUrl} onChange={handleNewUrl} />
        </Input.wrapper>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateWorkspaceModal;
