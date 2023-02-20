import { IDM, IChat } from '@typings/db';
import React, { FC, memo, useMemo } from 'react';
import gravatar from 'gravatar';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import Image from 'next/image';
import regexifyString from 'regexify-string';
import Link from 'next/link';
import { PAGE_PATH } from 'constants/path';
import { USER_MENTION, USER_NAME } from 'constants/regularExpression';

interface Props {
  data: IDM | IChat;
}

const Chat: FC<Props> = ({ data }) => {
  const router = useRouter();
  const { workspace } = router.query;

  const user = 'Sender' in data ? data.Sender : data.User;

  const result = useMemo(
    () =>
      regexifyString({
        input: data.content,
        pattern: USER_MENTION,
        decorator(match, index) {
          const userName = match.match(USER_NAME)?.[1];
          return (
            <Link className="bg-amber-300" key={match + index} href={PAGE_PATH.DM(workspace, userName)}>
              @{userName}
            </Link>
          );
        },
      }),
    [workspace, data.content]
  );

  return (
    <div className=" flex items-center py-2 px-5">
      <div className="chat-img mr-2">
        <Image
          src={`https:${gravatar.url(user.email, { s: '36px', d: 'retro' })}`}
          width={36}
          height={36}
          alt={user.nickname}
        />
      </div>
      <div className="chat-text flex flex-1 flex-col flex-wrap">
        <div className="chat-user flex">
          <b className="mr-1">{user.nickname}</b>
          <span className=" text-sm">{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <div className="whitespace-pre-wrap">{result}</div>
      </div>
    </div>
  );
};

export default memo(Chat);
