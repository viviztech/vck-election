"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

interface FormEntry {
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
  applicationGivenBy?: string | null;
  applicationGivenTo?: string | null;
  forThalaivar?: string | null;
  districtId?: string | null;
  constituencyId?: string | null;
  rawDistrictText?: string | null;
  rawConstituencyText?: string | null;
  isVerified?: boolean;
  ocrStatus?: string;
}

interface Props {
  entry: FormEntry;
  districts: District[];
  constituencies: Constituency[];
  onSaved?: () => void;
}

export function FormEntryEditor({ entry, districts, constituencies, onSaved }: Props) {
  const router = useRouter();
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
    entryDate: entry.entryDate
      ? new Date(entry.entryDate).toISOString().slice(0, 10)
      : "",
    entryPlace: entry.entryPlace ?? "",
    applicationGivenBy: entry.applicationGivenBy ?? "",
    applicationGivenTo: entry.applicationGivenTo ?? "",
    forThalaivar: entry.forThalaivar ?? "",
    districtId: entry.districtId ?? "",
    constituencyId: entry.constituencyId ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const filteredConstituencies = form.districtId
    ? constituencies.filter((c) => c.districtId === form.districtId)
    : constituencies;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Reset constituency when district changes
    if (name === "districtId") {
      setForm((prev) => ({ ...prev, districtId: value, constituencyId: "" }));
    }
  }

  async function handleSave(verify = false) {
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      yearJoinedParty: form.yearJoinedParty ? parseInt(form.yearJoinedParty) : undefined,
      districtId: form.districtId || undefined,
      constituencyId: form.constituencyId || undefined,
      isVerified: verify,
    };

    const res = await fetch(`/api/entries/${entry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      setError("Failed to save. Please try again.");
      return;
    }

    setSaved(true);
    onSaved?.();
    if (verify) router.push("/entries");
  }

  const fieldClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 tamil-text";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Verify Form Data
        </h2>
        {entry.ocrStatus === "COMPLETED" && (
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
            OCR Complete — Please verify
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>வரிசை எண் (Serial No)</label>
          <input name="serialNumber" value={form.serialNumber} onChange={handleChange} className={fieldClass} />
        </div>

        <div>
          <label className={labelClass}>கட்டண ரசீது எண் (Receipt No)</label>
          <input name="feeReceiptNumber" value={form.feeReceiptNumber} onChange={handleChange} className={fieldClass} />
        </div>

        <div>
          <label className={labelClass}>பெயர் (Name)</label>
          <input name="name" value={form.name} onChange={handleChange} className={fieldClass} />
        </div>

        <div>
          <label className={labelClass}>த.பெ/க.பெ (Parent Name)</label>
          <div className="flex gap-2">
            <select
              name="parentType"
              value={form.parentType}
              onChange={handleChange}
              className="px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="FATHER">Father</option>
              <option value="MOTHER">Mother</option>
            </select>
            <input
              name="parentName"
              value={form.parentName}
              onChange={handleChange}
              className={`flex-1 ${fieldClass}`}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>முகவரி (Address)</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>தொடர்பு எண் (Contact)</label>
          <input name="contactNumber" value={form.contactNumber} onChange={handleChange} className={fieldClass} />
        </div>

        <div>
          <label className={labelClass}>வருவாய் மாவட்டம் (District)</label>
          <select name="districtId" value={form.districtId} onChange={handleChange} className={fieldClass}>
            <option value="">-- Select District --</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nameTamil} ({d.nameEnglish})
              </option>
            ))}
          </select>
          {entry.rawDistrictText && (
            <p className="text-xs text-gray-400 mt-1">OCR: &quot;{entry.rawDistrictText}&quot;</p>
          )}
        </div>

        <div>
          <label className={labelClass}>விரும்பும் தொகுதி (Constituency)</label>
          <select name="constituencyId" value={form.constituencyId} onChange={handleChange} className={fieldClass}>
            <option value="">-- Select Constituency --</option>
            {filteredConstituencies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameTamil} ({c.nameEnglish})
              </option>
            ))}
          </select>
          {entry.rawConstituencyText && (
            <p className="text-xs text-gray-400 mt-1">OCR: &quot;{entry.rawConstituencyText}&quot;</p>
          )}
        </div>

        <div>
          <label className={labelClass}>கட்சியில் சேர்ந்த ஆண்டு (Year Joined)</label>
          <input
            name="yearJoinedParty"
            type="number"
            min="1900"
            max="2100"
            value={form.yearJoinedParty}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>கட்சியில் பொறுப்பு நிலை (Party Position)</label>
          <input name="partyPosition" value={form.partyPosition} onChange={handleChange} className={fieldClass} />
        </div>

        <div>
          <label className={labelClass}>நாள் (Entry Date)</label>
          <input
            name="entryDate"
            type="date"
            value={form.entryDate}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>இடம் (Place)</label>
          <input name="entryPlace" value={form.entryPlace} onChange={handleChange} className={fieldClass} />
        </div>

        <div>
          <label className={labelClass}>விண்ணப்பம் கொடுத்தவர் (Application Given By)</label>
          <input name="applicationGivenBy" value={form.applicationGivenBy} onChange={handleChange} className={fieldClass} placeholder="பெயர் உள்ளிடவும்" />
        </div>

        <div>
          <label className={labelClass}>விண்ணப்பம் பெற்றவர் (Application Given To)</label>
          <input name="applicationGivenTo" value={form.applicationGivenTo} onChange={handleChange} className={fieldClass} placeholder="பெயர் உள்ளிடவும்" />
        </div>

        <div>
          <label className={labelClass}>தலைவருக்காக (For Thalaivar) <span className="text-red-500">*</span></label>
          <input name="forThalaivar" value={form.forThalaivar} onChange={handleChange} className={fieldClass} placeholder="தலைவருக்காக என்ன செய்கிறார்" />
        </div>
      </div>

      <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition"
        >
          {saving ? "Saving..." : "Save Draft"}
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="flex-1 py-2.5 px-4 bg-green-700 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 transition"
        >
          {saving ? "Saving..." : "Save & Mark Verified"}
        </button>
      </div>

      {saved && (
        <p className="text-center text-sm text-green-600 mt-3 font-medium">
          Saved successfully!
        </p>
      )}
    </div>
  );
}
