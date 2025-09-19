import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useChatStore from "../../store/useChatStore";
import { ucFirst } from "../../utils/string";
import TypingIndicator from "./TypingIndicator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ChatHeader = ({ isTyping }) => {
  const {
    activeUser,
    deleteOneOnOneChat,
    resetSelectedUser,
    initiateOneOnOneChat,
  } = useChatStore();

  const handleDeleteOneOnOneChat = async () => {
    await deleteOneOnOneChat();

    await initiateOneOnOneChat(activeUser);
  };

  return (
    <div className="pb-2 flex items-center gap-4 border-b mb-4">
      <ArrowLeft className="block md:hidden" onClick={resetSelectedUser} />

      <div className="relative">
        <Avatar className="size-10 md:size-12">
          <AvatarImage src="/images/user.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col">
        <span className="text-lg md:text-xl font-medium">
          {ucFirst(activeUser?.username ?? "Unknown")}
        </span>

        <TypingIndicator isTyping={isTyping} />
      </div>

      <Button
        className="text-end w-fit ml-auto hidden md:block"
        onClick={handleDeleteOneOnOneChat}
      >
        Clear Chat
      </Button>

      <div className="ml-auto block md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleDeleteOneOnOneChat}>
              Clear Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
