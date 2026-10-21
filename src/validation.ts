import type { StudentFormValues } from "./types";

export type FormErrors = Partial<Record<keyof StudentFormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateStudent(
  values: StudentFormValues,
  rollNoTaken: (rollNo: string) => boolean
): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!values.rollNo.trim()) {
    errors.rollNo = "Roll number is required.";
  } else if (rollNoTaken(values.rollNo.trim())) {
    errors.rollNo = "A student with this roll number already exists.";
  }

  if (!values.branch) {
    errors.branch = "Branch is required.";
  }

  if (
    values.semester === undefined ||
    values.semester === null ||
    Number.isNaN(values.semester)
  ) {
    errors.semester = "Semester is required.";
  } else if (values.semester < 1 || values.semester > 8) {
    errors.semester = "Semester must be between 1 and 8.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (values.cgpa === undefined || values.cgpa === null || Number.isNaN(values.cgpa)) {
    errors.cgpa = "CGPA is required.";
  } else if (values.cgpa < 0 || values.cgpa > 10) {
    errors.cgpa = "CGPA must be between 0 and 10.";
  }

  return errors;
}
