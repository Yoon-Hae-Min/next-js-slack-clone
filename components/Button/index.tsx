import { COLOR } from 'constants/color';
import React, { ButtonHTMLAttributes, FC, ReactNode } from 'react';

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
  return (
    <button
      className={`shadow-[0_1px_4px_rgba(0, 0, 0, 0.3)] my-3
  h-11 w-full max-w-full cursor-pointer rounded bg-[rgba(${COLOR.primary},1)]
  text-lg font-bold text-white 
  transition-all duration-75 ease-linear
  hover:bg-[rgba(${COLOR.primary},0.9)]
  focus:shadow-[0_0_0_5px_rgba(18,100,163,1),0_0_0_5px_rgba(29,155,209,0.3)]
  `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
