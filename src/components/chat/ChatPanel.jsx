import { useState } from "react";

import useChatStore from "../../store/useChatStore";

import ChatHeader from "./ChatHeader";
import ChatList from "./ChatList";
import MessageArea from "./MessageArea";
import AttachmentsBox from "./AttachmentsBox";

import useTypingStatus from "../../hooks/useTypingStatus";
import useAttachments from "../../hooks/useAttachments";
import { useEscapeKey } from "../../hooks/useEscapeKey";

const ChatPanel = () => {
  const { sendMessage, selectedUser, activeUser, resetSelectedUser } =
    useChatStore();

  const [message, setMessage] = useState("");
  const { files, setFiles, handleAttachmentsChange } = useAttachments();
  const { isTyping, startTyping, stopTyping } = useTypingStatus(
    selectedUser?._id
  );

  useEscapeKey(resetSelectedUser);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("attachments", file));
    formData.append("content", message);

    await sendMessage(formData);

    setMessage("");
    setFiles([]);
    stopTyping();
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    startTyping();
  };

  return (
    <section
      className={`w-[75%] h-full flex flex-col min-h-0 pl-4 ${
        activeUser ? "block" : "hidden"
      }`}
    >
      <ChatHeader isTyping={isTyping} />

      <ChatList />

      <AttachmentsBox files={files} setFiles={setFiles} />

      <MessageArea
        message={message}
        handleAttachmentsChange={handleAttachmentsChange}
        handleMessageChange={handleMessageChange}
        handleSendMessage={handleSendMessage}
      />
    </section>
  );
};

export default ChatPanel;
