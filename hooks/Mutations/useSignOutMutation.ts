import { IUser } from '@typings/db';
import { fetcher } from '@utils/fetcher';
import useSWR, { mutate } from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { useRouter } from 'next/router';
import { postRequest } from 'apis/axios';
import { API_PATH } from 'constants/api';
import { PAGE_PATH } from 'constants/path';

const useSignOutMutation = (option?: SWRMutationConfiguration<any, any, typeof API_PATH.SIGNOUT>) => {
  const router = useRouter();
  return useSWRMutation(
    API_PATH.SIGNOUT,
    postRequest,
    option ?? {
      onSuccess: () => {
        mutate(API_PATH.USERS, undefined);
        router.push(PAGE_PATH.SIGNIN);
      },
    }
  );
};

export default useSignOutMutation;
