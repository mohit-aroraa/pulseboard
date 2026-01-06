type ChatDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  socket: any;
};

import { getSocket } from "../../lib/socket";

export function ChatDrawer({ isOpen, onClose, boardId, socket }: ChatDrawerProps) {
  // const socket = getSocket();

  return (
    <div
      className={[
        "fixed top-0 z-50 h-screen w-[360px] bg-white border-l border-zinc-200",
        "transition-all duration-200 ease-out",
        isOpen ? "right-0" : "-right-[360px]",
      ].join(" ")}
      aria-hidden={!isOpen}
    >
      <div className="h-14 border-b border-zinc-200 px-3 flex items-center justify-between">
        <strong>Board Chat</strong>
        <button
          onClick={onClose}
          className="text-lg leading-none hover:opacity-70"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <p className="text-sm text-zinc-500">Chat messages will go here.</p>
      </div>

      <div className="border-t border-zinc-200 p-3">
        <input
          placeholder="Type a message… (later: @mentions)"
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
          onFocus={() => socket.emit("typing:set", { boardId, isTyping: true })}
          onBlur={() => socket.emit("typing:set", { boardId, isTyping: false })}
          onChange={() =>
            socket.emit("typing:set", { boardId, isTyping: true })
          }
        />
      </div>
    </div>
  );
}
