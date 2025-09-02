import { useEffect } from "react";
import useChatStore from "../store/useChatStore";

export default function useChatMessages() {
  const { getAllMessages, selectedUser } = useChatStore();

  useEffect(() => {
    if (selectedUser) {
      getAllMessages();
    }
  }, [getAllMessages, selectedUser]);
}
