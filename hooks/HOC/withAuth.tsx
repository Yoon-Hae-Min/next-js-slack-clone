import api from 'apis/axios';
import { userFetcher } from 'apis/user';
import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';
import useSWR from 'swr';

const withAuth = (WrappedComponent: FC) => {
  const Component = (props: any) => {
    const router = useRouter();
    const { data } = useSWR('/api/users', userFetcher);
    console.log(data);
    useEffect(() => {
      if (data && !data) {
        router.replace('/signin');
      }
    }, [data, router]);

    return data ? <WrappedComponent {...props} /> : null;
  };
  return Component;
};

export default withAuth;
