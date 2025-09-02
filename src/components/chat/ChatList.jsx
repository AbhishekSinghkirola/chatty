import { useEffect, useRef, useMemo } from "react";
import useChatStore from "../../store/useChatStore";
import ChatArea from "./ChatArea";

const ChatList = () => {
  const { selectedUserChats } = useChatStore();

  const endOfMessagesRef = useRef(null);

  const sortedChats = useMemo(() => {
    if (!selectedUserChats) return [];
    return [...selectedUserChats].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }, [selectedUserChats]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedChats]);

  return (
    <div className="flex-1 overflow-y-scroll scrollbar-custom">
      <ul role="list" className="pr-3">
        {sortedChats.map((chat) => (
          <li key={chat.id || chat._id} role="listitem">
            <ChatArea chat={chat} />
          </li>
        ))}
        <div ref={endOfMessagesRef} />
      </ul>
    </div>
  );
};

export default ChatList;
