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
