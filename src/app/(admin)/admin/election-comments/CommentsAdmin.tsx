"use client";

import { useState } from "react";

interface ElectionComment {
  id: string;
  authorName: string;
  body: string;
  isApproved: boolean;
  createdAt: string;
  electionResult: {
    constituency: { nameEnglish: string };
  };
}

export function CommentsAdmin({ comments: initial }: { comments: ElectionComment[] }) {
  const [comments, setComments] = useState<ElectionComment[]>(initial);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = comments.filter((c) => {
    if (filter === "pending")  return !c.isApproved;
    if (filter === "approved") return c.isApproved;
    return true;
  });

  const pendingCount  = comments.filter((c) => !c.isApproved).length;
  const approvedCount = comments.filter((c) =>  c.isApproved).length;

  async function approve(id: string) {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/election-comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });
      if (!res.ok) throw new Error();
      setComments((prev) => prev.map((c) => c.id === id ? { ...c, isApproved: true } : c));
    } finally {
      setLoading(null);
    }
  }

  async function reject(id: string) {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/election-comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: false }),
      });
      if (!res.ok) throw new Error();
      setComments((prev) => prev.map((c) => c.id === id ? { ...c, isApproved: false } : c));
    } finally {
      setLoading(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this comment permanently?")) return;
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/election-comments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setComments((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-50 rounded-xl p-4">
          <p className="text-2xl font-black text-amber-800">{pendingCount}</p>
          <p className="text-xs font-semibold text-amber-700 mt-0.5">Pending Review</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-2xl font-black text-green-800">{approvedCount}</p>
          <p className="text-xs font-semibold text-green-700 mt-0.5">Approved</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-2xl font-black text-slate-800">{comments.length}</p>
          <p className="text-xs font-semibold text-slate-600 mt-0.5">Total</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["pending", "approved", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-colors ${
              filter === f
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f}
            {f === "pending"  && pendingCount  > 0 && (
              <span className="ml-1.5 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Comment list */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-sm py-10 text-center">No {filter} comments.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className={`border-2 rounded-2xl p-4 ${
                c.isApproved
                  ? "border-green-200 bg-green-50"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-sm text-gray-900">{c.authorName}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {c.electionResult.constituency.nameEnglish}
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleString("en-IN", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      c.isApproved
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {c.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.body}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!c.isApproved && (
                    <button
                      onClick={() => approve(c.id)}
                      disabled={loading === c.id}
                      className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading === c.id ? "…" : "Approve"}
                    </button>
                  )}
                  {c.isApproved && (
                    <button
                      onClick={() => reject(c.id)}
                      disabled={loading === c.id}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                      {loading === c.id ? "…" : "Unapprove"}
                    </button>
                  )}
                  <button
                    onClick={() => remove(c.id)}
                    disabled={loading === c.id}
                    className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
