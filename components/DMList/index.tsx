import { IUser, IUserWithOnline } from 'typings/db';
import { fetcher } from '@utils/fetcher';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import useSocket from '@hooks/useSocket';
import useToggle from '@hooks/useToggle';
import { API_PATH } from 'constants/api';
import { PAGE_PATH } from 'constants/path';

const DMList: FC = () => {
  const router = useRouter();
  const { workspace } = router.query;
  const { data: userData } = useSWR<IUser>(API_PATH.USERS, fetcher, {
    dedupingInterval: 2000,
  });
  const { data: memberData } = useSWR<IUserWithOnline[]>(workspace ? API_PATH.MEMBERS(workspace) : null, fetcher);
  const [socket, disconnect] = useSocket(workspace as string);
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
            return (
              <Link className="flex h-7 items-center pl-9 " key={member.id} href={PAGE_PATH.DM(workspace, member.id)}>
                <i
                  className={`text-md mr-1 block h-3 w-3 rounded-full border-2 ${
                    isOnline ? ' border-none bg-green-900' : ''
                  }`}
                  aria-hidden="true"
                  data-qa="presence_indicator"
                  data-qa-presence-self="false"
                  data-qa-presence-active="false"
                  data-qa-presence-dnd="false"
                />
                <span>{member.nickname}</span>
                {member.id === userData?.id && <span> (나)</span>}
              </Link>
            );
          })}
      </div>
    </>
  );
};

export default DMList;
