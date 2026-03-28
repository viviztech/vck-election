"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Registration failed");
      setLoading(false);
      return;
    }

    // Auto sign-in after registration
    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard");
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 tamil-text">புதிய கணக்கு உருவாக்கவும்</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 tamil-text">முழு பெயர்</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="உங்கள் பெயர்"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 tamil-text">மின்னஞ்சல்</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 tamil-text">கடவுச்சொல்</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="குறைந்தது 8 எழுத்துக்கள்"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "கணக்கு உருவாக்கப்படுகிறது..." : "கணக்கு உருவாக்கவும்"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        <span className="tamil-text">ஏற்கனவே கணக்கு உள்ளதா?{" "}
        <Link href="/login" className="text-blue-700 font-medium hover:underline">
          உள்நுழைக
        </Link></span>
      </p>
    </div>
  );
}
