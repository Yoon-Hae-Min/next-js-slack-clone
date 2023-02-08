import { IUser, IUserWithOnline } from 'typings/db';
import { fetcher } from '@utils/fetcher';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import useSocket from '@hooks/useSocket';

const DMList: FC = () => {
  const router = useRouter();
  const { workspace } = router.query;
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher
  );
  const [socket, disconnect] = useSocket(workspace as string);
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });
    return () => {
      socket?.off('onlineList');
    };
  }, [socket]);

  //   useEffect(() => {
  //     console.log('DMList: workspace 바꼈다', workspace);
  //     setOnlineList([]);
  //   }, [workspace]);

  //   useEffect(() => {
  //     socket?.on('onlineList', (data: number[]) => {
  //       setOnlineList(data);
  //     });
  //     // socket?.on('dm', onMessage);
  //     // console.log('socket on dm', socket?.hasListeners('dm'), socket);
  //     return () => {
  //       // socket?.off('dm', onMessage);
  //       // console.log('socket off dm', socket?.hasListeners('dm'));
  //       socket?.off('onlineList');
  //     };
  //   }, [socket]);

  return (
    <>
      <h2>
        <button
          className=" ml-2 inline-flex h-6 w-6 cursor-pointer items-center justify-center text-white"
          onClick={toggleChannelCollapse}
        >
          <i
            className={`${
              channelCollapse && 'transform-none'
            } c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline'`}
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
              <Link
                className="flex h-7 items-center pl-9 "
                key={member.id}
                href={`/workspace/${workspace}/dm/${member.id}`}
              >
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
