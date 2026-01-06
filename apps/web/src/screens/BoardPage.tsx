import { useParams } from "react-router-dom";
import { TopBar } from "../components/layout/TopBar";
import { ChatDrawer } from "../components/chat/ChatDrawer";
import { use, useEffect, useMemo, useState } from "react";
import { connectSocket, getSocket } from "../lib/socket"

export function BoardPage() {
  const { boardId = "demo" } = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const socket = useMemo(() => getSocket(), []);
  const [typing, setTyping] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const s = connectSocket();
    s.emit("board:join", { boardId });
    const onTyping = (payload: any) => {
    setTyping((prev) => ({ ...prev, [payload.name || payload.userId]: payload.isTyping }));
  };

  s.on("typing:update", onTyping);

  return () => {
    s.off("typing:update", onTyping);
  };
  }, [boardId]);
  return (
    <div className="h-screen flex flex-col">
      <TopBar title={`Board: ${boardId}`} onToggleChat={() => setIsChatOpen((v) => !v)} />

      <div className="flex-1 overflow-auto bg-zinc-100 p-4">
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6">
          <p className="text-sm text-zinc-600">
            Kanban board will go here (columns horizontally scroll like Trello).
          </p>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {/* Placeholder columns */}
            {["To Do", "Doing", "Done"].map((col) => (
              <div key={col} className="min-w-[280px] rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                <div className="font-medium">{col}</div>
                <div className="mt-3 grid gap-2">
                  <div className="rounded-xl border border-zinc-200 bg-white p-3 text-sm">
                    Example card
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-white p-3 text-sm opacity-70">
                    Another card
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <pre className="mt-4 text-xs text-zinc-600">{JSON.stringify(typing, null, 2)}</pre>

      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} boardId={boardId} socket={socket} />

    </div>
  );
}
