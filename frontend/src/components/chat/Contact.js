import { useState, useEffect } from "react";

import { getUser } from "../../services/ChatService";
import UserLayout from "../layouts/UserLayout";

export default function Contact({ chatRoom, onlineUsersId, currentUser }) {
  const [contact, setContact] = useState();

  useEffect(() => {
    let isMounted = true;
    const contactId = chatRoom?.members?.find(
      (member) => member !== currentUser?.uid
    );

    const fetchData = async () => {
      if (contactId) {
        const res = await getUser(contactId);
        if (isMounted) {
          setContact(res);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [chatRoom, currentUser]);

  return <UserLayout user={contact} onlineUsersId={onlineUsersId} />;
}

