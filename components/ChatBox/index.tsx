import { IUser } from 'typings/db';
import React, { FC, KeyboardEvent, useCallback, useEffect, useRef, VFC } from 'react';
import useSWR from 'swr';
import gravatar from 'gravatar';
import { fetcher } from '@utils/fetcher';
import { useRouter } from 'next/router';
import autosize from 'autosize';

interface Props {
  chat?: string;
  onSubmitForm: (e: any) => void;
  onChangeChat?: (e: any) => void;
  placeholder?: string;
}
const ChatBox: FC<Props> = ({ chat, onSubmitForm, onChangeChat, placeholder }) => {
  const router = useRouter();
  const { workspace } = router.query;
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);

  //   const renderSuggestion = useCallback(
  //     (
  //       suggestion: SuggestionDataItem,
  //       search: string,
  //       highlightedDisplay: React.ReactNode,
  //       index: number,
  //       focus: boolean
  //     ): React.ReactNode => {
  //       if (!memberData) return;
  //       return (
  //         <EachMention focus={focus}>
  //           <img
  //             src={gravatar.url(memberData[index].email, { s: '20px', d: 'retro' })}
  //             alt={memberData[index].nickname}
  //           />
  //           <span>{highlightedDisplay}</span>
  //         </EachMention>
  //       );
  //     },
  //     [memberData]
  //   );

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmitForm(e);
    }
  };

  useEffect(() => {
    if (textAreaRef.current) {
      autosize(textAreaRef.current);
    }
  }, []);

  return (
    <div className="flex w-full p-5">
      <form
        className="text-[rgb(29, 28, 29)] text-md border-[rgb(29, 28, 29)] w-full rounded-sm"
        onSubmit={onSubmitForm}
      >
        <textarea
          className=" text-md w-full border p-2"
          id="editor-chat"
          value={chat}
          ref={textAreaRef}
          onKeyDown={onKeyDown}
          onChange={onChangeChat}
          placeholder={placeholder}
        ></textarea>
        <div className=" relative flex h-10 items-center rounded-l-sm rounded-r-sm border-t-2 border-[rgb(221,221,221)] bg-[rgb(248,248,248)]">
          <button
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send absolute right-1 top-1' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <svg data-tml="true" aria-hidden="true" viewBox="0 0 20 20" width="1rem" height="1rem">
              <path
                fill="currentColor"
                d="M1.5 2.25a.755.755 0 0 1 1-.71l15.596 7.807a.73.73 0 0 1 0 1.306L2.5 18.46l-.076.018a.749.749 0 0 1-.924-.728v-4.54c0-1.21.97-2.229 2.21-2.25l6.54-.17c.27-.01.75-.24.75-.79s-.5-.79-.75-.79l-6.54-.17A2.253 2.253 0 0 1 1.5 6.789v-4.54Z"
              ></path>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
