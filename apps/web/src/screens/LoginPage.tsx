import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../lib/api";

export function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  
   async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      const res = await api<{ token: string; user: any }>("/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", res.token);
      nav("/", { replace: true });
    } catch (e: any) {
      setErr(e.message ?? "Login failed");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-zinc-50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-zinc-400">Temporary login: any values work</p>

        <form onSubmit={onSubmit} className="mt-5 grid gap-3">
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-zinc-300"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-zinc-300"
            placeholder="Password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="mt-1 rounded-xl bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800">
            Login
          </button>
          {err && <p className="text-sm text-red-600">{err}</p>}
        </form>
         <p className="mt-4 text-sm text-zinc-600">
          New here? <Link className="underline" to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}
