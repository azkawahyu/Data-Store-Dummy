export type UserItem = {
  id: string;
  username: string;
  nip: string | null;
  email: string | null;
  role_id: string | null;
  employee_id: string | null;
  created_at: string | null;
  link_status?: "linked_manual" | "linked_auto" | "unlinked" | "conflict";
  link_message?: string;
};

export type RoleItem = {
  id: string;
  name: string;
};

export type EmployeeItem = {
  id: string;
  nama: string;
  nip: string;
  email?: string | null;
};

export type UserFormState = {
  username: string;
  nip: string;
  email: string;
  password: string;
  role_id: string;
  employee_id: string;
};

export type UserFormErrors = Partial<Record<keyof UserFormState, string>>;

export type UsersStats = {
  total: number;
  admin: number;
  hr: number;
  employee: number;
  unlinked: number;
  conflict: number;
};
