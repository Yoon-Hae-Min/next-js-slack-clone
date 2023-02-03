import { IUser } from 'typings/db';
import { fetcher } from '@utils/fetcher';
import useSWR, { mutate } from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { useRouter } from 'next/router';
import { signOutRequest } from 'apis/auth';

const useSignOutMutation = (option?: SWRMutationConfiguration<any, any, '/api/users/logout'>) => {
  const router = useRouter();
  return useSWRMutation(
    '/api/users/logout',
    signOutRequest,
    option ?? {
      onSuccess: () => {
        mutate('/api/users', false);
        router.push('/signin');
      },
    }
  );
};

export default useSignOutMutation;
