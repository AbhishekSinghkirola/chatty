import { io } from "socket.io-client";
import { create } from "zustand";
import { CONNECTED_EVENT, DISCONNECT_EVENT } from "../utils/constants";

const useSockeStore = create((set, get) => ({
  socket: null,
  isConnected: false,

  initSocket: () => {
    const { socket: existingSocket, onConnect, onDisconnect } = get();
    if (existingSocket) return;

    const socket = io(import.meta.env.VITE_SOCKET_URI, {
      // withCredentials: true,
      auth: { token: localStorage.getItem("accessToken") },
    });

    socket.on(CONNECTED_EVENT, onConnect);

    socket.on(DISCONNECT_EVENT, onDisconnect);

    set({ socket });
  },

  onConnect: () => {
    set({ isConnected: true });
  },

  onDisconnect: () => {
    set({ isConnected: false });
  },

  cleanupSocket: () => {
    const { socket, onConnect, onDisconnect } = get();

    if (!socket) return;

    socket.off(CONNECTED_EVENT, onConnect);

    socket.off(DISCONNECT_EVENT, onDisconnect);

    socket.disconnect();

    set({ socket: null, isConnected: false });
  },
}));

export default useSockeStore;
