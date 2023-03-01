import { IUser, IUserWithOnline } from '@typings/db';
import { fetcher } from '@utils/fetcher';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import useSocket from '@hooks/useSocket';
import useToggle from '@hooks/useToggle';
import { API_PATH } from 'constants/api';
import { PAGE_PATH } from 'constants/path';
import EachDM from '@components/EachDM';

const DMList: FC = () => {
  const router = useRouter();
  const { cache, mutate } = useSWRConfig();
  const { workspace } = router.query;
  console.log(cache.get(API_PATH.WORKSPACE.MEMBERS(workspace))); // 캐시된 데이터 확인
  const { data: userData } = useSWR<IUser>(API_PATH.USERS, fetcher, {
    dedupingInterval: 2000,
  });
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    workspace ? API_PATH.WORKSPACE.MEMBERS(workspace) : null,
    fetcher,
    { revalidateOnMount: false }
  );
  console.log(memberData);
  const [socket] = useSocket(workspace as string);
  const [channelCollapse, toggleChannelCollapse] = useToggle(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);

  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });
    return () => {
      socket?.off('onlineList');
    };
  }, [socket]);

  return (
    <>
      <h2>
        <button
          className=" ml-2 inline-flex h-6 w-6 cursor-pointer items-center justify-center text-white"
          onClick={toggleChannelCollapse}
        >
          <i
            className={`${channelCollapse && 'transform-none'}`}
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </button>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return <EachDM member={member} key={member.id} isOnline={isOnline} />;
          })}
      </div>
    </>
  );
};

export default DMList;
