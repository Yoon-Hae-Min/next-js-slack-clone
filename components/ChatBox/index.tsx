import { IUser } from '@typings/db';
import React, { FC, KeyboardEvent, useCallback, useEffect, useRef, VFC } from 'react';
import useSWR from 'swr';
import gravatar from 'gravatar';
import { fetcher } from '@utils/fetcher';
import { useRouter } from 'next/router';
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';
import autosize from 'autosize';
import Image from 'next/image';
import { API_PATH } from 'constants/api';

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
  const { data: userData } = useSWR<IUser | false>(API_PATH.USERS, fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR<IUser[]>(
    userData && workspace ? API_PATH.WORKSPACE.MEMBERS(workspace) : null,
    fetcher
  );

  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focus: boolean
    ): React.ReactNode => {
      if (!memberData) return;
      return (
        <button className={`${focus && ' bg-blue-300 text-white'}text-black-200 flex w-full items-center py-1 px-5`}>
          <Image
            src={`https:${gravatar.url(memberData[index].email, { s: '20px', d: 'retro' })}`}
            alt={memberData[index].nickname}
            width={20}
            height={20}
          />
          <span>{highlightedDisplay}</span>
        </button>
      );
    },
    [memberData]
  );

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
      <form className="text-md w-full rounded-sm border-black-200 text-black-200" onSubmit={onSubmitForm}>
        <MentionsInput
          className=" text-md w-full border p-2"
          id="editor-chat"
          value={chat}
          inputRef={textAreaRef}
          onKeyDown={onKeyDown}
          onChange={onChangeChat}
          placeholder={placeholder}
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={memberData?.map((v) => ({ display: v.nickname, id: v.id })) || []}
            renderSuggestion={renderSuggestion}
          ></Mention>
        </MentionsInput>

        <div className=" relative flex h-10 items-center rounded-l-sm rounded-r-sm border-t-2 border-white-150 bg-white-100">
          <button
            className="absolute right-1 top-1"
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
