import { useEffect } from "react";
import useChatStore from "../store/useChatStore";
import useSocketStore from "../store/useSocketStore";
import { MESSAGE_RECEIVED_EVENT } from "../utils/constants";

export default function useSocketEvents() {
  const { socket } = useSocketStore();
  const { appendMessage } = useChatStore();

  useEffect(() => {
    const handleMessageReceived = (message) => {
      appendMessage(message);
    };

    socket.on(MESSAGE_RECEIVED_EVENT, handleMessageReceived);

    return () => {
      socket.off(MESSAGE_RECEIVED_EVENT, handleMessageReceived);
    };
  }, [socket, appendMessage]);
}
