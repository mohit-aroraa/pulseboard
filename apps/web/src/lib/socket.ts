import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:8080";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;
  debugger
  socket = io(SOCKET_URL, {
    autoConnect: false,
    auth: {
      token: localStorage.getItem("token"),
    },
  });

  return socket;
}

export function connectSocket() {
  const s = getSocket();
  s.auth = { token: localStorage.getItem("token") };
  if (!s.connected) s.connect();
  return s;
}
