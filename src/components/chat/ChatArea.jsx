import useAuthStore from "../../store/useAuthStore";
import useFileDownloader from "../../hooks/useFileDownloader";
import ChatAttachment from "./ChatAttachment";
import ChatItem from "./ChatItem";

const ChatArea = ({ chat }) => {
  const { user } = useAuthStore();
  const { downloadFile } = useFileDownloader();

  const isCurrentUser = user?._id === chat?.sender?._id;

  return (
    <div className="flex flex-col gap-2">
      {chat?.attachments?.map((attachment, i) => (
        <ChatAttachment
          key={i}
          className={isCurrentUser ? "ml-auto" : ""}
          attachment={attachment}
          onClick={() =>
            downloadFile(
              attachment?.url ?? "",
              attachment?.localPath?.split("/").pop() ?? "file"
            )
          }
        />
      ))}

      {chat?.content && (
        <ChatItem
          className={`${
            isCurrentUser
              ? "bg-background text-foreground ml-auto"
              : "bg-foreground text-background"
          }`}
          content={chat.content}
        />
      )}
    </div>
  );
};

export default ChatArea;
