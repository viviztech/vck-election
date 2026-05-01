"use client";

import { useState, useRef } from "react";

type Scope = "state" | "zone" | "district";
type BodyType = "MAIN_BODY" | "SUB_BODY" | "LOCAL";
type Gender = "MALE" | "FEMALE" | "OTHER";

interface PostingType {
  id: string;
  nameTamil: string;
  nameEnglish: string;
  bodyType: BodyType;
  order: number;
}

interface Wing {
  id: string;
  name: string;
  nameTA?: string | null;
}

interface ParliamentaryConstituency {
  id: string;
  nameEnglish: string;
  nameTamil: string;
  code: string;
  order: number;
}

interface District {
  id: string;
  nameEnglish: string;
  nameTamil: string;
  code: string;
}

interface OrgMember {
  id: string;
  stateLevel: boolean;
  parliamentaryConstituencyId?: string | null;
  districtId?: string | null;
  wingId?: string | null;
  postingTypeId: string;
  name: string;
  address?: string | null;
  age?: number | null;
  gender?: Gender | null;
  contact?: string | null;
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
  wing?: Wing | null;
  parliamentaryConstituency?: ParliamentaryConstituency | null;
  district?: District | null;
}

const PERSON_FIELDS = [
  "name", "address", "age", "gender", "contact", "alternateContact",
  "email", "partyMembershipId", "photoKey",
  "facebook", "instagram", "x", "whatsapp", "youtube", "linkedin", "telegram",
] as const;

const emptyForm = {
  wingId: "",
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
  // scope-specific
  parliamentaryConstituencyId: "",
  districtId: "",
};

export function OrgMembersClient({
  scope,
  postingTypes,
  wings,
  parliamentaryConstituencies,
  districts,
  initialMembers,
}: {
  scope: Scope;
  postingTypes: PostingType[];
  wings: Wing[];
  parliamentaryConstituencies: ParliamentaryConstituency[];
  districts: District[];
  initialMembers: OrgMember[];
}) {
  const [members, setMembers] = useState<OrgMember[]>(initialMembers);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filterWingId, setFilterWingId] = useState("");
  const [filterPcId, setFilterPcId] = useState("");
  const [filterDistrictId, setFilterDistrictId] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const mainBodyPostings = postingTypes.filter((p) => p.bodyType === "MAIN_BODY");
  const wingPostings = postingTypes.filter((p) => p.bodyType === "SUB_BODY");

  // Filtered view
  const visible = members.filter((m) => {
    if (filterWingId && m.wingId !== filterWingId) return false;
    if (filterPcId && m.parliamentaryConstituencyId !== filterPcId) return false;
    if (filterDistrictId && m.districtId !== filterDistrictId) return false;
    return true;
  });

  // Group by posting type for display
  const grouped = visible.reduce<Record<string, OrgMember[]>>((acc, m) => {
    const key = m.postingType.nameTamil;
    acc[key] = acc[key] ?? [];
    acc[key].push(m);
    return acc;
  }, {});

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setPhotoPreview(null);
    setError("");
  }

  function startEdit(m: OrgMember) {
    setForm({
      wingId: m.wingId ?? "",
      postingTypeId: m.postingTypeId,
      name: m.name,
      address: m.address ?? "",
      age: m.age?.toString() ?? "",
      gender: m.gender ?? "",
      contact: m.contact ?? "",
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
      parliamentaryConstituencyId: m.parliamentaryConstituencyId ?? "",
      districtId: m.districtId ?? "",
    });
    setPhotoPreview(m.photoUrl ?? null);
    setEditingId(m.id);
    setShowForm(true);
    setError("");
  }

  async function handlePhotoUpload(file: File) {
    setUploadingPhoto(true);
    try {
      const urlRes = await fetch("/api/admin/constituency-members/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      if (!urlRes.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl, key } = await urlRes.json();
      await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      setForm((f) => ({ ...f, photoKey: key }));
      setPhotoPreview(URL.createObjectURL(file));
    } catch {
      setError("Photo upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...Object.fromEntries(PERSON_FIELDS.map((f) => [f, form[f] || null])),
      postingTypeId: form.postingTypeId,
      wingId: form.wingId || null,
      order: form.order,
      stateLevel: scope === "state",
      parliamentaryConstituencyId: scope === "zone" ? (form.parliamentaryConstituencyId || null) : null,
      districtId: scope === "district" ? (form.districtId || null) : null,
    };

    try {
      const url = editingId ? `/api/admin/org-members/${editingId}` : "/api/admin/org-members";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }
      const saved: OrgMember = await res.json();
      setMembers((prev) =>
        editingId
          ? prev.map((m) => (m.id === editingId ? saved : m))
          : [saved, ...prev]
      );
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this member?")) return;
    const res = await fetch(`/api/admin/org-members/${id}`, { method: "DELETE" });
    if (res.ok) setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  const scopeLabel = scope === "state" ? "State" : scope === "zone" ? "Zone (PC)" : "District";

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{scopeLabel} Postings</h1>
          <p className="text-sm text-gray-500 mt-1">
            {members.length} member{members.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-[#C41E1E] text-white rounded-lg text-sm font-medium hover:bg-[#a81818]"
        >
          + Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Wing filter */}
        <select
          value={filterWingId}
          onChange={(e) => setFilterWingId(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm text-gray-700"
        >
          <option value="">All Wings / Main Body</option>
          <option value="__main__">Main Body only</option>
          {wings.map((w) => (
            <option key={w.id} value={w.id}>{w.nameTA ?? w.name}</option>
          ))}
        </select>

        {/* Zone filter (zone scope only) */}
        {scope === "zone" && (
          <select
            value={filterPcId}
            onChange={(e) => setFilterPcId(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm text-gray-700"
          >
            <option value="">All Zones</option>
            {parliamentaryConstituencies.map((pc) => (
              <option key={pc.id} value={pc.id}>{pc.nameEnglish} ({pc.nameTamil})</option>
            ))}
          </select>
        )}

        {/* District filter (district scope only) */}
        {scope === "district" && (
          <select
            value={filterDistrictId}
            onChange={(e) => setFilterDistrictId(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm text-gray-700"
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>{d.nameEnglish} ({d.nameTamil})</option>
            ))}
          </select>
        )}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">
              {editingId ? "Edit Member" : "Add Member"}
            </h2>
            <button onClick={() => { resetForm(); setShowForm(false); }} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Scope-specific geo selectors */}
            {scope === "zone" && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Zone (PC) *</label>
                <select
                  required
                  value={form.parliamentaryConstituencyId}
                  onChange={(e) => setForm((f) => ({ ...f, parliamentaryConstituencyId: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select Zone</option>
                  {parliamentaryConstituencies.map((pc) => (
                    <option key={pc.id} value={pc.id}>{pc.nameEnglish} — {pc.nameTamil}</option>
                  ))}
                </select>
              </div>
            )}
            {scope === "district" && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">District *</label>
                <select
                  required
                  value={form.districtId}
                  onChange={(e) => setForm((f) => ({ ...f, districtId: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>{d.nameEnglish} — {d.nameTamil}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Wing */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Wing (blank = Main Body)</label>
              <select
                value={form.wingId}
                onChange={(e) => setForm((f) => ({ ...f, wingId: e.target.value, postingTypeId: "" }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Main Body</option>
                {wings.map((w) => (
                  <option key={w.id} value={w.id}>{w.nameTA ?? w.name}</option>
                ))}
              </select>
            </div>

            {/* Posting type */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Posting Type *</label>
              <select
                required
                value={form.postingTypeId}
                onChange={(e) => setForm((f) => ({ ...f, postingTypeId: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select Posting</option>
                {(form.wingId ? wingPostings : mainBodyPostings).map((pt) => (
                  <option key={pt.id} value={pt.id}>{pt.nameEnglish} — {pt.nameTamil}</option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Member name"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Contact</label>
              <input
                value={form.contact}
                onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Phone number"
              />
            </div>

            {/* Alternate contact */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Alternate Contact</label>
              <input
                value={form.alternateContact}
                onChange={(e) => setForm((f) => ({ ...f, alternateContact: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Age</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                min={1} max={120}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as Gender | "" }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* Party membership ID */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Party Membership ID</label>
              <input
                value={form.partyMembershipId}
                onChange={(e) => setForm((f) => ({ ...f, partyMembershipId: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* Order */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Display Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                min={0}
              />
            </div>

            {/* Address — full width */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                rows={2}
              />
            </div>

            {/* Photo upload */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Photo</label>
              <div className="flex items-center gap-4">
                {photoPreview && (
                  <img src={photoPreview} alt="preview" className="w-16 h-16 rounded-full object-cover border" />
                )}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }}
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  {uploadingPhoto ? "Uploading…" : "Choose Photo"}
                </button>
              </div>
            </div>

            {/* Social — collapsible section header */}
            <details className="md:col-span-2 lg:col-span-3">
              <summary className="cursor-pointer text-xs font-medium text-gray-500 hover:text-gray-700 mb-3">
                Social Media Links (optional)
              </summary>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                {(["facebook", "instagram", "x", "whatsapp", "youtube", "linkedin", "telegram"] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-xs text-gray-500 mb-1 capitalize">{field}</label>
                    <input
                      value={form[field]}
                      onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                ))}
              </div>
            </details>

            {/* Error + Submit */}
            {error && <p className="md:col-span-2 lg:col-span-3 text-red-600 text-sm">{error}</p>}
            <div className="md:col-span-2 lg:col-span-3 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-[#C41E1E] text-white rounded-lg text-sm font-medium hover:bg-[#a81818] disabled:opacity-50"
              >
                {saving ? "Saving…" : editingId ? "Update" : "Add Member"}
              </button>
              <button
                type="button"
                onClick={() => { resetForm(); setShowForm(false); }}
                className="px-5 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Member list */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-20 text-gray-400">No members found. Add one above.</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([postingName, groupMembers]) => (
            <div key={postingName}>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C41E1E] inline-block" />
                {postingName}
                <span className="text-gray-400 font-normal normal-case">({groupMembers.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groupMembers.map((m) => (
                  <MemberCard
                    key={m.id}
                    member={m}
                    scope={scope}
                    onEdit={() => startEdit(m)}
                    onDelete={() => handleDelete(m.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MemberCard({
  member: m,
  scope,
  onEdit,
  onDelete,
}: {
  member: OrgMember;
  scope: Scope;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const geoLabel =
    scope === "zone"
      ? m.parliamentaryConstituency?.nameEnglish
      : scope === "district"
      ? m.district?.nameEnglish
      : "State";

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {m.photoUrl ? (
          <img src={m.photoUrl} alt={m.name} className="w-12 h-12 rounded-full object-cover border shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#0A1628] flex items-center justify-center text-white font-black text-base shrink-0">
            {m.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-[#0A1628] text-sm leading-tight truncate">{m.name}</p>
          {m.wing && (
            <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium mt-1">
              {m.wing.nameTA ?? m.wing.name}
            </span>
          )}
          {geoLabel && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{geoLabel}</p>
          )}
        </div>
      </div>

      {m.contact && (
        <p className="text-xs text-gray-500 truncate">📞 {m.contact}</p>
      )}

      <div className="flex gap-2 pt-1 border-t">
        <button
          onClick={onEdit}
          className="flex-1 text-xs py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 text-xs py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
