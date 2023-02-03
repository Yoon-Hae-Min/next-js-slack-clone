import { COLOR } from 'constants/color';
import React, { ButtonHTMLAttributes, FC, ReactNode } from 'react';

const primaryBg = `bg-[${COLOR.primary}]`;
const hoverPrimaryBg = `hover:bg-[${COLOR.primary}] hover:opacity-90`;
//이걸 어떻게 처리할까?

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
  return (
    <button
      className={`shadow-[0_1px_4px_rgba(0, 0, 0, 0.3)] my-3
  h-11 w-full max-w-full cursor-pointer rounded ${primaryBg}
  text-lg font-bold 
  text-white transition-all duration-75
  ease-linear
  ${hoverPrimaryBg}
  focus:shadow-[0_0_0_5px_rgba(18,100,163,1),0_0_0_5px_rgba(29,155,209,0.3)]
  `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
