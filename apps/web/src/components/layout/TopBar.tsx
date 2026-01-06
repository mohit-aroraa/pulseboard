import { useState } from "react";

type TopBarProps = {
  title: string;
  onToggleChat: () => void;
};

export function TopBar({ title, onToggleChat }: TopBarProps) {
  const [q, setQ] = useState("");

  return (
    <div className="h-14 border-b border-zinc-200 bg-white px-4 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <strong className="truncate text-base">{title}</strong>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search (placeholder)"
          className="w-[320px] rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications placeholder */}
        <button
          title="Notifications"
          className="h-9 w-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100"
        >
          🔔
        </button>

        {/* Chat toggle */}
        <button
          onClick={onToggleChat}
          title="Chat"
          className="h-9 w-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100"
        >
          💬
        </button>

        {/* Profile placeholder */}
        <div className="ml-1 h-8 w-8 rounded-full bg-zinc-300" title="Profile" />
      </div>
    </div>
  );
}
