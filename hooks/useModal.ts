import type { Dispatch, SetStateAction, UIEvent } from 'react';
import { useCallback, useState } from 'react';
const useModal = (initialization: boolean): [boolean, () => void, () => void, Dispatch<SetStateAction<boolean>>] => {
  const [isOpen, setIsOpen] = useState(initialization);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return [isOpen, openModal, closeModal, setIsOpen];
};

export default useModal;
