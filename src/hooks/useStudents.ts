import { useCallback, useEffect, useState } from "react";
import type { Student, StudentFormValues } from "../types";

const STORAGE_KEY = "sms.students.v1";

function loadStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Student[]) : [];
  } catch {
    return [];
  }
}

function saveStudents(students: Student[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>(() => loadStudents());

  useEffect(() => {
    saveStudents(students);
  }, [students]);

  const addStudent = useCallback((values: StudentFormValues) => {
    const newStudent: Student = { ...values, id: crypto.randomUUID() };
    setStudents((prev) => [...prev, newStudent]);
    return newStudent;
  }, []);

  const updateStudent = useCallback((id: string, values: StudentFormValues) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...values, id } : s))
    );
  }, []);

  const deleteStudent = useCallback((id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const rollNoExists = useCallback(
    (rollNo: string, exceptId?: string) =>
      students.some(
        (s) => s.rollNo.toLowerCase() === rollNo.toLowerCase() && s.id !== exceptId
      ),
    [students]
  );

  return { students, addStudent, updateStudent, deleteStudent, rollNoExists };
}
