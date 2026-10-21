import { Search, ArrowDownUp, ArrowUp, ArrowDown, Pencil, Trash2, Inbox } from "lucide-react";
import type { Student, SortKey, SortDirection } from "../types";

interface StudentTableProps {
  students: Student[];
  query: string;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onQueryChange: (q: string) => void;
  onSortChange: (key: SortKey) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export default function StudentTable({
  students,
  query,
  sortKey,
  sortDirection,
  onQueryChange,
  onSortChange,
  onEdit,
  onDelete,
}: StudentTableProps) {
  const SortIcon = ({ active }: { active: boolean }) => {
    if (!active) return <ArrowDownUp className="h-3.5 w-3.5 text-slate-300" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-blue-600" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-blue-600" />
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Student Records</h2>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by name or roll number..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </div>

      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <Inbox className="h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            {query ? "No students match your search." : "No students added yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Roll No</th>
                <th className="px-5 py-3 font-semibold">
                  <button
                    type="button"
                    onClick={() => onSortChange("name")}
                    className="inline-flex items-center gap-1.5 hover:text-blue-600"
                  >
                    Name <SortIcon active={sortKey === "name"} />
                  </button>
                </th>
                <th className="px-5 py-3 font-semibold">Branch</th>
                <th className="px-5 py-3 font-semibold">Semester</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">
                  <button
                    type="button"
                    onClick={() => onSortChange("cgpa")}
                    className="inline-flex items-center gap-1.5 hover:text-blue-600"
                  >
                    CGPA <SortIcon active={sortKey === "cgpa"} />
                  </button>
                </th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((s) => (
                <tr key={s.id} className="transition hover:bg-blue-50/40">
                  <td className="px-5 py-3.5 font-medium text-slate-700">{s.rollNo}</td>
                  <td className="px-5 py-3.5 text-slate-800">{s.name}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {s.branch}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{s.semester}</td>
                  <td className="px-5 py-3.5 text-slate-500">{s.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-800">{s.cgpa.toFixed(2)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(s)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(s)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
