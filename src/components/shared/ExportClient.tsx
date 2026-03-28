"use client";

import { useState } from "react";

interface District {
  id: string;
  nameEnglish: string;
  nameTamil: string;
}

export function ExportClient({ districts }: { districts: District[] }) {
  const [districtId, setDistrictId] = useState("");
  const [verified, setVerified] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          districtId: districtId || undefined,
          isVerified: verified === "" ? undefined : verified === "true",
        }),
      });

      if (!res.ok) {
        alert("Export failed. Please try again.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vck-entries-${Date.now()}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filter by District
        </label>
        <select
          value={districtId}
          onChange={(e) => setDistrictId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Districts</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nameTamil} ({d.nameEnglish})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Verification Status
        </label>
        <select
          value={verified}
          onChange={(e) => setVerified(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Entries</option>
          <option value="true">Verified Only</option>
          <option value="false">Unverified Only</option>
        </select>
      </div>

      <button
        onClick={handleExport}
        disabled={loading}
        className="w-full py-3 px-4 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">⟳</span>
            Generating Excel...
          </>
        ) : (
          <>
            <span>⬇️</span>
            Download Excel (.xlsx)
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Tamil text (Unicode) is preserved in the Excel file. Open with LibreOffice or Excel.
      </p>
    </div>
  );
}
