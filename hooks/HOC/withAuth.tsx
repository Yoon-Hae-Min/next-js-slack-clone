import { fetcher } from '@utils/fetcher';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import useSWR from 'swr';
import { API_PATH } from 'constants/api';

const withAuth = (WrappedComponent: FC) => {
  const Component = (props: any) => {
    const router = useRouter();
    const { data } = useSWR(API_PATH.USERS, fetcher, {
      onSuccess: (data) => {
        !data && router.push('/signin');
      },
    });

    return data ? <WrappedComponent {...props} /> : null;
  };
  return Component;
};

export default withAuth;
