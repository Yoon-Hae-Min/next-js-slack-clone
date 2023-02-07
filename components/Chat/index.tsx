import { IDM, IChat } from 'typings/db';
import React, { FC, VFC, memo, useMemo } from 'react';
import gravatar from 'gravatar';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import Image from 'next/image';

interface Props {
  data: IDM | IChat;
}

// const BACK_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3095' : 'https://sleact.nodebird.com';
const Chat: FC<Props> = ({ data }) => {
  const router = useRouter();
  const { workspace } = router.query;
  const user = 'Sender' in data ? data.Sender : data.User;

  //   const result = useMemo(
  //     () =>
  //       // uploads\\서버주소
  //       data.content.startsWith('uploads\\') || data.content.startsWith('uploads/') ? (
  //         <img src={`${BACK_URL}/${data.content}`} style={{ maxHeight: 200 }} />
  //       ) : (
  //         regexifyString({
  //           input: data.content,
  //           pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
  //           decorator(match, index) {
  //             const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
  //             if (arr) {
  //               return (
  //                 <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
  //                   @{arr[1]}
  //                 </Link>
  //               );
  //             }
  //             return <br key={index} />;
  //           },
  //         })
  //       ),
  //     [workspace, data.content]
  //   );

  return (
    <div>
      <div className="chat-img">
        <Image src={`https:${gravatar.url(user.email, { s: '36px', d: 'retro' })}`} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        {/* <p>{result}</p> */}
      </div>
    </div>
  );
};

export default memo(Chat);
