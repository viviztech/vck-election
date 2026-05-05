"use client";

import { useCallback, useEffect, useState } from "react";

interface Volunteer {
  id: string;
  name: string;
  age: number | null;
  dob: string | null;
  gender: string | null;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  voterId: string | null;
  town: string | null;
  pincode: string | null;
  address: string | null;
  education: string;
  occupation: string | null;
  state: string;
  district: string;
  constituency: string;
  itKnowledge: boolean;
  videoCreation: boolean;
  imageCreation: boolean;
  itSkills: string[];
  softwareTools: string | null;
  yearsExp: number | null;
  primaryDevice: string | null;
  facebook: string | null;
  youtube: string | null;
  instagram: string | null;
  twitterX: string | null;
  followers: string | null;
  availability: string | null;
  languages: string[];
  canTravel: boolean | null;
  vckMember: boolean | null;
  priorExperience: string | null;
  hearAboutUs: string | null;
  joinReason: string;
  emergencyName: string | null;
  emergencyPhone: string | null;
  createdAt: string;
}

interface Filters {
  search: string;
  district: string;
  constituency: string;
  gender: string;
  availability: string;
  itKnowledge: string;
  videoCreation: string;
  imageCreation: string;
  vckMember: string;
  canTravel: string;
  dateFrom: string;
  dateTo: string;
}

const EMPTY_FILTERS: Filters = {
  search: "",
  district: "",
  constituency: "",
  gender: "",
  availability: "",
  itKnowledge: "",
  videoCreation: "",
  imageCreation: "",
  vckMember: "",
  canTravel: "",
  dateFrom: "",
  dateTo: "",
};

const PAGE_SIZE = 20;

const TN_DISTRICTS = [
  "அரியலூர்", "செங்கல்பட்டு", "சென்னை", "கோயம்புத்தூர்", "கடலூர்",
  "தர்மபுரி", "திண்டுக்கல்", "ஈரோடு", "கள்ளக்குறிச்சி", "கன்னியாகுமரி",
  "கரூர்", "கிருஷ்ணகிரி", "மதுரை", "மயிலாடுதுறை", "நாகப்பட்டினம்",
  "நாமக்கல்", "நீலகிரி", "பெரம்பலூர்", "புதுக்கோட்டை", "ராமநாதபுரம்",
  "ரானிப்பேட்டை", "சேலம்", "சிவகங்கை", "தேனி", "தூத்துக்குடி",
  "திருச்சிராப்பள்ளி", "திருவாரூர்", "திருவண்ணாமலை", "திருவள்ளூர்",
  "திருநெல்வேலி", "திருப்பத்தூர்", "திருப்பூர்", "வேலூர்", "விழுப்புரம்",
  "விருதுநகர்",
];

function Badge({ yes }: { yes: boolean }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        yes ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      {yes ? "ஆம்" : "இல்லை"}
    </span>
  );
}

function NullBadge({ value }: { value: boolean | null }) {
  if (value === null) return <span className="text-gray-300 text-xs">—</span>;
  return <Badge yes={value} />;
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
        </td>
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

function SelectFilter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
      >
        <option value="">அனைத்தும்</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function countActiveFilters(f: Filters): number {
  return Object.entries(f).filter(([, v]) => v !== "").length;
}

export function ItWingVolunteersClient() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
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
    if (applied.constituency) params.set("constituency", applied.constituency);
    if (applied.gender) params.set("gender", applied.gender);
    if (applied.availability) params.set("availability", applied.availability);
    if (applied.itKnowledge) params.set("itKnowledge", applied.itKnowledge);
    if (applied.videoCreation) params.set("videoCreation", applied.videoCreation);
    if (applied.imageCreation) params.set("imageCreation", applied.imageCreation);
    if (applied.vckMember) params.set("vckMember", applied.vckMember);
    if (applied.canTravel) params.set("canTravel", applied.canTravel);
    if (applied.dateFrom) params.set("dateFrom", applied.dateFrom);
    if (applied.dateTo) params.set("dateTo", applied.dateTo);

    const res = await fetch(`/api/admin/it-wing-volunteers?${params}`);
    if (res.ok) {
      const data = await res.json();
      setVolunteers(data.volunteers);
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
    if (applied.constituency) params.set("constituency", applied.constituency);
    if (applied.gender) params.set("gender", applied.gender);
    if (applied.availability) params.set("availability", applied.availability);
    if (applied.itKnowledge) params.set("itKnowledge", applied.itKnowledge);
    if (applied.videoCreation) params.set("videoCreation", applied.videoCreation);
    if (applied.imageCreation) params.set("imageCreation", applied.imageCreation);
    if (applied.vckMember) params.set("vckMember", applied.vckMember);
    if (applied.canTravel) params.set("canTravel", applied.canTravel);
    if (applied.dateFrom) params.set("dateFrom", applied.dateFrom);
    if (applied.dateTo) params.set("dateTo", applied.dateTo);
    window.location.href = `/api/admin/it-wing-volunteers?${params}`;
  }

  function setField<K extends keyof Filters>(key: K, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  const availabilityLabel: Record<string, string> = {
    full_time: "முழு நேரம்",
    part_time: "பகுதி நேரம்",
    weekends: "வார இறுதி மட்டும்",
    campaigns: "தேர்தல் காலம் மட்டும்",
  };

  const boolOptions = [
    { value: "true", label: "ஆம்" },
    { value: "false", label: "இல்லை" },
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar + Toggle */}
      <form onSubmit={handleSearch}>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-1 flex-wrap">
            <input
              type="text"
              value={draft.search}
              onChange={(e) => setField("search", e.target.value)}
              placeholder="பெயர், தொலைபேசி, மாவட்டம், மின்னஞ்சல்..."
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 w-72"
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
                <span className="bg-white text-slate-800 text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {activeCount}
                </span>
              )}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition"
            >
              தேடு
            </button>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition"
              >
                அனைத்தும் அழி
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm text-gray-500">
              மொத்தம்: <strong>{total}</strong>
            </span>
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2"
            >
              ⬇ CSV ஏற்றுமதி
            </button>
          </div>
        </div>

        {/* Advanced Filter Panel */}
        {showFilters && (
          <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              மேம்பட்ட வடிப்பு
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">

              {/* District */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">மாவட்டம்</label>
                <select
                  value={draft.district}
                  onChange={(e) => setField("district", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="">அனைத்தும்</option>
                  {TN_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Constituency */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">தொகுதி</label>
                <input
                  type="text"
                  value={draft.constituency}
                  onChange={(e) => setField("constituency", e.target.value)}
                  placeholder="தொகுதி பெயர்"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              {/* Gender */}
              <SelectFilter
                label="பாலினம்"
                value={draft.gender}
                onChange={(v) => setField("gender", v)}
                options={[
                  { value: "MALE", label: "ஆண்" },
                  { value: "FEMALE", label: "பெண்" },
                  { value: "OTHER", label: "பிற" },
                ]}
              />

              {/* Availability */}
              <SelectFilter
                label="கிடைக்கும் நேரம்"
                value={draft.availability}
                onChange={(v) => setField("availability", v)}
                options={[
                  { value: "full_time", label: "முழு நேரம்" },
                  { value: "part_time", label: "பகுதி நேரம்" },
                  { value: "weekends", label: "வார இறுதி" },
                  { value: "campaigns", label: "தேர்தல் காலம்" },
                ]}
              />

              {/* IT Knowledge */}
              <SelectFilter
                label="IT அறிவு"
                value={draft.itKnowledge}
                onChange={(v) => setField("itKnowledge", v)}
                options={boolOptions}
              />

              {/* Video Creation */}
              <SelectFilter
                label="வீடியோ உருவாக்கம்"
                value={draft.videoCreation}
                onChange={(v) => setField("videoCreation", v)}
                options={boolOptions}
              />

              {/* Image Creation */}
              <SelectFilter
                label="படம் உருவாக்கம்"
                value={draft.imageCreation}
                onChange={(v) => setField("imageCreation", v)}
                options={boolOptions}
              />

              {/* VCK Member */}
              <SelectFilter
                label="VCK உறுப்பினர்"
                value={draft.vckMember}
                onChange={(v) => setField("vckMember", v)}
                options={boolOptions}
              />

              {/* Can Travel */}
              <SelectFilter
                label="பயணிக்க முடியுமா?"
                value={draft.canTravel}
                onChange={(v) => setField("canTravel", v)}
                options={boolOptions}
              />

              {/* Date From */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">பதிவு தேதி (இருந்து)</label>
                <input
                  type="date"
                  value={draft.dateFrom}
                  onChange={(e) => setField("dateFrom", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              {/* Date To */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">பதிவு தேதி (வரை)</label>
                <input
                  type="date"
                  value={draft.dateTo}
                  onChange={(e) => setField("dateTo", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                {applied.district && (
                  <FilterChip label={`மாவட்டம்: ${applied.district}`} onRemove={() => { setField("district", ""); setApplied((p) => ({ ...p, district: "" })); }} />
                )}
                {applied.constituency && (
                  <FilterChip label={`தொகுதி: ${applied.constituency}`} onRemove={() => { setField("constituency", ""); setApplied((p) => ({ ...p, constituency: "" })); }} />
                )}
                {applied.gender && (
                  <FilterChip label={`பாலினம்: ${applied.gender === "MALE" ? "ஆண்" : applied.gender === "FEMALE" ? "பெண்" : "பிற"}`} onRemove={() => { setField("gender", ""); setApplied((p) => ({ ...p, gender: "" })); }} />
                )}
                {applied.availability && (
                  <FilterChip label={`நேரம்: ${availabilityLabel[applied.availability] ?? applied.availability}`} onRemove={() => { setField("availability", ""); setApplied((p) => ({ ...p, availability: "" })); }} />
                )}
                {applied.itKnowledge && (
                  <FilterChip label={`IT அறிவு: ${applied.itKnowledge === "true" ? "ஆம்" : "இல்லை"}`} onRemove={() => { setField("itKnowledge", ""); setApplied((p) => ({ ...p, itKnowledge: "" })); }} />
                )}
                {applied.videoCreation && (
                  <FilterChip label={`வீடியோ: ${applied.videoCreation === "true" ? "ஆம்" : "இல்லை"}`} onRemove={() => { setField("videoCreation", ""); setApplied((p) => ({ ...p, videoCreation: "" })); }} />
                )}
                {applied.imageCreation && (
                  <FilterChip label={`படம்: ${applied.imageCreation === "true" ? "ஆம்" : "இல்லை"}`} onRemove={() => { setField("imageCreation", ""); setApplied((p) => ({ ...p, imageCreation: "" })); }} />
                )}
                {applied.vckMember && (
                  <FilterChip label={`VCK உறுப்பினர்: ${applied.vckMember === "true" ? "ஆம்" : "இல்லை"}`} onRemove={() => { setField("vckMember", ""); setApplied((p) => ({ ...p, vckMember: "" })); }} />
                )}
                {applied.canTravel && (
                  <FilterChip label={`பயணம்: ${applied.canTravel === "true" ? "ஆம்" : "இல்லை"}`} onRemove={() => { setField("canTravel", ""); setApplied((p) => ({ ...p, canTravel: "" })); }} />
                )}
                {applied.dateFrom && (
                  <FilterChip label={`இருந்து: ${applied.dateFrom}`} onRemove={() => { setField("dateFrom", ""); setApplied((p) => ({ ...p, dateFrom: "" })); }} />
                )}
                {applied.dateTo && (
                  <FilterChip label={`வரை: ${applied.dateTo}`} onRemove={() => { setField("dateTo", ""); setApplied((p) => ({ ...p, dateTo: "" })); }} />
                )}
                {applied.search && (
                  <FilterChip label={`தேடல்: "${applied.search}"`} onRemove={() => { setField("search", ""); setApplied((p) => ({ ...p, search: "" })); }} />
                )}
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
                <th className="px-4 py-3 font-semibold text-gray-600">மாநிலம்</th>
                <th className="px-4 py-3 font-semibold text-gray-600">மாவட்டம்</th>
                <th className="px-4 py-3 font-semibold text-gray-600">தொகுதி</th>
                <th className="px-4 py-3 font-semibold text-gray-600">IT</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Video</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Image</th>
                <th className="px-4 py-3 font-semibold text-gray-600">தேதி</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              ) : volunteers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
                    தன்னார்வலர்கள் இல்லை
                  </td>
                </tr>
              ) : (
                volunteers.map((v, idx) => (
                  <>
                    <tr
                      key={v.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setExpanded(expanded === v.id ? null : v.id)}
                    >
                      <td className="px-4 py-3 text-gray-400">
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div>{v.name}</div>
                        <div className="text-xs text-gray-400 space-x-1">
                          {v.gender && <span>{v.gender === "MALE" ? "ஆண்" : v.gender === "FEMALE" ? "பெண்" : "பிற"}</span>}
                          {v.age && <span>• வயது {v.age}</span>}
                          {v.town && <span>• {v.town}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <div>{v.phone}</div>
                        {v.whatsapp && <div className="text-xs text-gray-400">WA: {v.whatsapp}</div>}
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-xs">
                        {v.state === "Tamil Nadu" ? "TN" : v.state}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{v.district}</td>
                      <td className="px-4 py-3 text-gray-700">{v.constituency}</td>
                      <td className="px-4 py-3"><Badge yes={v.itKnowledge} /></td>
                      <td className="px-4 py-3"><Badge yes={v.videoCreation} /></td>
                      <td className="px-4 py-3"><Badge yes={v.imageCreation} /></td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(v.createdAt).toLocaleDateString("ta-IN")}
                      </td>
                    </tr>

                    {expanded === v.id && (
                      <tr key={`${v.id}-detail`} className="bg-blue-50">
                        <td colSpan={10} className="px-6 py-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                            <DetailItem label="மின்னஞ்சல்" value={v.email} />
                            <DetailItem label="வாட்ஸ்அப்" value={v.whatsapp} />
                            <DetailItem label="வாக்காளர் அடையாள எண்" value={v.voterId} />

                            <DetailItem label="மாநிலம்" value={v.state} />
                            <DetailItem label="ஊர்" value={v.town} />
                            <DetailItem label="பின்கோடு" value={v.pincode} />
                            <DetailItem label="முகவரி" value={v.address} />

                            <DetailItem label="கல்வித்தகுதி" value={v.education} />
                            <DetailItem label="தொழில்" value={v.occupation} />
                            <DetailItem label="பிறந்த தேதி" value={v.dob} />

                            {v.itSkills.length > 0 && (
                              <div className="sm:col-span-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">IT திறன்கள்</p>
                                <div className="flex flex-wrap gap-1">
                                  {v.itSkills.map((s) => (
                                    <span key={s} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            <DetailItem label="மென்பொருள் கருவிகள்" value={v.softwareTools} />
                            <DetailItem label="IT அனுபவம்" value={v.yearsExp !== null ? `${v.yearsExp} ஆண்டுகள்` : null} />
                            <DetailItem label="முதன்மை சாதனம்" value={v.primaryDevice} />

                            <DetailItem label="Facebook" value={v.facebook} />
                            <DetailItem label="YouTube" value={v.youtube} />
                            <DetailItem label="Instagram" value={v.instagram} />
                            <DetailItem label="Twitter / X" value={v.twitterX} />
                            <DetailItem label="பின்தொடர்பவர்கள்" value={v.followers} />

                            <DetailItem label="கிடைக்கும் நேரம்" value={v.availability ? (availabilityLabel[v.availability] ?? v.availability) : null} />
                            {v.languages.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">மொழிகள்</p>
                                <p className="text-sm text-gray-800">{v.languages.join(", ")}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">பயணிக்க முடியுமா?</p>
                              <NullBadge value={v.canTravel} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">VCK உறுப்பினரா?</p>
                              <NullBadge value={v.vckMember} />
                            </div>
                            <DetailItem label="எப்படி அறிந்தீர்கள்" value={v.hearAboutUs} />

                            {v.priorExperience && (
                              <div className="sm:col-span-2 lg:col-span-3">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">முன்னர் தன்னார்வ அனுபவம்</p>
                                <p className="text-sm text-gray-800 whitespace-pre-wrap">{v.priorExperience}</p>
                              </div>
                            )}
                            <div className="sm:col-span-2 lg:col-span-3">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">இணைய காரணம்</p>
                              <p className="text-sm text-gray-800 whitespace-pre-wrap">{v.joinReason}</p>
                            </div>

                            {(v.emergencyName || v.emergencyPhone) && (
                              <div className="sm:col-span-2 lg:col-span-3">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">அவசர தொடர்பு</p>
                                <p className="text-sm text-gray-800">
                                  {[v.emergencyName, v.emergencyPhone].filter(Boolean).join(" — ")}
                                </p>
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
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            ← முந்தைய
          </button>
          <span className="text-sm text-gray-500">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            அடுத்த →
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="hover:text-red-500 transition-colors ml-0.5 font-bold"
      >
        ×
      </button>
    </span>
  );
}
