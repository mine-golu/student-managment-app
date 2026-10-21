import { useMemo, useState } from "react";
import { GraduationCap, UserPlus, X } from "lucide-react";
import type { Branch, SortDirection, Student, StudentFormValues } from "./types";
import { useStudents } from "./hooks/useStudents";
import DashboardStats from "./components/DashboardStats";
import StudentTable from "./components/StudentTable";
import StudentForm from "./components/StudentForm";
import ConfirmDialog from "./components/ConfirmDialog";

export default function App() {
  const { students, addStudent, updateStudent, deleteStudent, rollNoExists } =
    useStudents();

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "cgpa">("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Student | null>(null);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? students.filter(
          (s) =>
            s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q)
        )
      : students;

    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else cmp = a.cgpa - b.cgpa;
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [students, query, sortKey, sortDirection]);

  const handleSort = (key: "name" | "cgpa") => {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (student: Student) => {
    setEditing(student);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (values: StudentFormValues) => {
    if (editing) {
      updateStudent(editing.id, values);
    } else {
      addStudent(values);
    }
    closeForm();
  };

  const confirmDelete = () => {
    if (pendingDelete) deleteStudent(pendingDelete.id);
    setPendingDelete(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-600/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Student Manager</h1>
              <p className="text-xs text-slate-500">
                Dashboard &amp; student records
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Student</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6">
        {/* Stats */}
        <DashboardStats students={students} />

        {/* Table */}
        <StudentTable
          students={filteredSorted}
          query={query}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onQueryChange={setQuery}
          onSortChange={handleSort}
          onEdit={openEdit}
          onDelete={setPendingDelete}
        />
      </main>

      {/* Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-8">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={closeForm}
          />
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={closeForm}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
            <StudentForm
              editingStudent={editing}
              rollNoTaken={(r) => rollNoExists(r, editing?.id)}
              onSubmit={handleSubmit}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete student?"
        message={`Are you sure you want to delete ${pendingDelete?.name} (${pendingDelete?.rollNo})? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
