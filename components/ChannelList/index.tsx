import { IChannel, IUser } from 'typings/db';
import Link from 'next/link';
import React, { FC, useCallback, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { fetcher } from '@utils/fetcher';
import { API_PATH } from 'constants/api';
import useToggle from '@hooks/useToggle';
import { PAGE_PATH } from 'constants/path';
import EachChannel from '@components/EachChannel';

const ChannelList: FC = () => {
  const router = useRouter();
  const { workspace } = router.query;
  // const [socket] = useSocket(workspace);
  const { data: userData, mutate } = useSWR<IUser>(API_PATH.USERS, fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: channelData } = useSWR<IChannel[]>(workspace ? API_PATH.WORKSPACE.CHANNELS(workspace) : null, fetcher);
  const [channelCollapse, toggleChannelCollapse] = useToggle(false);

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
            return <EachChannel channel={channel} key={channel.id} />;
          })}
      </div>
    </>
  );
};

export default ChannelList;
