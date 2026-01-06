import { Outlet, Link, useNavigate } from "react-router-dom";

export function AppShell() {
  const nav = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    nav("/login", { replace: true });
  }

  return (
    <div className="grid min-h-screen grid-cols-[260px_1fr]">
      <aside className="border-r border-zinc-200 bg-zinc-50 p-4">
        <h2 className="text-lg font-semibold">PulseBoard</h2>

        <nav className="mt-4 grid gap-2 text-sm">
          <Link className="rounded-lg px-2 py-1 hover:bg-zinc-100" to="/">
            Boards
          </Link>
          <Link className="rounded-lg px-2 py-1 hover:bg-zinc-100" to="/boards/demo">
            Demo Board
          </Link>
        </nav>

        <button
          onClick={logout}
          className="mt-5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-100"
        >
          Logout
        </button>
      </aside>

      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
