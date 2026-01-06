import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export function RegisterPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      const res = await api<{ token: string; user: any }>("/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      localStorage.setItem("token", res.token);
      nav("/", { replace: true });
    } catch (e: any) {
      setErr(e.message ?? "Registration failed");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-zinc-50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Create account</h1>

        <form onSubmit={onSubmit} className="mt-5 grid gap-3">
          <input className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
            placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
            placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
            placeholder="Password (min 6 chars)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button className="mt-1 rounded-xl bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800">
            Register
          </button>

          {err && <p className="text-sm text-red-600">{err}</p>}
        </form>

        <p className="mt-4 text-sm text-zinc-600">
          Already have an account? <Link className="underline" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
