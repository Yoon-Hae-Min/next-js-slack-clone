import { InputHTMLAttributes, FC, ReactNode } from 'react';

interface inputOptions {
  wrapper: FC<inputWrapperProps>;
}

const Input: FC<InputHTMLAttributes<HTMLInputElement>> & inputOptions = ({ ...props }) => {
  return (
    <input
      className="mb-5 box-border h-11 w-full rounded 
        border border-solid border-gray-200 
        bg-white pt-3 pb-4 text-lg leading-4 
        focus:shadow-focusInput"
      {...props}
    />
  );
};

interface inputWrapperProps {
  title: string;
  children: ReactNode;
}

const InputWrapper: FC<inputWrapperProps> = ({ title, children, ...props }) => {
  return (
    <label className="block cursor-pointer pb-1 text-left text-sm font-bold" {...props}>
      <span>{title}</span>
      {children}
    </label>
  );
};

Input.wrapper = InputWrapper;

export default Input;
