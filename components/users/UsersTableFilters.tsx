"use client";

import type { RoleItem } from "./types";

interface Props {
  search: string;
  roleFilter: string;
  roles: RoleItem[];
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
}

export default function UsersTableFilters({
  search,
  roleFilter,
  roles,
  onSearchChange,
  onRoleFilterChange,
}: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_240px]">
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Cari username, email, role, pegawai..."
        className="input"
      />
      <select
        value={roleFilter}
        onChange={(event) => onRoleFilterChange(event.target.value)}
        className="select"
      >
        <option value="all">Semua Role</option>
        {roles.map((role) => (
          <option key={role.id} value={role.name}>
            {role.name}
          </option>
        ))}
      </select>
    </div>
  );
}
