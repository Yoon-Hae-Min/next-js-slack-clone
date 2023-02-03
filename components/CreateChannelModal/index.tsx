import Button from '@components/Button';
import Input from '@components/Input';
import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import React, { useCallback, FC } from 'react';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}
const CreateChannelModal: FC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form>
        <Input.wrapper title="채널">
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Input.wrapper>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
