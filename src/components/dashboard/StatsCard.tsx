interface Props {
  title: string;
  value: number;
  icon: string;
  color: "blue" | "green" | "yellow" | "red";
}

const colorMap = {
  blue: "bg-blue-50 border-blue-100 text-blue-900",
  green: "bg-green-50 border-green-100 text-green-900",
  yellow: "bg-yellow-50 border-yellow-100 text-yellow-900",
  red: "bg-red-50 border-red-100 text-red-900",
};

export function StatsCard({ title, value, icon, color }: Props) {
  return (
    <div className={`rounded-xl border p-5 ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold">{value.toLocaleString()}</span>
      </div>
      <p className="text-sm font-medium mt-2 opacity-80">{title}</p>
    </div>
  );
}
