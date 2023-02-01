import withAuth from '@hooks/HOC/withAuth';
import api from 'apis/axios';
import { userFetcher } from 'apis/user';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import useSWR from 'swr';

const Workspace = () => {
  const { data, mutate } = useSWR('/api/users', userFetcher);
  const router = useRouter();
  const handleLogOut = useCallback(() => {
    api
      .post('/api/users/logout', null, {
        withCredentials: true,
      })
      .then((data) => {
        mutate(false, false);
        router.push('/signin');
      });
  }, []);
  return <button onClick={handleLogOut}>로그아웃</button>;
};

export default withAuth(Workspace);
