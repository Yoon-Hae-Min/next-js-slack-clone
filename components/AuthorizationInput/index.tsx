import { InputHTMLAttributes, FC } from 'react';

const AuthorizationInput: FC<InputHTMLAttributes<HTMLInputElement>> = ({ ...props }) => {
  return (
    <input
      className="mb-5 box-border h-11 w-full rounded 
        border-[1px] border-solid border-[rgba(134,134,134,1)] 
        bg-[rgba(255,255,255)] pt-3 pb-4 text-lg leading-4 
        focus:shadow-focusInput"
      {...props}
    />
  );
};

export default AuthorizationInput;
