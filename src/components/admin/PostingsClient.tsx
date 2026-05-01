"use client";

import { useState } from "react";

type BodyType = "MAIN_BODY" | "SUB_BODY" | "LOCAL";

interface PostingType {
  id: string;
  nameTamil: string;
  nameEnglish: string;
  bodyType: BodyType;
  order: number;
  isActive: boolean;
  _count: { members: number };
}

const emptyForm = {
  nameTamil: "",
  nameEnglish: "",
  bodyType: "MAIN_BODY" as BodyType,
  order: 0,
};

export function PostingsClient({ initialPostingTypes }: { initialPostingTypes: PostingType[] }) {
  const [postingTypes, setPostingTypes] = useState<PostingType[]>(initialPostingTypes);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startEdit(p: PostingType) {
    setEditingId(p.id);
    setForm({ nameTamil: p.nameTamil, nameEnglish: p.nameEnglish, bodyType: p.bodyType, order: p.order });
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSave() {
    if (!form.nameTamil.trim() || !form.nameEnglish.trim()) {
      setError("Both Tamil and English names are required.");
      return;
    }
    setSaving(true);
    setError("");

    if (editingId) {
      const res = await fetch(`/api/admin/posting-types/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { setError("Failed to update."); setSaving(false); return; }
      const updated = await res.json();
      setPostingTypes((prev) => prev.map((p) => (p.id === editingId ? { ...updated, _count: p._count } : p)));
      cancelEdit();
    } else {
      const res = await fetch("/api/admin/posting-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { setError("Failed to create."); setSaving(false); return; }
      const created = await res.json();
      setPostingTypes((prev) => [...prev, { ...created, _count: { members: 0 } }]);
      setForm(emptyForm);
    }
    setSaving(false);
  }

  async function handleToggleActive(p: PostingType) {
    const res = await fetch(`/api/admin/posting-types/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, isActive: !p.isActive }),
    });
    if (res.ok) {
      setPostingTypes((prev) => prev.map((x) => x.id === p.id ? { ...x, isActive: !x.isActive } : x));
    }
  }

  async function handleDelete(p: PostingType) {
    if (!confirm(`Delete "${p.nameEnglish}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/posting-types/${p.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error ?? "Failed to delete.");
      return;
    }
    setPostingTypes((prev) => prev.filter((x) => x.id !== p.id));
  }

  const mainBody = postingTypes.filter((p) => p.bodyType === "MAIN_BODY");
  const subBody = postingTypes.filter((p) => p.bodyType === "SUB_BODY");

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Posting Types</h1>
        <p className="text-sm text-gray-500 mt-1">Manage main body and sub body post types</p>
      </div>

      {/* Add / Edit form */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">{editingId ? "Edit Posting Type" : "Add New Posting Type"}</h2>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Tamil Name *</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm tamil-text focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.nameTamil}
              onChange={(e) => setForm((f) => ({ ...f, nameTamil: e.target.value }))}
              placeholder="செயலாளர்"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">English Name *</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.nameEnglish}
              onChange={(e) => setForm((f) => ({ ...f, nameEnglish: e.target.value }))}
              placeholder="Secretary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Body Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.bodyType}
              onChange={(e) => setForm((f) => ({ ...f, bodyType: e.target.value as BodyType }))}
            >
              <option value="MAIN_BODY">Main Body</option>
              <option value="SUB_BODY">Sub Body</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Display Order</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update" : "Add Posting Type"}
          </button>
          {editingId && (
            <button
              onClick={cancelEdit}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Lists */}
      {[{ label: "Main Body", items: mainBody }, { label: "Sub Body", items: subBody }].map(({ label, items }) => (
        <div key={label} className="mb-6">
          <h2 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">{label}</h2>
          {items.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No {label.toLowerCase()} posting types yet.</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-2 text-left w-8">#</th>
                    <th className="px-4 py-2 text-left">Tamil</th>
                    <th className="px-4 py-2 text-left">English</th>
                    <th className="px-4 py-2 text-center">Members</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p, idx) => (
                    <tr key={p.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-2 text-gray-400 font-mono text-xs">{p.order}</td>
                      <td className="px-4 py-2 font-medium text-gray-800 tamil-text">{p.nameTamil}</td>
                      <td className="px-4 py-2 text-gray-600">{p.nameEnglish}</td>
                      <td className="px-4 py-2 text-center">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          {p._count.members}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(p)}
                            className="text-xs px-2.5 py-1 border border-gray-200 rounded text-gray-600 hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="text-xs px-2.5 py-1 border border-red-200 rounded text-red-500 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
