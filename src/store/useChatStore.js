import { create } from "zustand";

import { getAxiosErrorMessage } from "../utils/errorHandling";
import {
  getAllAvailableUsersService,
  getAllMessagesService,
  getLoggedInUserAssociatedChatService,
  initiateOneOnOneChatService,
  sendMessageService,
} from "../services/chatService";

const useChatStore = create((set, get) => ({
  loading: false,
  chatsLoading: false,
  error: null,
  success: null,
  availableUsers: null,
  loggedInChats: null,
  selectedUser: null,
  selectedUserChats: null,

  getAvailableUsers: async () => {
    const { loading } = get();

    if (loading) return;

    try {
      set({ loading: true, error: null, success: null });

      const response = await getAllAvailableUsersService();

      if (response.success) {
        set({
          error: null,
          loading: false,
          success: response?.message ?? "Success",
          availableUsers: response?.data ?? [],
        });
      }
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error);
      set({
        error: errorMessage ?? "Something went wrong!!",
        loading: false,
      });
    }
  },

  getLoggedInUserAssociatedChats: async () => {
    const { chatsLoading } = get();

    if (chatsLoading) return;

    try {
      set({ chatsLoading: true, error: null, success: null });

      const response = await getLoggedInUserAssociatedChatService();

      if (response.success) {
        set({
          error: null,
          chatsLoading: false,
          success: response?.message ?? "Success",
          loggedInChats: response?.data ?? [],
        });
      }
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error);
      set({
        error: errorMessage ?? "Something went wrong!!",
        chatsLoading: false,
      });
    }
  },

  initiateOneOnOneChat: async (receiverId) => {
    const { loading } = get();

    if (loading) return;

    try {
      set({ loading: true, error: null, success: null });

      const response = await initiateOneOnOneChatService(receiverId);

      if (response.success) {
        set({
          error: null,
          loading: false,
          success: response?.message ?? "Success",
          selectedUser: response?.data ?? [],
        });
      }
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error);
      set({
        error: errorMessage ?? "Something went wrong!!",
        loading: false,
      });
    }
  },

  getAllMessages: async () => {
    const { loading, selectedUser } = get();

    if (loading) return;

    try {
      set({ loading: true, error: null, success: null });

      const response = await getAllMessagesService(selectedUser?._id);

      if (response.success) {
        set({
          error: null,
          loading: false,
          success: response?.message ?? "Success",
          selectedUserChats: response?.data ?? [],
        });
      }
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error);
      set({
        error: errorMessage ?? "Something went wrong!!",
        loading: false,
      });
    }
  },

  sendMessage: async (payload) => {
    const { loading, selectedUser } = get();

    if (loading) return;

    try {
      set({ loading: true, error: null, success: null });

      const response = await sendMessageService(selectedUser?._id, payload);

      if (response.success) {
        set((state) => ({
          error: null,
          loading: false,
          success: response?.message ?? "Success",
          selectedUserChats: [...state.selectedUserChats, response?.data],
        }));
      }
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error);
      set({
        error: errorMessage ?? "Something went wrong!!",
        loading: false,
      });
    }
  },
}));

export default useChatStore;
