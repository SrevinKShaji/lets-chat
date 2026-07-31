import { useState, useEffect, useRef } from "react";

import { getMessagesOfChatRoom, sendMessage } from "../../services/ChatService";

import Message from "./Message";
import Contact from "./Contact";
import ChatForm from "./ChatForm";

export default function ChatRoom({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);

  const scrollRef = useRef();

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!currentChat?._id) return;
      const res = await getMessagesOfChatRoom(currentChat._id);
      if (isMounted && res) {
        setMessages(res);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [currentChat?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const currentSocket = socket.current;
    const handleGetMessage = (data) => {
      if (data.chatRoomId && data.chatRoomId !== currentChat?._id) return;
      setIncomingMessage({
        sender: data.senderId,
        message: data.message,
        createdAt: new Date().toISOString(),
      });
    };

    currentSocket?.on("getMessage", handleGetMessage);
    return () => {
      currentSocket?.off("getMessage", handleGetMessage);
    };
  }, [socket, currentChat?._id]);

  useEffect(() => {
    if (incomingMessage) {
      setMessages((prev) => [...prev, incomingMessage]);
    }
  }, [incomingMessage]);

  const handleFormSubmit = async (messageText) => {
    if (!messageText.trim()) return;

    const receiverId = currentChat.members?.find(
      (member) => member !== currentUser.uid
    );

    socket.current?.emit("sendMessage", {
      senderId: currentUser.uid,
      receiverId: receiverId,
      message: messageText,
      chatRoomId: currentChat._id,
    });

    const messageBody = {
      chatRoomId: currentChat._id,
      sender: currentUser.uid,
      message: messageText,
      createdAt: new Date().toISOString(),
    };

    const res = await sendMessage({
      chatRoomId: currentChat._id,
      sender: currentUser.uid,
      message: messageText,
    });

    setMessages((prev) => [...prev, res || messageBody]);
  };

  return (
    <div className="lg:col-span-2 lg:block">
      <div className="w-full flex flex-col h-full">
        <div className="p-3 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <Contact chatRoom={currentChat} currentUser={currentUser} />
        </div>

        <div className="relative w-full p-6 overflow-y-auto h-[30rem] bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <ul className="space-y-2">
            {messages.map((msg, index) => (
              <div key={index} ref={scrollRef}>
                <Message message={msg} self={currentUser.uid} />
              </div>
            ))}
          </ul>
        </div>

        <ChatForm handleFormSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}

