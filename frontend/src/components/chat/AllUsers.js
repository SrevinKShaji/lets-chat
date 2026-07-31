import { useState, useEffect } from "react";

import { createChatRoom } from "../../services/ChatService";
import Contact from "./Contact";
import UserLayout from "../layouts/UserLayout";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AllUsers({
  users,
  chatRooms,
  setChatRooms,
  onlineUsersId,
  currentUser,
  changeChat,
}) {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [nonContacts, setNonContacts] = useState([]);
  const [contactIds, setContactIds] = useState([]);

  useEffect(() => {
    const Ids = (chatRooms || [])
      .map((chatRoom) => {
        return chatRoom.members?.find((member) => member !== currentUser?.uid);
      })
      .filter(Boolean);
    setContactIds(Ids);
  }, [chatRooms, currentUser?.uid]);

  useEffect(() => {
    setNonContacts(
      (users || []).filter(
        (f) => f.uid !== currentUser?.uid && !contactIds.includes(f.uid)
      )
    );
  }, [contactIds, users, currentUser?.uid]);

  const changeCurrentChat = (chatRoom) => {
    setSelectedChatId(chatRoom._id);
    changeChat(chatRoom);
  };

  const handleNewChatRoom = async (user) => {
    const members = {
      senderId: currentUser.uid,
      receiverId: user.uid,
    };
    const res = await createChatRoom(members);
    if (res) {
      setChatRooms((prev) => {
        const exists = prev.some((r) => r._id === res._id);
        return exists ? prev : [...prev, res];
      });
      setSelectedChatId(res._id);
      changeChat(res);
    }
  };

  return (
    <div className="overflow-y-auto h-[30rem] divide-y divide-gray-100 dark:divide-gray-800">
      <div>
        <h2 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
          Chats ({chatRooms?.length || 0})
        </h2>
        {chatRooms && chatRooms.length > 0 ? (
          chatRooms.map((chatRoom) => (
            <div
              key={chatRoom._id || Math.random()}
              className={classNames(
                chatRoom._id === selectedChatId
                  ? "bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-600"
                  : "transition duration-150 ease-in-out cursor-pointer bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800",
                "flex items-center px-3 py-3 text-sm border-b border-gray-100 dark:border-gray-800"
              )}
              onClick={() => changeCurrentChat(chatRoom)}
            >
              <Contact
                chatRoom={chatRoom}
                onlineUsersId={onlineUsersId}
                currentUser={currentUser}
              />
            </div>
          ))
        ) : (
          <p className="px-3 py-2 text-sm text-gray-400 italic">No recent chats</p>
        )}
      </div>

      <div>
        <h2 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
          All Users ({nonContacts?.length || 0})
        </h2>
        {nonContacts && nonContacts.length > 0 ? (
          nonContacts.map((nonContact) => (
            <div
              key={nonContact.uid}
              className="flex items-center px-3 py-3 text-sm bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 cursor-pointer"
              onClick={() => handleNewChatRoom(nonContact)}
            >
              <UserLayout user={nonContact} onlineUsersId={onlineUsersId} />
            </div>
          ))
        ) : (
          <p className="px-3 py-2 text-sm text-gray-400 italic">No other users</p>
        )}
      </div>
    </div>
  );
}

