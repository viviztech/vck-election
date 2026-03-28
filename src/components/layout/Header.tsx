"use client";

import { useSession } from "next-auth/react";

export function Header({ title }: { title?: string }) {
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "ADMIN" || session?.user.role === "SUPER_ADMIN";

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shrink-0">
      <h1 className="text-base font-semibold text-gray-900">{title ?? "விடுதலைச் சிறுத்தைகள் கட்சி"}</h1>
      <div className="flex items-center gap-3">
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
          isAdmin ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
        }`}>
          {isAdmin ? "Admin" : "Reviewer"}
        </span>
        <span className="text-sm text-gray-500 hidden sm:block">{session?.user.name}</span>
      </div>
    </header>
  );
}
