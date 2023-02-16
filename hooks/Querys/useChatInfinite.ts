import { IDM } from 'typings/db';
import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite';
import React from 'react';
import { API_PATH } from 'constants/api';
import { fetcher } from '@utils/fetcher';

const useChatInfinite = (
  getKey: (index: number) => string | undefined
): [SWRInfiniteResponse<IDM[], any>, boolean, boolean] => {
  const infinite = useSWRInfinite<IDM[]>(getKey, fetcher);

  const isEmpty = infinite.data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (infinite.data && infinite.data[infinite.data.length - 1]?.length < 20) || false;

  return [infinite, isEmpty, isReachingEnd];
};

export default useChatInfinite;
