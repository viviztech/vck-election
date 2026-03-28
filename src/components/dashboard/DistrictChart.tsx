"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  data: { name: string; count: number }[];
}

export function DistrictChart({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-800 mb-4">Entries by District</h3>
      {data.length === 0 ? (
        <div className="h-52 flex items-center justify-center text-gray-400 text-sm">
          No data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" fill="#1e3a5f" radius={[4, 4, 0, 0]} name="Entries" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
