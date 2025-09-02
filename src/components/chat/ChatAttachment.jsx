import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownToLine, File } from "lucide-react";
import { formatFileSize, getFileExtension } from "../../utils/file";

const ChatAttachment = ({ attachment, className, onClick }) => {
  return (
    <Card
      className={`min-w-[250px] w-fit shrink-0 whitespace-nowrap px-4 py-2 rounded-sm ${className}`}
    >
      <CardContent className="p-0 flex justify-between items-center">
        <div className="flex items-center gap-3 pr-4 w-full">
          <File />
          <div className="flex flex-col w-full">
            <p className="truncate">
              {attachment?.localPath?.split("/").pop() || "file"}
            </p>
            <small className="dark:text-gray-300 truncate">
              {getFileExtension(attachment?.localPath?.split("/").pop() ?? "")}
            </small>
            <small className="dark:text-gray-300">
              {formatFileSize(attachment?.size ?? 0)}
            </small>
          </div>
        </div>
        <ArrowDownToLine className="cursor-pointer" onClick={onClick} />
      </CardContent>
    </Card>
  );
};

export default ChatAttachment;
