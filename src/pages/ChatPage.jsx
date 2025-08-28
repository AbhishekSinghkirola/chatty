import UserList from "@/components/UserList";

import { useEffect, useState } from "react";
import useChatStore from "../store/useChatStore";
import ChatPanel from "../components/ChatPanel";
import { toast } from "sonner";
import useSocketStore from "../store/useSocketStore";
import { JOIN_CHAT_EVENT, MESSAGE_RECEIVED_EVENT } from "../utils/constants";

const ChatPage = () => {
  const {
    loading,
    getAvailableUsers,
    availableUsers,
    initiateOneOnOneChat,
    selectedUser,
    getAllMessages,
  } = useChatStore();

  const { socket, selectedUserChats } = useSocketStore();

  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    getAvailableUsers();
  }, [getAvailableUsers]);

  useEffect(() => {
    getAllMessages();
  }, [getAllMessages, selectedUser]);

  useEffect(() => {
    const handleMessageReceived = (message) => {
      useChatStore.setState((prev) => ({
        ...prev,
        selectedUserChats: [...prev.selectedUserChats, message],
      }));
    };

    socket.on(MESSAGE_RECEIVED_EVENT, handleMessageReceived);

    return () => {
      socket.off(MESSAGE_RECEIVED_EVENT, handleMessageReceived);
    };
  }, [socket]);

  const handleOneOnOneChat = async (receiver) => {
    await initiateOneOnOneChat(receiver?._id);

    setActiveUser(receiver);

    const { success, error, selectedUser } = useChatStore.getState();

    socket.emit(JOIN_CHAT_EVENT, selectedUser?._id);

    if (success) {
      toast.success(success);
    }

    if (error) {
      toast.error(error);
    }
  };

  return (
    <section className="w-full h-full flex items-center">
      <div className="w-full h-[90%] flex glass p-4 min-h-0">
        {/* Users List */}
        <section className="w-[25%] h-full flex flex-col min-h-0">
          <div className="flex-1 overflow-y-scroll scrollbar-custom">
            <ul className="flex flex-col gap-4 pr-4">
              {availableUsers?.map((user, i) => (
                <UserList
                  key={i}
                  user={user}
                  handleOneOnOneChat={handleOneOnOneChat}
                />
              ))}
            </ul>
          </div>
        </section>

        {/* Chat Panel */}
        <ChatPanel activeUser={activeUser} />
      </div>
    </section>
  );
};

export default ChatPage;
