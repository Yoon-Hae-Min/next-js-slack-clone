import AuthorizationInput from '@components/AuthorizationInput';
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
        <label className="block cursor-pointer pb-1 text-left text-sm font-bold">
          <span>채널</span>
          <AuthorizationInput id="channel" value={newChannel} onChange={onChangeNewChannel} />
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
  );
};

export default CreateChannelModal;
