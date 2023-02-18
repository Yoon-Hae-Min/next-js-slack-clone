import { IChannel, IUser } from 'typings/db';
import { PAGE_PATH } from 'constants/path';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetcher } from '@utils/fetcher';
import useSWR from 'swr';
import { API_PATH } from 'constants/api';

const EachChannel = ({ channel }: { channel: IChannel }) => {
  const router = useRouter();
  const { workspace } = router.query;
  const { data: userData } = useSWR<IUser>(API_PATH.USERS, fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const date = localStorage.getItem(`${workspace}-${channel.name}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData ? API_PATH.WORKSPACE.CHANNEL.UNREAD(workspace, channel.name, date) : null,
    fetcher
  );

  useEffect(() => {
    if (router.pathname === PAGE_PATH.CHANNEL(workspace, channel.name)) {
      mutate(0);
    }
  }, [mutate, router.pathname, workspace, channel]);
  return (
    <Link
      className="relative flex h-7 items-center pl-9 font-bold"
      key={channel.name}
      href={PAGE_PATH.CHANNEL(workspace, channel.name)}
    >
      <span># {channel.name}</span>
      {count !== undefined && count > 0 && (
        <span className="count absolute right-3 rounded-lg bg-red-500 px-2 text-sm text-white">{count}</span>
      )}
    </Link>
  );
};

export default EachChannel;
