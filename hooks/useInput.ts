import type { Dispatch, SetStateAction, UIEvent } from 'react';
import { useCallback, useState } from 'react';

const useInput = <T = any>(initialization: T): [T, (e: any) => void, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState(initialization);

  const handler = useCallback((event: any) => {
    setValue(event.target.value);
  }, []);

  return [value, handler, setValue];
};

export default useInput;
