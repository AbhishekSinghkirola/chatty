import { useEffect } from "react";
import useChatStore from "../store/useChatStore";

export default function useAvailableUsers() {
  const { getAvailableUsers } = useChatStore();

  useEffect(() => {
    getAvailableUsers();
  }, [getAvailableUsers]);
}
