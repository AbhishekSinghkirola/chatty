import { toast } from "sonner";
import useChatStore from "../store/useChatStore";
import useSocketStore from "../store/useSocketStore";
import { JOIN_CHAT_EVENT } from "../utils/constants";

export default function useChatActions() {
  const { initiateOneOnOneChat, selectedUser } = useChatStore();
  const { socket } = useSocketStore();

  const startOneOnOneChat = async (receiver) => {
    const { success, error } = await initiateOneOnOneChat(receiver);

    if (selectedUser?._id) {
      socket.emit(JOIN_CHAT_EVENT, selectedUser._id);
    }

    if (success) {
      toast.success(success);
    }

    if (error) {
      toast.error(error);
    }
  };

  return { startOneOnOneChat };
}
