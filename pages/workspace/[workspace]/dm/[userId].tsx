import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import { IDM } from 'typings/db';
import axios from 'axios';
import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import useSWR, { mutate } from 'swr';
import useSWRInfinite from 'swr/infinite';
import gravatar from 'gravatar';
import { useRouter } from 'next/router';
import { fetcher } from '@utils/fetcher';
import Workspace from '@layouts/Workspace';
import makeSection from '@utils/makeSection';
import Image from 'next/image';
import useSocket from '@hooks/useSocket';
import Scrollbars from 'react-custom-scrollbars';
import api from '@apis/axios';
import { API_PATH } from 'constants/api';
import withAuth from '@hooks/HOC/withAuth';

const DirectMessage = () => {
  const router = useRouter();
  const { workspace, userId } = router.query;

  const { data: userData } = useSWR(workspace && userId ? API_PATH.WORKSPACE.USERS(workspace, userId) : null, fetcher);
  const { data: myData } = useSWR(API_PATH.USERS, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index: number) => `/api/workspaces/${workspace}/dms/${userId}/chats?perPage=20&page=${index + 1}`,
    fetcher
  );

  const [socket] = useSocket();

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const [dragOver, setDragOver] = useState(false);
  const scrollbarRef = useRef<Scrollbars>(null);

  const onSubmitForm = useCallback(
    (e: any) => {
      e.preventDefault();
      if (chat?.trim() && chatData !== undefined) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          scrollbarRef.current?.scrollToBottom();
        });
        api
          .post(
            `/api/workspaces/${workspace}/dms/${userId}/chats`,
            {
              content: chat,
            },
            { withCredentials: true }
          )
          .then((data) => {
            mutateChat();
          })
          .catch(console.error);
      }
    },
    [chat, chatData, mutateChat, workspace, userId, myData, userData, setChat]
  );

  const onMessage = useCallback((data: IDM) => {
    // id는 상대방 아이디
    if (data.SenderId === Number(userId) && myData.id !== Number(userId)) {
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

  if (!userData || !myData) {
    return <Workspace />;
  }

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <Workspace>
      <div className="relative flex h-[calc(100vh-38px)] flex-col flex-wrap">
        <header className=" flex h-16 w-full items-center p-5 font-bold shadow-[0_1px_0_rgba(29,28,29,0.13)]">
          <Image
            className="mr-2"
            src={`https:${gravatar.url(userData.email, { s: '24px', d: 'retro' })}`}
            alt={userData.nickname}
            width={24}
            height={24}
          />
          <span>{userData.nickname}</span>
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

export default withAuth(DirectMessage);
