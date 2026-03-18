"use client";

import type { EmployeeItem, UserItem } from "./types";

interface Props {
  rows: UserItem[];
  roleMap: Map<string, string>;
  employeeMap: Map<string, EmployeeItem>;
  toDate: (value: string | null) => string;
  onEdit: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
}

function LinkBadge({ status }: { status?: UserItem["link_status"] }) {
  if (status === "conflict")
    return <span className="badge badge-warning">Konflik</span>;
  if (status === "unlinked")
    return (
      <span
        className="badge"
        style={{ background: "#f1f5f9", color: "#64748b" }}
      >
        Belum Terkait
      </span>
    );
  if (status === "linked_auto")
    return <span className="badge badge-info">Auto-linked</span>;
  return <span className="badge badge-success">Terkait</span>;
}

export default function UsersTable({
  rows,
  roleMap,
  employeeMap,
  toDate,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="mt-4 hidden overflow-x-auto rounded-xl border border-indigo-100 md:block">
      <table className="min-w-full text-sm">
        <thead className="bg-linear-to-r from-indigo-50 to-violet-50 text-left text-xs font-semibold uppercase tracking-wide text-indigo-700">
          <tr>
            <th className="px-3 py-3">Username</th>
            <th className="px-3 py-3">Email</th>
            <th className="px-3 py-3">Role</th>
            <th className="px-3 py-3">Pegawai</th>
            <th className="px-3 py-3">Status Relasi</th>
            <th className="px-3 py-3">Dibuat</th>
            <th className="px-3 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td className="px-3 py-6 text-center text-slate-500" colSpan={7}>
                Data user tidak ditemukan.
              </td>
            </tr>
          ) : (
            rows.map((user) => (
              <tr key={user.id} className="hover:bg-indigo-50/50">
                <td className="px-3 py-3 font-medium text-slate-800">
                  {user.username}
                </td>
                <td className="px-3 py-3 text-slate-600">
                  {user.email || "-"}
                </td>
                <td className="px-3 py-3 text-slate-700">
                  {(user.role_id && roleMap.get(user.role_id)) || "-"}
                </td>
                <td className="px-3 py-3 text-slate-700">
                  {(user.employee_id &&
                    employeeMap.get(user.employee_id)?.nama) ||
                    "-"}
                </td>
                <td className="px-3 py-3 text-slate-700">
                  <LinkBadge status={user.link_status} />
                </td>
                <td className="px-3 py-3 text-slate-600">
                  {toDate(user.created_at)}
                </td>
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="btn btn-edit"
                      style={{ padding: "5px 10px", fontSize: "12px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="btn btn-danger"
                      style={{ padding: "5px 10px", fontSize: "12px" }}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
