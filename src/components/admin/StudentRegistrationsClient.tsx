"use client";

import { useCallback, useEffect, useState } from "react";

interface StudentRegistration {
  id: string;
  name: string;
  fatherName: string | null;
  dob: string | null;
  age: number | null;
  gender: string | null;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  currentClass: string | null;
  department: string | null;
  schoolName: string;
  rollNumber: string | null;
  marks10th: string | null;
  max10th: string | null;
  percent10th: string | null;
  marks12th: string | null;
  max12th: string | null;
  percent12th: string | null;
  marksCurrent: string | null;
  maxCurrent: string | null;
  percentCurrent: string | null;
  doorNo: string | null;
  village: string | null;
  taluk: string | null;
  district: string;
  pincode: string | null;
  studentWingMember: boolean | null;
  studentWingName: string | null;
  hearAboutUs: string | null;
  remarks: string | null;
  createdAt: string;
}

interface Filters {
  search: string;
  district: string;
  gender: string;
  studentWingMember: string;
  hearAboutUs: string;
  dateFrom: string;
  dateTo: string;
}

const EMPTY_FILTERS: Filters = {
  search: "",
  district: "",
  gender: "",
  studentWingMember: "",
  hearAboutUs: "",
  dateFrom: "",
  dateTo: "",
};

const HEAR_OPTIONS = ["Poster", "Social Media", "Friend", "College", "Other"];

const PAGE_SIZE = 20;

function countActiveFilters(f: Filters): number {
  return Object.values(f).filter((v) => v !== "").length;
}

function NullBadge({ value }: { value: boolean | null }) {
  if (value === null) return <span className="text-gray-300 text-xs">—</span>;
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${value ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
      {value ? "ஆம்" : "இல்லை"}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-full" /></td>
      ))}
    </tr>
  );
}

function DetailItem({ label, value }: { label: string; value?: string | null | React.ReactNode }) {
  if (!value && value !== false) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{children}</label>;
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
      {label}
      <button type="button" onClick={onRemove} className="hover:text-red-500 transition-colors ml-0.5 font-bold leading-none">×</button>
    </span>
  );
}

function MarksCell({ marks, max, percent }: { marks: string | null; max: string | null; percent: string | null }) {
  if (!marks && !max && !percent) return <span className="text-gray-300 text-xs">—</span>;
  return (
    <span className="text-xs text-gray-700">
      {[marks, max].filter(Boolean).join("/")}
      {percent && <span className="text-gray-500 ml-1">({percent}%)</span>}
    </span>
  );
}

export function StudentRegistrationsClient() {
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [applied, setApplied] = useState<Filters>(EMPTY_FILTERS);
  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activeCount = countActiveFilters(applied);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (applied.search) params.set("search", applied.search);
    if (applied.district) params.set("district", applied.district);
    if (applied.gender) params.set("gender", applied.gender);
    if (applied.studentWingMember) params.set("studentWingMember", applied.studentWingMember);
    if (applied.hearAboutUs) params.set("hearAboutUs", applied.hearAboutUs);
    if (applied.dateFrom) params.set("dateFrom", applied.dateFrom);
    if (applied.dateTo) params.set("dateTo", applied.dateTo);

    const res = await fetch(`/api/admin/student-registrations?${params}`);
    if (res.ok) {
      const data = await res.json();
      setRegistrations(data.registrations);
      setTotal(data.total);
    }
    setLoading(false);
  }, [page, applied]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setApplied(draft);
  }

  function handleReset() {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setPage(1);
  }

  function handleExport() {
    const params = new URLSearchParams({ format: "csv" });
    if (applied.search) params.set("search", applied.search);
    if (applied.district) params.set("district", applied.district);
    if (applied.gender) params.set("gender", applied.gender);
    if (applied.studentWingMember) params.set("studentWingMember", applied.studentWingMember);
    if (applied.hearAboutUs) params.set("hearAboutUs", applied.hearAboutUs);
    if (applied.dateFrom) params.set("dateFrom", applied.dateFrom);
    if (applied.dateTo) params.set("dateTo", applied.dateTo);
    window.location.href = `/api/admin/student-registrations?${params}`;
  }

  function setF<K extends keyof Filters>(key: K, value: Filters[K]) {
    setDraft((p) => ({ ...p, [key]: value }));
  }

  function removeApplied<K extends keyof Filters>(key: K, emptyVal: Filters[K]) {
    setF(key, emptyVal);
    setApplied((p) => ({ ...p, [key]: emptyVal }));
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch}>
        {/* Top toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="text"
              value={draft.search}
              onChange={(e) => setF("search", e.target.value)}
              placeholder="பெயர், தொலைபேசி, பள்ளி, மாவட்டம்..."
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 w-64"
            />
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                showFilters || activeCount > 0
                  ? "border-slate-600 bg-slate-800 text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              வடிப்பான்கள்
              {activeCount > 0 && (
                <span className="bg-white text-slate-800 text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">{activeCount}</span>
              )}
            </button>
            <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition">
              தேடு
            </button>
            {activeCount > 0 && (
              <button type="button" onClick={handleReset} className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition">
                அழி
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm text-gray-500">மொத்தம்: <strong>{total}</strong></span>
            <button type="button" onClick={handleExport} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2">
              ⬇ CSV
            </button>
          </div>
        </div>

        {/* Advanced filter panel */}
        {showFilters && (
          <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">மேம்பட்ட வடிப்பு</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <FilterLabel>மாவட்டம்</FilterLabel>
                <input
                  type="text"
                  value={draft.district}
                  onChange={(e) => setF("district", e.target.value)}
                  placeholder="மாவட்டம் பெயர்"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <FilterLabel>பாலினம்</FilterLabel>
                <select value={draft.gender} onChange={(e) => setF("gender", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400">
                  <option value="">அனைத்தும்</option>
                  <option value="MALE">ஆண்</option>
                  <option value="FEMALE">பெண்</option>
                  <option value="OTHER">பிற</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <FilterLabel>மாணவர் அமைப்பு உறுப்பினர்</FilterLabel>
                <select value={draft.studentWingMember} onChange={(e) => setF("studentWingMember", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400">
                  <option value="">அனைத்தும்</option>
                  <option value="true">ஆம்</option>
                  <option value="false">இல்லை</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <FilterLabel>எப்படி அறிந்தீர்கள்</FilterLabel>
                <select value={draft.hearAboutUs} onChange={(e) => setF("hearAboutUs", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400">
                  <option value="">அனைத்தும்</option>
                  {HEAR_OPTIONS.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <FilterLabel>பதிவு தேதி (இருந்து)</FilterLabel>
                <input type="date" value={draft.dateFrom} onChange={(e) => setF("dateFrom", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400" />
              </div>

              <div className="flex flex-col gap-1">
                <FilterLabel>பதிவு தேதி (வரை)</FilterLabel>
                <input type="date" value={draft.dateTo} onChange={(e) => setF("dateTo", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400" />
              </div>
            </div>

            {activeCount > 0 && (
              <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                {applied.search && <FilterChip label={`தேடல்: "${applied.search}"`} onRemove={() => removeApplied("search", "")} />}
                {applied.district && <FilterChip label={`மாவட்டம்: ${applied.district}`} onRemove={() => removeApplied("district", "")} />}
                {applied.gender && <FilterChip label={`பாலினம்: ${applied.gender === "MALE" ? "ஆண்" : applied.gender === "FEMALE" ? "பெண்" : "பிற"}`} onRemove={() => removeApplied("gender", "")} />}
                {applied.studentWingMember && <FilterChip label={`அமைப்பு உறுப்பினர்: ${applied.studentWingMember === "true" ? "ஆம்" : "இல்லை"}`} onRemove={() => removeApplied("studentWingMember", "")} />}
                {applied.hearAboutUs && <FilterChip label={`மூலம்: ${applied.hearAboutUs}`} onRemove={() => removeApplied("hearAboutUs", "")} />}
                {applied.dateFrom && <FilterChip label={`இருந்து: ${applied.dateFrom}`} onRemove={() => removeApplied("dateFrom", "")} />}
                {applied.dateTo && <FilterChip label={`வரை: ${applied.dateTo}`} onRemove={() => removeApplied("dateTo", "")} />}
              </div>
            )}
          </div>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left">
                <th className="px-4 py-3 font-semibold text-gray-600">#</th>
                <th className="px-4 py-3 font-semibold text-gray-600">பெயர்</th>
                <th className="px-4 py-3 font-semibold text-gray-600">தொலைபேசி</th>
                <th className="px-4 py-3 font-semibold text-gray-600">பள்ளி / கல்லூரி</th>
                <th className="px-4 py-3 font-semibold text-gray-600">வகுப்பு</th>
                <th className="px-4 py-3 font-semibold text-gray-600">மாவட்டம்</th>
                <th className="px-4 py-3 font-semibold text-gray-600">அமைப்பு</th>
                <th className="px-4 py-3 font-semibold text-gray-600">தேதி</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">பதிவுகள் இல்லை</td>
                </tr>
              ) : (
                registrations.map((s, idx) => (
                  <>
                    <tr
                      key={s.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    >
                      <td className="px-4 py-3 text-gray-400">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div>{s.name}</div>
                        <div className="text-xs text-gray-400 space-x-1">
                          {s.gender && <span>{s.gender === "MALE" ? "ஆண்" : s.gender === "FEMALE" ? "பெண்" : "பிற"}</span>}
                          {s.age && <span>• வயது {s.age}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <div>{s.phone}</div>
                        {s.whatsapp && <div className="text-xs text-gray-400">WA: {s.whatsapp}</div>}
                      </td>
                      <td className="px-4 py-3 text-gray-700 max-w-[180px] truncate">{s.schoolName}</td>
                      <td className="px-4 py-3 text-gray-700 text-xs">
                        {s.currentClass ?? "—"}
                        {s.department && <div className="text-gray-400">{s.department}</div>}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{s.district}</td>
                      <td className="px-4 py-3"><NullBadge value={s.studentWingMember} /></td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(s.createdAt).toLocaleDateString("ta-IN")}
                      </td>
                    </tr>

                    {expanded === s.id && (
                      <tr key={`${s.id}-detail`} className="bg-blue-50">
                        <td colSpan={8} className="px-6 py-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <DetailItem label="தந்தை / பாதுகாவலர் பெயர்" value={s.fatherName} />
                            <DetailItem label="பிறந்த தேதி" value={s.dob} />
                            <DetailItem label="மின்னஞ்சல்" value={s.email} />
                            <DetailItem label="வாட்ஸ்அப்" value={s.whatsapp} />
                            <DetailItem label="சேர்க்கை / பதிவு எண்" value={s.rollNumber} />
                            <DetailItem label="துறை / பிரிவு" value={s.department} />

                            {/* Marks */}
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">10th மதிப்பெண்</p>
                              <MarksCell marks={s.marks10th} max={s.max10th} percent={s.percent10th} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">12th மதிப்பெண்</p>
                              <MarksCell marks={s.marks12th} max={s.max12th} percent={s.percent12th} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">தற்போதைய மதிப்பெண்</p>
                              <MarksCell marks={s.marksCurrent} max={s.maxCurrent} percent={s.percentCurrent} />
                            </div>

                            <DetailItem label="கதவு எண் / தெரு" value={s.doorNo} />
                            <DetailItem label="கிராமம் / பகுதி" value={s.village} />
                            <DetailItem label="வட்டம்" value={s.taluk} />
                            <DetailItem label="பின்கோடு" value={s.pincode} />
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">மாணவர் அமைப்பு உறுப்பினர்</p>
                              <NullBadge value={s.studentWingMember} />
                            </div>
                            <DetailItem label="அமைப்பின் பெயர்" value={s.studentWingName} />
                            <DetailItem label="எப்படி அறிந்தீர்கள்" value={s.hearAboutUs} />
                            {s.remarks && (
                              <div className="sm:col-span-2 lg:col-span-3">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">கருத்துக்கள்</p>
                                <p className="text-sm text-gray-800 whitespace-pre-wrap">{s.remarks}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
            ← முந்தைய
          </button>
          <span className="text-sm text-gray-500">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
            அடுத்த →
          </button>
        </div>
      )}
    </div>
  );
}
