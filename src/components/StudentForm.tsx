import { useEffect, useState } from "react";
import { Save, X, GraduationCap } from "lucide-react";
import type { Branch, Student, StudentFormValues } from "../types";
import { BRANCHES } from "../types";
import { validateStudent, type FormErrors } from "../validation";

interface StudentFormProps {
  editingStudent: Student | null;
  rollNoTaken: (rollNo: string) => boolean;
  onSubmit: (values: StudentFormValues) => void;
  onCancel: () => void;
}

function getEmptyValues(): StudentFormValues {
  return {
    name: "",
    rollNo: "",
    branch: "Computer Science",
    semester: 1,
    email: "",
    cgpa: NaN,
  };
}

export default function StudentForm({
  editingStudent,
  rollNoTaken,
  onSubmit,
  onCancel,
}: StudentFormProps) {
  const [values, setValues] = useState<StudentFormValues>(getEmptyValues);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (editingStudent) {
      const { id: _id, ...rest } = editingStudent;
      void _id;
      setValues(rest);
    } else {
      setValues(getEmptyValues());
    }
    setErrors({});
  }, [editingStudent]);

  const handleChange = (field: keyof StudentFormValues, value: string | number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleNumberChange = (field: "semester" | "cgpa", raw: string) => {
    if (raw.trim() === "") {
      handleChange(field, NaN);
    } else {
      handleChange(field, Number(raw));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const checkRoll = (roll: string) => rollNoTaken(roll);
    const nextErrors = validateStudent(values, checkRoll);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSubmit({
      ...values,
      name: values.name.trim(),
      rollNo: values.rollNo.trim(),
      email: values.email.trim(),
      cgpa: Number(values.cgpa),
      semester: Number(values.semester),
    });
  };

  const fieldClass = (field: keyof StudentFormValues) =>
    `w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 ${
      errors[field] ? "border-red-400 bg-red-50/40" : "border-slate-200"
    }`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-4 text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">
            {editingStudent ? "Edit Student" : "Add New Student"}
          </h2>
          <p className="text-sm text-blue-100">
            {editingStudent
              ? "Update the student's information."
              : "Fill in the details to enroll a new student."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full Name" error={errors.name}>
          <input
            type="text"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Aarav Sharma"
            className={fieldClass("name")}
          />
        </Field>

        <Field label="Roll Number" error={errors.rollNo}>
          <input
            type="text"
            value={values.rollNo}
            onChange={(e) => handleChange("rollNo", e.target.value)}
            placeholder="e.g. CS21B001"
            className={fieldClass("rollNo")}
          />
        </Field>

        <Field label="Branch" error={errors.branch}>
          <select
            value={values.branch}
            onChange={(e) => handleChange("branch", e.target.value as Branch)}
            className={fieldClass("branch")}
          >
            {BRANCHES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Semester" error={errors.semester}>
          <input
            type="number"
            min={1}
            max={8}
            value={Number.isNaN(values.semester) ? "" : values.semester}
            onChange={(e) => handleNumberChange("semester", e.target.value)}
            className={fieldClass("semester")}
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="e.g. aarav@university.edu"
            className={fieldClass("email")}
          />
        </Field>

        <Field label="CGPA (0–10)" error={errors.cgpa}>
          <input
            type="number"
            min={0}
            max={10}
            step={0.01}
            value={Number.isNaN(values.cgpa) ? "" : values.cgpa}
            onChange={(e) => handleNumberChange("cgpa", e.target.value)}
            className={fieldClass("cgpa")}
          />
        </Field>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <X className="h-4 w-4" /> Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <Save className="h-4 w-4" />
          {editingStudent ? "Save Changes" : "Add Student"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </label>
      {children}
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
