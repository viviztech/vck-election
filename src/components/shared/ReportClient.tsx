"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
  district: { nameTamil: string; nameEnglish: string };
}

interface Entry {
  id: string;
  serialNumber?: string | null;
  name?: string | null;
  partyPosition?: string | null;
  contactNumber?: string | null;
  forThalaivar?: string | null;
  constituency?: { nameTamil: string; nameEnglish: string } | null;
  district?: { nameTamil: string; nameEnglish: string } | null;
}

interface Props {
  entries: Entry[];
  districts: District[];
  constituencies: Constituency[];
  selectedConstituencyId: string;
  selectedDistrictId: string;
}

export function ReportClient({
  entries,
  districts,
  constituencies,
  selectedConstituencyId,
  selectedDistrictId,
}: Props) {
  const router = useRouter();
  const [districtId, setDistrictId] = useState(selectedDistrictId);
  const [constituencyId, setConstituencyId] = useState(selectedConstituencyId);

  const filteredConstituencies = districtId
    ? constituencies.filter((c) => c.districtId === districtId)
    : constituencies;

  function applyFilter() {
    const params = new URLSearchParams();
    if (constituencyId) params.set("constituencyId", constituencyId);
    else if (districtId) params.set("districtId", districtId);
    router.push(`/report?${params.toString()}`);
  }

  // Group entries by constituency for print
  const grouped = entries.reduce<Record<string, { label: string; rows: Entry[] }>>((acc, e) => {
    const key = e.constituency?.nameTamil ?? "தொகுதி தெரியவில்லை";
    if (!acc[key]) acc[key] = { label: key, rows: [] };
    acc[key].rows.push(e);
    return acc;
  }, {});

  const groupKeys = Object.keys(grouped);

  const selectedConstituency = constituencies.find((c) => c.id === selectedConstituencyId);
  const selectedDistrict = districts.find((d) => d.id === districtId);

  return (
    <>
      {/* Screen: filter bar + print button */}
      <div className="print:hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-700">← Back</Link>
          <h1 className="text-base font-semibold text-gray-900 tamil-text">அறிக்கை (Report)</h1>
          {entries.length > 0 && (
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition"
            >
              PDF ஆக பதிவிறக்கு
            </button>
          )}
          {entries.length === 0 && <div />}
        </div>

        <div className="p-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 tamil-text">தொகுதி தேர்வு செய்யவும்</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 tamil-text">மாவட்டம் (District)</label>
              <select
                value={districtId}
                onChange={(e) => { setDistrictId(e.target.value); setConstituencyId(""); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">அனைத்து மாவட்டங்கள்</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.nameTamil} ({d.nameEnglish})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 tamil-text">தொகுதி (Constituency)</label>
              <select
                value={constituencyId}
                onChange={(e) => setConstituencyId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- தொகுதி தேர்வு --</option>
                {filteredConstituencies.map((c) => (
                  <option key={c.id} value={c.id}>{c.nameTamil} ({c.nameEnglish})</option>
                ))}
              </select>
            </div>

            <button
              onClick={applyFilter}
              disabled={!districtId && !constituencyId}
              className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-40 transition"
            >
              அறிக்கை காட்டு
            </button>
          </div>

          {entries.length > 0 && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-blue-800 tamil-text font-medium">
                {selectedConstituency
                  ? `${selectedConstituency.nameTamil} — ${entries.length} பதிவுகள்`
                  : selectedDistrict
                  ? `${selectedDistrict.nameTamil} — ${entries.length} பதிவுகள்`
                  : `${entries.length} பதிவுகள்`}
              </span>
              <button
                onClick={() => window.print()}
                className="text-sm px-4 py-1.5 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800"
              >
                PDF பதிவிறக்கு
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Print view */}
      {entries.length > 0 && (
        <div className="hidden print:block print-report">
          {groupKeys.map((key) => {
            const group = grouped[key];
            return (
              <div key={key} className="page-group">
                {/* Page header */}
                <div className="report-header">
                  <div className="report-logo-area">
                    <img src="/logo.png" alt="VCK" className="report-logo" />
                  </div>
                  <div className="report-title-area">
                    <h1 className="report-party-name">விடுதலைச் சிறுத்தைகள் கட்சி</h1>
                    <h2 className="report-constituency">{key}</h2>
                    <p className="report-subtitle">உறுப்பினர் பட்டியல் — 2026</p>
                  </div>
                </div>

                <table className="report-table">
                  <thead>
                    <tr>
                      <th className="col-sno">வ.எண்</th>
                      <th className="col-serial">வரிசை எண்</th>
                      <th className="col-name">பெயர்</th>
                      <th className="col-position">பொறுப்பு நிலை</th>
                      <th className="col-contact">தொடர்பு எண்</th>
                      <th className="col-thalaivar">தலைவருக்காக</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((entry, idx) => (
                      <tr key={entry.id}>
                        <td className="col-sno">{idx + 1}</td>
                        <td className="col-serial">{entry.serialNumber ?? "—"}</td>
                        <td className="col-name">{entry.name ?? "—"}</td>
                        <td className="col-position">{entry.partyPosition ?? "—"}</td>
                        <td className="col-contact">{entry.contactNumber ?? "—"}</td>
                        <td className="col-thalaivar">{entry.forThalaivar ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="report-footer">
                  <span>மொத்தம்: {group.rows.length} பதிவுகள்</span>
                  <span>அச்சிட்ட நாள்: {new Date().toLocaleDateString("ta-IN")}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body * { visibility: hidden; }
          .print-report, .print-report * { visibility: visible; }
          .print-report { position: absolute; top: 0; left: 0; width: 100%; }
        }

        .page-group { page-break-after: always; }
        .page-group:last-child { page-break-after: avoid; }

        .report-header {
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 3px solid #1e3a5f;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .report-logo { width: 64px; height: 64px; object-fit: contain; }
        .report-party-name {
          font-size: 16pt;
          font-weight: 700;
          color: #1e3a5f;
          margin: 0 0 4px 0;
        }
        .report-constituency {
          font-size: 14pt;
          font-weight: 700;
          color: #b45309;
          margin: 0 0 2px 0;
        }
        .report-subtitle {
          font-size: 10pt;
          color: #6b7280;
          margin: 0;
        }

        .report-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9pt;
        }
        .report-table th {
          background: #1e3a5f;
          color: white;
          padding: 6px 8px;
          text-align: left;
          font-weight: 600;
          border: 1px solid #1e3a5f;
        }
        .report-table td {
          padding: 5px 8px;
          border: 1px solid #d1d5db;
          vertical-align: top;
        }
        .report-table tr:nth-child(even) td { background: #f9fafb; }
        .col-sno { width: 5%; text-align: center; }
        .col-serial { width: 10%; }
        .col-name { width: 25%; }
        .col-position { width: 20%; }
        .col-contact { width: 15%; }
        .col-thalaivar { width: 25%; }

        .report-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          font-size: 8pt;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
          padding-top: 6px;
        }
      `}</style>
    </>
  );
}
