import { useEffect, useRef, useState } from "react";

import {
  getAllUsers,
  getChatRooms,
  initiateSocketConnection,
} from "../../services/ChatService";
import { useAuth } from "../../contexts/AuthContext";

import ChatRoom from "../chat/ChatRoom";
import Welcome from "../chat/Welcome";
import AllUsers from "../chat/AllUsers";
import SearchUsers from "../chat/SearchUsers";

export default function ChatLayout() {

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  const [currentChat, setCurrentChat] = useState();
  const [onlineUsersId, setOnlineUsersId] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const socket = useRef();
  const { currentUser } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const getSocket = async () => {
      if (!currentUser?.uid) return;
      try {
        const res = await initiateSocketConnection();
        if (!isMounted) return;
        socket.current = res;
        socket.current.emit("addUser", currentUser.uid);
        socket.current.on("getUsers", (usersList) => {
          if (!isMounted) return;
          const userIds = usersList.map((u) => (Array.isArray(u) ? u[0] : u));
          setOnlineUsersId(userIds);
        });
      } catch (err) {
        console.error("Socket connection error:", err);
      }
    };

    getSocket();

    return () => {
      isMounted = false;
      socket.current?.disconnect();
    };
  }, [currentUser?.uid]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!currentUser?.uid) return;
      const res = await getChatRooms(currentUser.uid);
      if (isMounted && res) {
        setChatRooms(res);
        setFilteredRooms(res);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [currentUser?.uid]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const res = await getAllUsers();
      if (isMounted && res) {
        setUsers(res);
        setFilteredUsers(res);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const handleSearch = (newSearchQuery) => {
    setSearchQuery(newSearchQuery);
    const query = newSearchQuery.trim().toLowerCase();

    if (!query) {
      setFilteredUsers(users);
      setFilteredRooms(chatRooms);
      return;
    }

    const searchedUsers = users.filter((user) => {
      const name = user.displayName || user.email || "";
      return name.toLowerCase().includes(query);
    });

    const searchedUsersId = searchedUsers.map((u) => u.uid);

    const matchingRooms = chatRooms.filter((chatRoom) =>
      chatRoom.members?.some(
        (member) => member !== currentUser.uid && searchedUsersId.includes(member)
      )
    );

    setFilteredRooms(matchingRooms);
    setFilteredUsers(searchedUsers);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="min-w-full bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-lg shadow-sm lg:grid lg:grid-cols-3">
        <div className="bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700 lg:col-span-1">
          <SearchUsers handleSearch={handleSearch} />

          <AllUsers
            users={searchQuery !== "" ? filteredUsers : users}
            chatRooms={searchQuery !== "" ? filteredRooms : chatRooms}
            setChatRooms={setChatRooms}
            onlineUsersId={onlineUsersId}
            currentUser={currentUser}
            changeChat={handleChatChange}
          />
        </div>

        {currentChat ? (
          <ChatRoom
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        ) : (
          <Welcome />
        )}
      </div>
    </div>
  );
}

