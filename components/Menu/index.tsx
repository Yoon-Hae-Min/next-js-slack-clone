import React, { CSSProperties, FC, ReactNode, useCallback } from 'react';

interface Props {
  children: ReactNode;
  show: boolean;
  onCloseModal: (e: any) => void;
  style: CSSProperties;
  closeButton?: boolean;
}

const Menu: FC<Props> = ({ children, style, show, onCloseModal, closeButton }) => {
  const stopPropagation = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 z-50" onClick={onCloseModal}>
      <div
        className=" absolute z-30 inline-block max-h-[calc(100vh-20px)] min-w-[360px] rounded-md bg-white-100 text-black-200 shadow-lg "
        style={style}
        onClick={stopPropagation}
      >
        {closeButton && (
          <button
            className=" absolute right-2  cursor-pointer border-none bg-transparent text-2xl"
            onClick={onCloseModal}
          >
            &times;
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Menu;
