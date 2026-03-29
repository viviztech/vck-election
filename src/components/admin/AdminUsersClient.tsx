"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  createdAt: string;
  _count: { formEntries: number };
}

interface Props {
  users: User[];
  total: number;
  page: number;
  limit: number;
  canChangeRoles: boolean;
}

export function AdminUsersClient({ users, total, page, limit, canChangeRoles }: Props) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  async function changeRole(userId: string, newRole: string) {
    setUpdating(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) router.refresh();
      else alert("Failed to update role");
    } finally {
      setUpdating(null);
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Users ({total})</h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Entries</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Joined</th>
                {canChangeRoles && (
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 wrap-break-word">
                    {user.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 wrap-break-word">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        user.role === "SUPER_ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "ADMIN"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user._count.formEntries}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  {canChangeRoles && (
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => changeRole(user.id, e.target.value)}
                        disabled={updating === user.id}
                        className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none disabled:opacity-50"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/admin/users?page=${p}`}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                p === page
                  ? "bg-blue-900 text-white"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
