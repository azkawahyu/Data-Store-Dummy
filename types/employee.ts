export type Employee = {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  unit: string;
  status: "Tetap" | "Kontrak";
  alamat: string;
  no_hp: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type EmployeeForm = Omit<Employee, "id" | "created_at" | "updated_at">;
