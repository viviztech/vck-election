"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface District {
  id: string;
  nameEnglish: string;
  nameTamil: string;
}

interface Constituency {
  id: string;
  nameEnglish: string;
  nameTamil: string;
  districtId: string;
}

interface AuditLog {
  id: string;
  action: string;
  createdAt: string;
  user: { name?: string | null; email: string };
}

interface Entry {
  id: string;
  serialNumber?: string | null;
  feeReceiptNumber?: string | null;
  name?: string | null;
  parentName?: string | null;
  parentType?: string | null;
  address?: string | null;
  contactNumber?: string | null;
  yearJoinedParty?: number | null;
  partyPosition?: string | null;
  entryDate?: string | null;
  entryPlace?: string | null;
  districtId?: string | null;
  constituencyId?: string | null;
  rawDistrictText?: string | null;
  rawConstituencyText?: string | null;
  isVerified: boolean;
  ocrStatus: string;
  imageUrl: string;
  createdAt: string;
  submittedBy?: { name?: string | null; email: string } | null;
  auditLogs: AuditLog[];
}

interface Props {
  entry: Entry;
  districts: District[];
  constituencies: Constituency[];
  currentUserRole: string;
}

export function SplitReviewPage({ entry, districts, constituencies, currentUserRole }: Props) {
  const router = useRouter();
  const isAdmin = currentUserRole === "ADMIN" || currentUserRole === "SUPER_ADMIN";

  const [form, setForm] = useState({
    serialNumber: entry.serialNumber ?? "",
    feeReceiptNumber: entry.feeReceiptNumber ?? "",
    name: entry.name ?? "",
    parentName: entry.parentName ?? "",
    parentType: entry.parentType ?? "FATHER",
    address: entry.address ?? "",
    contactNumber: entry.contactNumber ?? "",
    yearJoinedParty: entry.yearJoinedParty?.toString() ?? "",
    partyPosition: entry.partyPosition ?? "",
    entryDate: entry.entryDate ? new Date(entry.entryDate).toISOString().slice(0, 10) : "",
    entryPlace: entry.entryPlace ?? "",
    districtId: entry.districtId ?? "",
    constituencyId: entry.constituencyId ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);

  const filteredConstituencies = form.districtId
    ? constituencies.filter((c) => c.districtId === form.districtId)
    : constituencies;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    if (name === "districtId") {
      setForm((prev) => ({ ...prev, districtId: value, constituencyId: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setSaved(false);
  }

  async function handleSave(verify = false) {
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch(`/api/entries/${entry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        yearJoinedParty: form.yearJoinedParty ? parseInt(form.yearJoinedParty) : undefined,
        districtId: form.districtId || undefined,
        constituencyId: form.constituencyId || undefined,
        isVerified: verify,
      }),
    });

    setSaving(false);
    if (!res.ok) {
      setError("Failed to save. Please try again.");
      return;
    }
    setSaved(true);
    if (verify) {
      setTimeout(() => router.push("/entries"), 800);
    }
  }

  const fieldClass =
    "w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white tamil-text";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-0.5 uppercase tracking-wide";

  const ocrStatusColor = {
    COMPLETED: "bg-green-100 text-green-700",
    PROCESSING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-700",
    PENDING: "bg-gray-100 text-gray-500",
    MANUAL: "bg-blue-100 text-blue-700",
  }[entry.ocrStatus] ?? "bg-gray-100 text-gray-500";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-4 shrink-0">
        <Link href="/entries" className="text-sm text-gray-400 hover:text-gray-700 transition">
          ← Back
        </Link>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">
            {entry.name ? (
              <span className="tamil-text">{entry.name}</span>
            ) : (
              <span className="text-gray-400">Unnamed Entry</span>
            )}
          </span>
          {entry.serialNumber && (
            <span className="text-xs text-gray-400 font-mono">#{entry.serialNumber}</span>
          )}
        </div>
        <div className="flex items-center gap-2 ml-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ocrStatusColor}`}>
            OCR: {entry.ocrStatus}
          </span>
          {entry.isVerified && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-600 text-white">
              ✓ Verified
            </span>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
          <span>Uploaded by {entry.submittedBy?.name ?? entry.submittedBy?.email}</span>
          <span>·</span>
          <span>{new Date(entry.createdAt).toLocaleDateString("en-IN")}</span>
        </div>
      </div>

      {/* Split body */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Form Image */}
        <div className="w-1/2 bg-gray-800 flex flex-col overflow-hidden border-r border-gray-700">
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 shrink-0">
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Form Image
            </span>
            <div className="flex items-center gap-2">
              <a
                href={entry.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Open full size ↗
              </a>
              <button
                onClick={() => setImageZoomed((z) => !z)}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
              >
                {imageZoomed ? "Fit" : "Zoom"}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 flex items-start justify-center">
            <img
              src={entry.imageUrl}
              alt="VCK Application Form"
              className={`rounded-lg shadow-xl transition-all duration-200 ${
                imageZoomed
                  ? "w-full max-w-none cursor-zoom-out"
                  : "max-h-full max-w-full object-contain cursor-zoom-in"
              }`}
              onClick={() => setImageZoomed((z) => !z)}
            />
          </div>
        </div>

        {/* RIGHT — Data fields */}
        <div className="w-1/2 flex flex-col overflow-hidden bg-white">
          <div className="flex items-center justify-between px-5 py-2.5 bg-white border-b border-gray-100 shrink-0">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Extracted Data — Review & Correct
            </span>
            {saved && (
              <span className="text-xs text-green-600 font-semibold animate-pulse">
                ✓ Saved
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {error && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">

              {/* Serial No */}
              <div>
                <label className={labelClass}>வரிசை எண் (Serial No)</label>
                <input name="serialNumber" value={form.serialNumber} onChange={handleChange} className={fieldClass} />
              </div>

              {/* Receipt No */}
              <div>
                <label className={labelClass}>கட்டண ரசீது எண் (Receipt No)</label>
                <input name="feeReceiptNumber" value={form.feeReceiptNumber} onChange={handleChange} className={fieldClass} />
              </div>

              {/* Name */}
              <div className="col-span-2">
                <label className={labelClass}>பெயர் (Name)</label>
                <input name="name" value={form.name} onChange={handleChange} className={fieldClass} />
              </div>

              {/* Parent Name */}
              <div className="col-span-2">
                <label className={labelClass}>த.பெ / க.பெ (Father / Mother Name)</label>
                <div className="flex gap-2">
                  <select
                    name="parentType"
                    value={form.parentType}
                    onChange={handleChange}
                    className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="FATHER">Father</option>
                    <option value="MOTHER">Mother</option>
                  </select>
                  <input name="parentName" value={form.parentName} onChange={handleChange} className={`flex-1 ${fieldClass}`} />
                </div>
              </div>

              {/* Address */}
              <div className="col-span-2">
                <label className={labelClass}>முகவரி (Address)</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows={2} className={fieldClass} />
              </div>

              {/* Contact */}
              <div>
                <label className={labelClass}>தொடர்பு எண் (Contact)</label>
                <input name="contactNumber" value={form.contactNumber} onChange={handleChange} className={fieldClass} />
              </div>

              {/* Year Joined */}
              <div>
                <label className={labelClass}>சேர்ந்த ஆண்டு (Year Joined)</label>
                <input name="yearJoinedParty" type="number" min="1900" max="2100" value={form.yearJoinedParty} onChange={handleChange} className={fieldClass} />
              </div>

              {/* District */}
              <div>
                <label className={labelClass}>மாவட்டம் (District)</label>
                <select name="districtId" value={form.districtId} onChange={handleChange} className={fieldClass}>
                  <option value="">-- Select --</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>{d.nameTamil} ({d.nameEnglish})</option>
                  ))}
                </select>
                {entry.rawDistrictText && (
                  <p className="text-xs text-orange-500 mt-0.5">OCR read: &quot;{entry.rawDistrictText}&quot;</p>
                )}
              </div>

              {/* Constituency */}
              <div>
                <label className={labelClass}>தொகுதி (Constituency)</label>
                <select name="constituencyId" value={form.constituencyId} onChange={handleChange} className={fieldClass}>
                  <option value="">-- Select --</option>
                  {filteredConstituencies.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameTamil} ({c.nameEnglish})</option>
                  ))}
                </select>
                {entry.rawConstituencyText && (
                  <p className="text-xs text-orange-500 mt-0.5">OCR read: &quot;{entry.rawConstituencyText}&quot;</p>
                )}
              </div>

              {/* Party Position */}
              <div>
                <label className={labelClass}>பொறுப்பு நிலை (Party Position)</label>
                <input name="partyPosition" value={form.partyPosition} onChange={handleChange} className={fieldClass} />
              </div>

              {/* Entry Date */}
              <div>
                <label className={labelClass}>நாள் (Date)</label>
                <input name="entryDate" type="date" value={form.entryDate} onChange={handleChange} className={fieldClass} />
              </div>

              {/* Place */}
              <div className="col-span-2">
                <label className={labelClass}>இடம் (Place)</label>
                <input name="entryPlace" value={form.entryPlace} onChange={handleChange} className={fieldClass} />
              </div>

            </div>

            {/* Audit trail */}
            {entry.auditLogs.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Activity</p>
                <div className="space-y-1.5">
                  {entry.auditLogs.map((log) => (
                    <div key={log.id} className="flex gap-2 text-xs text-gray-500">
                      <span className="text-gray-300 shrink-0">{new Date(log.createdAt).toLocaleDateString("en-IN")}</span>
                      <span><span className="font-medium text-gray-700">{log.action}</span> by {log.user.name ?? log.user.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action bar — sticky bottom */}
          <div className="shrink-0 px-5 py-3 border-t border-gray-100 bg-gray-50 flex gap-3">
            {isAdmin && entry.ocrStatus === "FAILED" && (
              <button
                onClick={async () => {
                  await fetch(`/api/entries/${entry.id}/reprocess`, { method: "POST" });
                  router.refresh();
                }}
                className="px-3 py-2 text-xs text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition font-medium"
              >
                Re-run OCR
              </button>
            )}
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50 transition"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || entry.isVerified}
              className="flex-1 py-2 px-4 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {entry.isVerified ? "✓ Already Verified" : saving ? "Saving…" : "Confirm & Verify"}
            </button>
          </div>
        </div>

      </div>

      {/* Image zoom overlay */}
      {imageZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setImageZoomed(false)}
        >
          <img
            src={entry.imageUrl}
            alt="Form full size"
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setImageZoomed(false)}
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-9 h-9 flex items-center justify-center text-lg hover:bg-black/70"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
