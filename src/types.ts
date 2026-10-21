export type Branch =
  | "Computer Science"
  | "Electronics"
  | "Mechanical"
  | "Civil"
  | "Electrical"
  | "Information Technology";

export const BRANCHES: Branch[] = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
  "Information Technology",
];

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  branch: Branch;
  semester: number;
  email: string;
  cgpa: number;
}

export type StudentFormValues = Omit<Student, "id">;

export type SortKey = "name" | "cgpa";
export type SortDirection = "asc" | "desc";
