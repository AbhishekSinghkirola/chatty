import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useChatStore from "../../store/useChatStore";
import { ucFirst } from "../../utils/string";
import TypingIndicator from "./TypingIndicator";
import { Button } from "@/components/ui/button";

const ChatHeader = ({ isTyping }) => {
  const { activeUser, deleteOneOnOneChat } = useChatStore();

  const handleDeleteOneOnOneChat = async () => {
    await deleteOneOnOneChat();
  };

  return (
    <div className="pb-2 flex items-center gap-4 border-b mb-4">
      <div className="relative">
        <Avatar className="size-12">
          <AvatarImage src="/images/user.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col">
        <span className="text-xl font-medium">
          {ucFirst(activeUser?.username ?? "Unknown")}
        </span>

        <TypingIndicator isTyping={isTyping} />
      </div>

      <Button
        className="text-end w-fit ml-auto"
        onClick={handleDeleteOneOnOneChat}
      >
        Clear Chat
      </Button>
    </div>
  );
};

export default ChatHeader;
