import { IChannel, IUser } from 'typings/db';
import { PAGE_PATH } from 'constants/path';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetcher } from '@utils/fetcher';
import useSWR from 'swr';
import { API_PATH } from 'constants/api';

const EachDM = ({ member, isOnline }: { member: IUser; isOnline: boolean }) => {
  const router = useRouter();
  const { workspace } = router.query;
  const { data: userData } = useSWR<IUser>(API_PATH.USERS, fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const date = localStorage.getItem(`${workspace}-${member.id}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData ? API_PATH.WORKSPACE.DM.UNREAD(workspace, member.id, date) : null,
    fetcher
  );

  useEffect(() => {
    if (router.pathname === PAGE_PATH.DM(workspace, member.id)) {
      mutate(0);
    }
  }, [mutate, router.pathname, workspace, member]);
  return (
    <Link
      className="relative flex h-7 items-center pl-9 font-bold"
      key={member.id}
      href={PAGE_PATH.DM(workspace, member.id)}
    >
      <i
        className={`text-md mr-1 block h-3 w-3 rounded-full border-2 ${isOnline ? ' border-none bg-green-900' : ''}`}
        aria-hidden="true"
        data-qa="presence_indicator"
        data-qa-presence-self="false"
        data-qa-presence-active="false"
        data-qa-presence-dnd="false"
      />
      <span>{member.nickname}</span>
      {member.id === userData?.id && <span> (나)</span>}
      {count !== undefined && count > 0 && (
        <span className="count absolute right-3 rounded-lg bg-red-500 px-2 text-sm text-white">{count}</span>
      )}
    </Link>
  );
};

export default EachDM;
