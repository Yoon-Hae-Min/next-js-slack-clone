import { fetcher } from '@utils/fetcher';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import useSWR from 'swr';
import { API_PATH } from 'constants/api';
import { PAGE_PATH } from 'constants/path';

const withAuth = (WrappedComponent: FC) => {
  const Component = (props: any) => {
    const router = useRouter();
    const { data } = useSWR(API_PATH.USERS, fetcher, {
      onSuccess: (data) => {
        !data && router.push(PAGE_PATH.SIGNIN);
      },
    });

    return data ? <WrappedComponent {...props} /> : null;
  };
  return Component;
};

export default withAuth;
