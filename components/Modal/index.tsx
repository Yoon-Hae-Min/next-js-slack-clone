import React, { FC, ReactNode, useCallback } from 'react';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  children: ReactNode;
}
const Modal: FC<Props> = ({ show, children, onCloseModal }) => {
  const stopPropagation = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }
  return (
    <div className=" fixed left-0 right-0 top-0 bottom-0 z-50 text-center" onClick={onCloseModal}>
      <div
        className=" relative mt-48 inline-block w-[440px] max-w-[440px] rounded-md bg-white-100 px-10 pt-8 shadow-lg"
        onClick={stopPropagation}
      >
        <button className=" bg-transparent absolute right-2 top-1 cursor-pointer text-3xl" onClick={onCloseModal}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
