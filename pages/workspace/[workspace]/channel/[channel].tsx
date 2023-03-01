import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import { IChannel, IChat, IDM } from '@typings/db';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { fetcher } from '@utils/fetcher';
import Workspace from '@layouts/Workspace';
import makeSection from '@utils/makeSection';
import useSocket from '@hooks/useSocket';
import Scrollbars from 'react-custom-scrollbars';
import { API_PATH } from 'constants/api';
import useChatInfinite from '@hooks/Querys/useChatInfinite';
import api, { postRequest } from '@apis/axios';
import useSWRMutation from 'swr/mutation';
import { GetServerSideProps } from 'next';

const Channel = () => {
  const router = useRouter();
  const { workspace, channel } = router.query;

  const { data: myData } = useSWR(API_PATH.USERS, fetcher);
  const { data: channelData } = useSWR<IChannel>(
    workspace && channel ? API_PATH.WORKSPACE.CHANNEL.ID(workspace, channel) : null,
    fetcher
  );
  const [{ data: chatData, mutate: mutateChat, setSize }, isEmpty, isReachingEnd] = useChatInfinite<IChat>(
    (index: number) => workspace && channel && API_PATH.WORKSPACE.CHANNEL.PAGES(workspace, channel, index)
  );
  const { trigger } = useSWRMutation(API_PATH.WORKSPACE.CHANNEL.CHATS(workspace, channel), postRequest);

  const [socket] = useSocket();
  const [chat, onChangeChat, setChat] = useInput('');
  const [dragOver, setDragOver] = useState(false);

  const scrollbarRef = useRef<Scrollbars>(null);

  const onSubmitForm = useCallback(
    (e: any) => {
      e.preventDefault();
      if (chat?.trim() && chatData !== undefined && channelData !== undefined) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            UserId: myData.id,
            User: myData,
            ChannelId: channelData.id,
            Channel: channelData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          scrollbarRef.current?.scrollToBottom();
        });
        localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
        trigger({ content: chat })
          .then(() => mutateChat())
          .catch(console.error);
      }
    },
    [chat, chatData, mutateChat, workspace, channel, myData, channelData, setChat]
  );

  const onMessage = useCallback((data: IChat) => {
    // id는 상대방 아이디
    if (data.Channel.name === channel && (data.content.startsWith('uploads\\') || data.UserId !== myData?.id)) {
      mutateChat((chatData) => {
        chatData?.[0].unshift(data);
        return chatData;
      }, false).then(() => {
        if (scrollbarRef.current) {
          if (
            scrollbarRef.current.getScrollHeight() <
            scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
          ) {
            console.log('scrollToBottom!', scrollbarRef.current?.getValues());
            setTimeout(() => {
              scrollbarRef.current?.scrollToBottom();
            }, 50);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [socket, onMessage]);

  useEffect(() => {
    if (chatData?.length === 1) {
      setTimeout(() => {
        scrollbarRef.current?.scrollToBottom();
      }, 100);
    }
  }, [chatData]);

  const onDrop = useCallback(
    (e: any) => {
      e.preventDefault();
      console.log(e);
      // const formData = new FormData();
      // if (e.dataTransfer.items) {
      //   // Use DataTransferItemList interface to access the file(s)
      //   for (let i = 0; i < e.dataTransfer.items.length; i++) {
      //     // If dropped items aren't files, reject them
      //     if (e.dataTransfer.items[i].kind === 'file') {
      //       const file = e.dataTransfer.items[i].getAsFile();
      //       console.log('... file[' + i + '].name = ' + file.name);
      //       formData.append('image', file);
      //     }
      //   }
      // } else {
      //   // Use DataTransfer interface to access the file(s)
      //   for (let i = 0; i < e.dataTransfer.files.length; i++) {
      //     console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
      //     formData.append('image', e.dataTransfer.files[i]);
      //   }
      // }
      // axios.post(`/api/workspaces/${workspace}/dms/${id}/images`, formData).then(() => {
      //   setDragOver(false);
      //   revalidate();
      // });
    },
    [workspace]
  );

  const onDragOver = useCallback((e: any) => {
    e.preventDefault();
    console.log(e);
    // setDragOver(true);
  }, []);
  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  useEffect(() => {
    localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
  }, [workspace, channel]);

  if (!channelData || !myData) {
    return <Workspace />;
  }

  return (
    <Workspace>
      <div className="relative flex h-[calc(100vh-38px)] flex-col flex-wrap">
        <header className=" flex h-16 w-full items-center p-5 font-bold shadow-sm">
          <span>{channelData.name}</span>
        </header>
        <ChatList chatSections={chatSections} setSize={setSize} ref={scrollbarRef} isReachingEnd={isReachingEnd} />
        <ChatBox onSubmitForm={onSubmitForm} chat={chat} onChangeChat={onChangeChat} />
        {/* {dragOver && (
        <div className="absolute top-16 left-0 flex h-[calc(100%-64px)] w-full items-center justify-center bg-white text-4xl opacity-70">
          업로드!
        </div>
      )} */}
      </div>
    </Workspace>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
  const { data } = await api.get(API_PATH.USERS, { headers: req.headers });
  if (!data) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default Channel;
