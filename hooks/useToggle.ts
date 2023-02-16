import { Dispatch, SetStateAction, useState } from 'react';

const useToggle = (initalState: boolean): [boolean, () => void, Dispatch<SetStateAction<boolean>>] => {
  const [state, setState] = useState(initalState);
  const toggle = () => {
    setState((pre) => !pre);
  };
  return [state, toggle, setState];
};

export default useToggle;
