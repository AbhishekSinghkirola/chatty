import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowDownToLine,
  File,
  Paperclip,
  SendHorizonal,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useChatStore from "../store/useChatStore";
import { STOP_TYPING_EVENT, TYPING_EVENT } from "../utils/constants";
import useSockeStore from "../store/useSocketStore";
import { ucFirst } from "../utils/string";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MarkdownRenderer from "./MarkdownRenderer";
import { Card, CardContent } from "@/components/ui/card";
import { formatFileSize, getFileExtension } from "../utils/file";
import { toast } from "sonner";
import useAuthStore from "../store/useAuthStore";

const ChatPanel = ({ activeUser }) => {
  const [message, setMessage] = useState("");
  const { user } = useAuthStore();
  const { sendMessage, selectedUserChats, selectedUser } = useChatStore();
  const { socket } = useSockeStore();

  const [selfTyping, setSelfTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [files, setFiles] = useState([]);

  const messageRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedUserChats]);

  useEffect(() => {
    const handleOnTyping = (chatId) => {
      if (chatId !== selectedUser?._id) return;

      setIsTyping(true);
    };

    const handleOnStopTyping = (chatId) => {
      if (chatId !== selectedUser?._id) return;

      setIsTyping(false);
    };

    socket.on(TYPING_EVENT, handleOnTyping);

    socket.on(STOP_TYPING_EVENT, handleOnStopTyping);

    return () => {
      socket.off(TYPING_EVENT, handleOnTyping);
      socket.off(STOP_TYPING_EVENT, handleOnStopTyping);
    };
  }, [socket, selectedUser]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const formdata = new FormData();
    if (files) {
      files.forEach((file) => {
        formdata.append("attachments", file);
      });
    }

    formdata.append("content", message);

    await sendMessage(formdata);

    setMessage("");

    if (selfTyping) {
      socket.emit(STOP_TYPING_EVENT, selectedUser?._id);

      setSelfTyping(false);
    }
  };

  const sortByDate = (a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);

    if (!selfTyping) {
      setSelfTyping(true);

      socket.emit(TYPING_EVENT, selectedUser?._id);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const timerLength = 3000;

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(STOP_TYPING_EVENT, selectedUser?._id);

      setSelfTyping(false);
    }, timerLength);
  };

  const handleAttachmentsChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (files.length + selectedFiles.length > 5) {
      toast.error("You can only upload upto 5 files at a time.");
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  const handleRemoveFile = (fileId) => {
    setFiles((prev) => prev.filter((_, index) => index !== fileId));
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <section
      className={`w-[75%] h-full flex flex-col min-h-0 pl-4 ${
        activeUser ? "block" : "hidden"
      }`}
    >
      <div className="pb-2 flex gap-4 border-b mb-4">
        <Avatar className="size-12">
          <AvatarImage src="/images/user.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-xl">{ucFirst(activeUser?.username)}</span>
          <span className={`text-sm ${!isTyping && "invisible"}`}>
            typing...
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-scroll scrollbar-custom">
        <ul className="pr-3">
          {selectedUserChats?.sort(sortByDate)?.map((chat, i) => (
            <li key={i}>
              {chat?.attachments?.length
                ? chat?.attachments.map((attachment, attachmentKey) => (
                    <Card
                      className={`min-w-[250px] w-fit shrink-0 whitespace-nowrap px-4 py-2 mt-3 rounded-sm ${
                        user?._id === chat?.sender?._id ? "ml-auto" : ""
                      }`}
                      key={attachmentKey}
                    >
                      <CardContent className="p-0 flex justify-between items-center">
                        <div className="flex items-center gap-3 pr-4 w-full">
                          <File />
                          <div className="flex flex-col w-full">
                            <p className="truncate">
                              {attachment?.localPath?.split("/").pop() ||
                                "file"}
                            </p>
                            <small className="dark:text-gray-300 truncate">
                              {getFileExtension(
                                attachment?.localPath?.split("/").pop() ?? ""
                              )}
                            </small>
                          </div>
                        </div>
                        <ArrowDownToLine
                          className="cursor-pointer"
                          onClick={() =>
                            handleDownload(
                              attachment?.url ?? "",
                              attachment?.localPath?.split("/").pop() ?? "file"
                            )
                          }
                        />
                      </CardContent>
                    </Card>
                  ))
                : ""}
              <div
                className={`${
                  user?._id === chat?.sender?._id
                    ? "bg-background text-foreground ml-auto"
                    : "bg-foreground text-background"
                } w-fit max-w-[300px] rounded-md  p-3 mt-3 whitespace-pre-line`}
              >
                <MarkdownRenderer
                  content={chat?.content || "No content available"}
                />
              </div>
            </li>
          ))}

          <div ref={messageRef} />
        </ul>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-custom pb-1">
        {files?.map((file, index) => {
          return (
            <Card
              className="min-w-[250px] w-auto shrink-0 whitespace-nowrap px-4 py-2 rounded-sm"
              key={index}
            >
              <CardContent className="p-0 flex justify-between items-center">
                <div className="flex items-center gap-3 pr-4">
                  <File />
                  <div className="flex flex-col">
                    <p>{file.name}</p>
                    <small className="dark:text-gray-300">
                      {getFileExtension(file?.name ?? "")}
                    </small>
                    <small className="dark:text-gray-300">
                      {formatFileSize(file?.size ?? 0)}
                    </small>
                  </div>
                </div>
                <X
                  className="cursor-pointer"
                  onClick={() => handleRemoveFile(index)}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="pt-4 flex gap-3 items-center">
        <Label htmlFor="send-attachments">
          <Paperclip className="cursor-pointer" />

          <Input
            id="send-attachments"
            className="hidden"
            type="file"
            multiple
            onChange={handleAttachmentsChange}
          />
        </Label>
        <Textarea
          className="focus:outline-none focus:ring-0 focus:shadow-none max-h-[100px] resize-none scrollbar-custom"
          placeholder="Type your message..."
          value={message}
          onChange={handleMessageChange}
          onKeyUp={(e) => {
            if (e?.key?.toLowerCase() === "enter" && !e.shiftKey) {
              handleSendMessage();
            }
          }}
        />
        <div
          className="flex justify-center items-center bg-black p-2 rounded-full cursor-pointer"
          onClick={handleSendMessage}
        >
          <SendHorizonal className="text-white" />
        </div>
      </div>
    </section>
  );
};

export default ChatPanel;
