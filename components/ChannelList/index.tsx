import { IChannel, IUser } from 'typings/db';
import Link from 'next/link';
import React, { FC, useCallback, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { fetcher } from '@utils/fetcher';

const ChannelList: FC = () => {
  const router = useRouter();
  const { workspace } = router.query;
  // const [socket] = useSocket(workspace);
  const { data: userData, mutate } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);
  const [channelCollapse, setChannelCollapse] = useState(false);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

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
            }  c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline`}
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </button>
        <span>Channels</span>
        <button></button>
      </h2>
      <div>
        {!channelCollapse &&
          channelData?.map((channel) => {
            return (
              <Link
                className="flex h-7 items-center pl-9 font-bold"
                key={channel.name}
                href={`/workspace/${workspace}/channel/${channel.name}`}
              >
                <span># {channel.name}</span>
              </Link>
            );
          })}
      </div>
    </>
  );
};

export default ChannelList;
