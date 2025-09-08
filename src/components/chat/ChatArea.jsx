import useAuthStore from "../../store/useAuthStore";
import useFileDownloader from "../../hooks/useFileDownloader";
import ChatAttachment from "./ChatAttachment";
import ChatItem from "./ChatItem";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import clsx from "clsx";

const ChatArea = ({ chat, onDelete }) => {
  const { user } = useAuthStore();
  const { downloadFile } = useFileDownloader();

  const isCurrentUser = user?._id === chat?.sender?._id;

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex flex-col gap-2">
          {chat?.attachments?.map((attachment) => {
            const filename = attachment?.localPath?.split("/").pop() || "file";

            return (
              <ChatAttachment
                key={attachment?.url || filename}
                className={isCurrentUser ? "ml-auto" : ""}
                attachment={attachment}
                onClick={() => downloadFile(attachment?.url || "", filename)}
              />
            );
          })}

          {chat?.content && (
            <ChatItem
              className={clsx(
                isCurrentUser
                  ? "bg-background text-foreground ml-auto"
                  : "bg-foreground text-background"
              )}
              content={chat.content}
            />
          )}
        </div>
      </ContextMenuTrigger>
      {isCurrentUser && (
        <ContextMenuContent>
          <ContextMenuItem
            className="cursor-pointer"
            onClick={() => onDelete(chat?._id)}
          >
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
};

export default ChatArea;
