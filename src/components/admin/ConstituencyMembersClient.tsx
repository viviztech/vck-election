"use client";

import { useState, useRef } from "react";

type BodyType = "MAIN_BODY" | "SUB_BODY";
type Gender = "MALE" | "FEMALE" | "OTHER";

interface District {
  id: string;
  nameEnglish: string;
  nameTamil: string;
  code: string;
  constituencies: { id: string; nameEnglish: string; nameTamil: string }[];
}

interface PostingType {
  id: string;
  nameTamil: string;
  nameEnglish: string;
  bodyType: BodyType;
  order: number;
}

interface Member {
  id: string;
  constituencyId: string;
  postingTypeId: string;
  name: string;
  address?: string | null;
  age?: number | null;
  gender?: Gender | null;
  contact: string;
  alternateContact?: string | null;
  email?: string | null;
  partyMembershipId?: string | null;
  photoKey?: string | null;
  photoUrl?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  x?: string | null;
  whatsapp?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
  telegram?: string | null;
  order: number;
  isActive: boolean;
  postingType: PostingType;
  constituency: { id: string; nameEnglish: string; nameTamil: string; district: { nameEnglish: string; nameTamil: string } };
}

const emptyForm = {
  constituencyId: "",
  postingTypeId: "",
  name: "",
  address: "",
  age: "",
  gender: "" as Gender | "",
  contact: "",
  alternateContact: "",
  email: "",
  partyMembershipId: "",
  photoKey: "",
  facebook: "",
  instagram: "",
  x: "",
  whatsapp: "",
  youtube: "",
  linkedin: "",
  telegram: "",
  order: 0,
};

export function ConstituencyMembersClient({
  districts,
  postingTypes,
  initialMembers,
}: {
  districts: District[];
  postingTypes: PostingType[];
  initialMembers: Member[];
}) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filterConstituencyId, setFilterConstituencyId] = useState("");
  const [filterDistrictId, setFilterDistrictId] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const allConstituencies = districts.flatMap((d) =>
    d.constituencies.map((c) => ({ ...c, districtId: d.id, districtName: d.nameEnglish, districtTamil: d.nameTamil }))
  );

  const filteredConstituencies = filterDistrictId
    ? allConstituencies.filter((c) => c.districtId === filterDistrictId)
    : allConstituencies;

  const displayedMembers = members.filter((m) => {
    if (filterConstituencyId && m.constituencyId !== filterConstituencyId) return false;
    if (filterDistrictId && m.constituency.district.nameEnglish !== districts.find((d) => d.id === filterDistrictId)?.nameEnglish) return false;
    return true;
  });

  // Group displayed members by constituency
  const grouped = displayedMembers.reduce<Record<string, Member[]>>((acc, m) => {
    acc[m.constituencyId] = acc[m.constituencyId] ?? [];
    acc[m.constituencyId].push(m);
    return acc;
  }, {});

  async function handlePhotoUpload(file: File) {
    setUploadingPhoto(true);
    const res = await fetch("/api/admin/constituency-members/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    });
    if (!res.ok) { setUploadingPhoto(false); setError("Photo upload failed."); return; }
    const { uploadUrl, key } = await res.json();
    await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
    setForm((f) => ({ ...f, photoKey: key }));
    setPhotoPreview(URL.createObjectURL(file));
    setUploadingPhoto(false);
  }

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setPhotoPreview(null);
    setError("");
    setShowForm(true);
  }

  function startEdit(m: Member) {
    setEditingId(m.id);
    setForm({
      constituencyId: m.constituencyId,
      postingTypeId: m.postingTypeId,
      name: m.name,
      address: m.address ?? "",
      age: m.age?.toString() ?? "",
      gender: m.gender ?? "",
      contact: m.contact,
      alternateContact: m.alternateContact ?? "",
      email: m.email ?? "",
      partyMembershipId: m.partyMembershipId ?? "",
      photoKey: m.photoKey ?? "",
      facebook: m.facebook ?? "",
      instagram: m.instagram ?? "",
      x: m.x ?? "",
      whatsapp: m.whatsapp ?? "",
      youtube: m.youtube ?? "",
      linkedin: m.linkedin ?? "",
      telegram: m.telegram ?? "",
      order: m.order,
    });
    setPhotoPreview(m.photoUrl ?? null);
    setError("");
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setPhotoPreview(null);
    setError("");
  }

  async function handleSave() {
    if (!form.constituencyId || !form.postingTypeId || !form.name.trim() || !form.contact.trim()) {
      setError("Constituency, Posting Type, Name, and Contact are required.");
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      age: form.age ? parseInt(form.age) : undefined,
      gender: form.gender || undefined,
    };

    if (editingId) {
      const res = await fetch(`/api/admin/constituency-members/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { setError("Failed to update."); setSaving(false); return; }
      const updated = await res.json();
      setMembers((prev) => prev.map((m) => m.id === editingId ? { ...updated, photoUrl: photoPreview, createdAt: m.createdAt, updatedAt: new Date().toISOString() } : m));
    } else {
      const res = await fetch("/api/admin/constituency-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { setError("Failed to save."); setSaving(false); return; }
      const created = await res.json();
      setMembers((prev) => [...prev, { ...created, photoUrl: photoPreview, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setSaving(false);
    cancelForm();
  }

  async function handleDelete(m: Member) {
    if (!confirm(`Delete ${m.name}?`)) return;
    const res = await fetch(`/api/admin/constituency-members/${m.id}`, { method: "DELETE" });
    if (res.ok) setMembers((prev) => prev.filter((x) => x.id !== m.id));
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide";

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Constituency Members</h1>
          <p className="text-sm text-gray-500 mt-1">{members.length} members across all constituencies</p>
        </div>
        <button
          onClick={startAdd}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700"
        >
          + Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <select
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterDistrictId}
          onChange={(e) => { setFilterDistrictId(e.target.value); setFilterConstituencyId(""); }}
        >
          <option value="">All Districts</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>{d.nameEnglish}</option>
          ))}
        </select>
        <select
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterConstituencyId}
          onChange={(e) => setFilterConstituencyId(e.target.value)}
        >
          <option value="">All Constituencies</option>
          {filteredConstituencies.map((c) => (
            <option key={c.id} value={c.id}>{c.nameEnglish}</option>
          ))}
        </select>
      </div>

      {/* Add/Edit form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">{editingId ? "Edit Member" : "Add Member"}</h2>
              <button onClick={cancelForm} className="text-gray-400 hover:text-gray-700 text-xl leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>District</label>
                  <select
                    className={inputClass}
                    value={allConstituencies.find((c) => c.id === form.constituencyId)?.districtId ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, constituencyId: "" }))}
                    onClick={(e) => {
                      const distId = (e.target as HTMLSelectElement).value;
                      setForm((f) => ({ ...f, constituencyId: "" }));
                      // handled by onChange on district select below
                    }}
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => <option key={d.id} value={d.id}>{d.nameEnglish}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Constituency *</label>
                  <select
                    className={inputClass}
                    value={form.constituencyId}
                    onChange={(e) => setForm((f) => ({ ...f, constituencyId: e.target.value }))}
                  >
                    <option value="">Select Constituency</option>
                    {allConstituencies.map((c) => (
                      <option key={c.id} value={c.id}>{c.nameEnglish} ({c.districtName})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Posting Type *</label>
                  <select
                    className={inputClass}
                    value={form.postingTypeId}
                    onChange={(e) => setForm((f) => ({ ...f, postingTypeId: e.target.value }))}
                  >
                    <option value="">Select Posting</option>
                    {["MAIN_BODY", "SUB_BODY"].map((bt) => {
                      const items = postingTypes.filter((p) => p.bodyType === bt);
                      if (!items.length) return null;
                      return (
                        <optgroup key={bt} label={bt === "MAIN_BODY" ? "Main Body" : "Sub Body"}>
                          {items.map((p) => <option key={p.id} value={p.id}>{p.nameTamil} — {p.nameEnglish}</option>)}
                        </optgroup>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Display Order</label>
                  <input type="number" className={inputClass} value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))} />
                </div>
              </div>

              {/* Personal details */}
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Personal Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Full Name *</label>
                    <input className={`${inputClass} tamil-text`} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="பெயர்" />
                  </div>
                  <div>
                    <label className={labelClass}>Age</label>
                    <input type="number" className={inputClass} value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select className={inputClass} value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as Gender | "" }))}>
                      <option value="">Select</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Contact *</label>
                    <input className={inputClass} value={form.contact} onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))} placeholder="9XXXXXXXXX" />
                  </div>
                  <div>
                    <label className={labelClass}>Alternate Contact</label>
                    <input className={inputClass} value={form.alternateContact} onChange={(e) => setForm((f) => ({ ...f, alternateContact: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Party Membership ID</label>
                    <input className={inputClass} value={form.partyMembershipId} onChange={(e) => setForm((f) => ({ ...f, partyMembershipId: e.target.value }))} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Address</label>
                    <textarea className={inputClass} rows={2} value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Photo */}
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Photo</p>
                <div className="flex items-center gap-4">
                  {photoPreview && (
                    <img src={photoPreview} alt="preview" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                  )}
                  <div>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload(file);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Social media */}
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Social Media</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: "facebook", label: "Facebook" },
                    { key: "instagram", label: "Instagram" },
                    { key: "x", label: "X (Twitter)" },
                    { key: "whatsapp", label: "WhatsApp" },
                    { key: "youtube", label: "YouTube" },
                    { key: "linkedin", label: "LinkedIn" },
                    { key: "telegram", label: "Telegram" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className={labelClass}>{label}</label>
                      <input
                        className={inputClass}
                        value={form[key as keyof typeof form] as string}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        placeholder={`${label} profile URL`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 px-5 py-4 border-t border-gray-100">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update Member" : "Add Member"}
              </button>
              <button
                onClick={cancelForm}
                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member list grouped by constituency */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">👥</p>
          <p className="font-medium">No members yet</p>
          <p className="text-sm mt-1">Click "Add Member" to get started</p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([constituencyId, mems]) => {
            const first = mems[0];
            return (
              <div key={constituencyId} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-5 py-3 bg-slate-800 text-white">
                  <div>
                    <span className="font-bold tamil-text">{first.constituency.nameTamil}</span>
                    <span className="text-slate-300 text-sm ml-2">({first.constituency.nameEnglish})</span>
                    <span className="text-slate-400 text-xs ml-2">— {first.constituency.district.nameEnglish}</span>
                  </div>
                  <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold">{mems.length} members</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
                        <th className="px-4 py-2 text-left">Photo</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Posting</th>
                        <th className="px-4 py-2 text-left">Contact</th>
                        <th className="px-4 py-2 text-left">Social</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mems.map((m, idx) => (
                        <tr key={m.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2">
                            {m.photoUrl ? (
                              <img src={m.photoUrl} alt={m.name} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
                                {m.name.charAt(0)}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <p className="font-medium text-gray-800 tamil-text">{m.name}</p>
                            {m.age && <p className="text-xs text-gray-400">{m.age}y {m.gender ? `· ${m.gender.toLowerCase()}` : ""}</p>}
                          </td>
                          <td className="px-4 py-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.postingType.bodyType === "MAIN_BODY" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                              {m.postingType.nameTamil}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <p className="text-gray-700 font-mono text-xs">{m.contact}</p>
                            {m.alternateContact && <p className="text-gray-400 font-mono text-xs">{m.alternateContact}</p>}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex gap-1.5 flex-wrap">
                              {m.facebook && <a href={m.facebook} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">FB</a>}
                              {m.instagram && <a href={m.instagram} target="_blank" rel="noreferrer" className="text-xs text-pink-600 hover:underline">IG</a>}
                              {m.x && <a href={m.x} target="_blank" rel="noreferrer" className="text-xs text-gray-700 hover:underline">X</a>}
                              {m.whatsapp && <a href={`https://wa.me/${m.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="text-xs text-green-600 hover:underline">WA</a>}
                              {m.youtube && <a href={m.youtube} target="_blank" rel="noreferrer" className="text-xs text-red-600 hover:underline">YT</a>}
                              {m.telegram && <a href={m.telegram} target="_blank" rel="noreferrer" className="text-xs text-sky-600 hover:underline">TG</a>}
                              {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" className="text-xs text-blue-800 hover:underline">LI</a>}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => startEdit(m)} className="text-xs px-2.5 py-1 border border-gray-200 rounded text-gray-600 hover:bg-gray-50">Edit</button>
                              <button onClick={() => handleDelete(m)} className="text-xs px-2.5 py-1 border border-red-200 rounded text-red-500 hover:bg-red-50">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
