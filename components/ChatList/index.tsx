import Chat from '@components/Chat';
import { IDM, IChat } from '@typings/db';
import React, { useCallback, forwardRef, RefObject, MutableRefObject, FC, useRef, ForwardedRef, UIEvent } from 'react';
import { Scrollbars, positionValues } from 'react-custom-scrollbars';
interface Props {
  chatSections: { [key: string]: (IDM | IChat)[] };
  setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  isReachingEnd: boolean;
}

// eslint-disable-next-line react/display-name
const ChatList = ({ chatSections, setSize, isReachingEnd }: Props, ref: ForwardedRef<Scrollbars>) => {
  const onScroll = useCallback((values: positionValues) => {
    if (values.scrollTop === 0 && !isReachingEnd && ref !== null && typeof ref !== 'function') {
      setSize((size) => size + 1).then(() => {
        ref.current?.scrollTop(ref.current?.getScrollHeight() - values.scrollHeight);
      });
    }
  }, []);

  return (
    <div className=" flex w-full flex-1">
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <div className={`section-${date} mt-5 border-t border-[#eeee]`} key={date}>
              <div className="width-full sticky top-3 flex flex-1 justify-center">
                <button className="relative -top-3 z-10 h-7 rounded-3xl bg-white px-4 text-sm font-bold shadow-[0_0_0_1px_rgba(29,28,29,0.13),0_1px_3px_0_rgba(0,0,0,0.08)] outline-none">
                  {date}
                </button>
              </div>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </div>
          );
        })}
      </Scrollbars>
    </div>
  );
};

export default forwardRef<Scrollbars, Props>(ChatList);
