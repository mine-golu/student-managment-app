import { Users, TrendingUp, BarChart3, Layers } from "lucide-react";
import type { Student } from "../types";

interface DashboardStatsProps {
  students: Student[];
}

export default function DashboardStats({ students }: DashboardStatsProps) {
  const total = students.length;
  const avgCgpa =
    total === 0
      ? 0
      : students.reduce((sum, s) => sum + s.cgpa, 0) / total;

  const perBranch = students.reduce<Record<string, number>>((acc, s) => {
    acc[s.branch] = (acc[s.branch] ?? 0) + 1;
    return acc;
  }, {});

  const topBranch = Object.entries(perBranch).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] ?? "—";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Students"
        value={String(total)}
        icon={<Users className="h-5 w-5" />}
        tone="blue"
      />
      <StatCard
        label="Average CGPA"
        value={avgCgpa.toFixed(2)}
        icon={<TrendingUp className="h-5 w-5" />}
        tone="emerald"
      />
      <StatCard
        label="Branches Represented"
        value={String(Object.keys(perBranch).length)}
        icon={<Layers className="h-5 w-5" />}
        tone="amber"
      />
      <StatCard
        label="Top Branch"
        value={topBranch}
        icon={<BarChart3 className="h-5 w-5" />}
        tone="violet"
      />
    </div>
  );
}

const tones: Record<string, string> = {
  blue: "from-blue-600 to-sky-500 shadow-blue-600/20",
  emerald: "from-emerald-600 to-teal-500 shadow-emerald-600/20",
  amber: "from-amber-500 to-orange-500 shadow-amber-500/20",
  violet: "from-violet-600 to-fuchsia-500 shadow-violet-600/20",
};

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: keyof typeof tones | string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </span>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );
}
