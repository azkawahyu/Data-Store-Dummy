import type {
  EmployeeItem,
  RoleItem,
  UserFormErrors,
  UserFormState,
} from "@/components/register/types";

interface RegisterFormProps {
  form: UserFormState;
  errors: UserFormErrors;
  roles: RoleItem[];
  employees: EmployeeItem[];
  autoLinkHint: string;
  showAdminFields: boolean;
  submitLabel?: string;
  submitting: boolean;
  onChangeField: (field: keyof UserFormState, value: string) => void;
  onBlurField: (field: keyof UserFormState) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function RegisterForm({
  form,
  errors,
  roles,
  employees,
  autoLinkHint,
  showAdminFields,
  submitLabel,
  submitting,
  onChangeField,
  onBlurField,
  onSubmit,
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Username
        </label>
        <input
          id="username"
          value={form.username}
          onChange={(event) => onChangeField("username", event.target.value)}
          onBlur={() => onBlurField("username")}
          placeholder="Masukkan username"
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${
            errors.username ? "border-rose-300" : "border-slate-300"
          }`}
          required
        />
        {errors.username ? (
          <p className="mt-1 text-xs text-rose-600">{errors.username}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="nip"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          NIP
        </label>
        <input
          id="nip"
          value={form.nip}
          onChange={(event) => onChangeField("nip", event.target.value)}
          onBlur={() => onBlurField("nip")}
          placeholder="Masukkan NIP"
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${
            errors.nip ? "border-rose-300" : "border-slate-300"
          }`}
          required
        />
        {errors.nip ? (
          <p className="mt-1 text-xs text-rose-600">{errors.nip}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(event) => onChangeField("email", event.target.value)}
          onBlur={() => onBlurField("email")}
          placeholder="Masukkan email"
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${
            errors.email ? "border-rose-300" : "border-slate-300"
          }`}
          required
        />
        {errors.email ? (
          <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={(event) => onChangeField("password", event.target.value)}
          onBlur={() => onBlurField("password")}
          placeholder="Masukkan password"
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${
            errors.password ? "border-rose-300" : "border-slate-300"
          }`}
          required
        />
        {errors.password ? (
          <p className="mt-1 text-xs text-rose-600">{errors.password}</p>
        ) : null}
      </div>

      {showAdminFields ? (
        <>
          <div>
            <label
              htmlFor="role_id"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Role
            </label>
            <select
              id="role_id"
              value={form.role_id}
              onChange={(event) => onChangeField("role_id", event.target.value)}
              onBlur={() => onBlurField("role_id")}
              className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${
                errors.role_id ? "border-rose-300" : "border-slate-300"
              }`}
              required
            >
              <option value="">Pilih role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.role_id ? (
              <p className="mt-1 text-xs text-rose-600">{errors.role_id}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="employee_id"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Pegawai <span className="text-slate-400">(opsional)</span>
            </label>
            <select
              id="employee_id"
              value={form.employee_id}
              onChange={(event) =>
                onChangeField("employee_id", event.target.value)
              }
              onBlur={() => onBlurField("employee_id")}
              className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${
                errors.employee_id ? "border-rose-300" : "border-slate-300"
              }`}
            >
              <option value="">Tidak terkait pegawai</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.nama} ({employee.nip})
                </option>
              ))}
            </select>
            {autoLinkHint ? (
              <p
                className={`mt-1 text-xs ${
                  autoLinkHint.toLowerCase().includes("konflik")
                    ? "text-amber-700"
                    : autoLinkHint.toLowerCase().includes("belum")
                      ? "text-slate-500"
                      : "text-indigo-700"
                }`}
              >
                {autoLinkHint}
              </p>
            ) : null}
            {errors.employee_id ? (
              <p className="mt-1 text-xs text-rose-600">{errors.employee_id}</p>
            ) : null}
          </div>
        </>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="h-11 w-full rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Mendaftarkan..." : (submitLabel ?? "Daftarkan User")}
      </button>
    </form>
  );
}
