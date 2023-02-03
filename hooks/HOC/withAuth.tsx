import api from 'apis/axios';
import { fetcher } from '@utils/fetcher';
import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';
import useSWR from 'swr';

const withAuth = (WrappedComponent: FC) => {
  const Component = (props: any) => {
    const router = useRouter();
    const { data } = useSWR('/api/users', fetcher);
    console.log(data);
    useEffect(() => {
      if (data !== undefined && !data) {
        router.replace('/signin');
      }
    }, [data, router]);

    return data ? <WrappedComponent {...props} /> : null;
  };
  return Component;
};

export default withAuth;
