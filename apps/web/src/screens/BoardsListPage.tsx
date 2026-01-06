import { Link } from "react-router-dom";

export function BoardsListPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Boards</h1>
      <p className="mt-1 text-sm text-zinc-600">Simple MVP board list.</p>

      <ul className="mt-4 grid gap-2">
        <li>
          <Link
            className="inline-flex rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
            to="/boards/demo"
          >
            Open Demo Board
          </Link>
        </li>
      </ul>
    </div>
  );
}
