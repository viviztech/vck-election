"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

// Admin nav — focuses on uploading and managing
const adminNavItems = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/upload", label: "Upload Form", icon: "📤" },
  { href: "/admin/entries", label: "All Entries", icon: "📁" },
  { href: "/constituencies", label: "Constituencies", icon: "🗺️" },
  { href: "/report", label: "Report (PDF)", icon: "📄" },
  { href: "/export", label: "Export Data", icon: "⬇️" },
  { href: "/admin/constituency-members", label: "Constituency Members", icon: "🏛️" },
  { href: "/admin/org/state", label: "State Postings", icon: "🏴" },
  { href: "/admin/org/zone", label: "Zone Postings", icon: "🗺️" },
  { href: "/admin/org/district", label: "District Postings", icon: "📍" },
  { href: "/admin/postings", label: "Posting Types", icon: "📌" },
  { href: "/admin/it-wing-volunteers", label: "IT Wing Volunteers", icon: "💻" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/roles", label: "Roles & Permissions", icon: "🛡️" },
  { href: "/admin/activity", label: "Activity Log", icon: "🕐" },
  { href: "/admin/dashboard", label: "System Stats", icon: "🔧" },
];

// User nav — focuses on reviewing assigned entries
const userNavItems = [
  { href: "/dashboard", label: "My Dashboard", icon: "📊" },
  { href: "/entries", label: "Review Queue", icon: "📋" },
  { href: "/constituencies", label: "Constituencies", icon: "🗺️" },
  { href: "/report", label: "Report (PDF)", icon: "📄" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const isAdmin = session?.user.role === "ADMIN" || session?.user.role === "SUPER_ADMIN";
  const navItems = isAdmin ? adminNavItems : userNavItems;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-slate-700 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-white">
            <img src="/logo.png" alt="VCK" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight tamil-text">விடுதலைச் சிறுத்தைகள் கட்சி</p>
            <p className="text-slate-400 text-xs mt-0.5">
              {isAdmin ? "Admin Portal" : "Review Portal"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="md:hidden text-slate-300 hover:text-white"
          aria-label="Close navigation menu"
        >
          ×
        </button>
      </div>

      <div className="px-5 pt-4 pb-1">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          isAdmin ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"
        }`}>
          {isAdmin ? "ADMIN" : "REVIEWER"}
        </span>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.href)
                ? "bg-white text-slate-900"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 pb-4 pt-3 border-t border-slate-700 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm font-semibold shrink-0">
            {session?.user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{session?.user.name ?? "User"}</p>
            <p className="text-slate-400 text-xs truncate">{session?.user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          Sign out →
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg ring-1 ring-white/15"
        aria-label="Open navigation menu"
      >
        <span className="text-lg">☰</span>
      </button>

      <div className={`fixed inset-0 z-40 md:hidden ${open ? "block" : "hidden"}`}>
        <div onClick={() => setOpen(false)} className="absolute inset-0 bg-slate-900/70" />
        <aside className="relative z-50 h-full w-72 max-w-full overflow-y-auto bg-slate-900 text-white shadow-xl">
          {sidebarContent}
        </aside>
      </div>

      <aside className="hidden md:flex w-60 bg-slate-900 text-white flex-col min-h-screen shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
}
