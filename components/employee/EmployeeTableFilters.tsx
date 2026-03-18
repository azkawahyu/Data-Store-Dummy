"use client";

interface Props {
  search: string;
  filterUnit: string;
  sortOrder: string;
  unitOptions: string[];
  loading?: boolean;
  onSearch: (v: string) => void;
  onFilterUnit: (v: string) => void;
  onSortOrder: (v: string) => void;
  onRefresh: () => void;
}

export default function EmployeeTableFilters({
  search,
  filterUnit,
  sortOrder,
  unitOptions,
  loading = false,
  onSearch,
  onFilterUnit,
  onSortOrder,
  onRefresh,
}: Props) {
  return (
    <div className="mb-3 grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_220px_160px_auto]">
      <input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Cari NIP, nama, jabatan, unit..."
        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-indigo-400"
      />

      <select
        value={filterUnit}
        onChange={(e) => onFilterUnit(e.target.value)}
        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-indigo-400"
      >
        <option value="">Semua Unit</option>
        {unitOptions.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>

      <select
        value={sortOrder}
        onChange={(e) => onSortOrder(e.target.value)}
        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-indigo-400"
      >
        <option value="newest">Terbaru</option>
        <option value="oldest">Terlama</option>
        <option value="az">Nama A-Z</option>
        <option value="za">Nama Z-A</option>
      </select>

      {/* <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="h-10 rounded-lg bg-linear-to-r from-indigo-500 to-violet-500 px-4 text-sm font-semibold text-white shadow-sm hover:from-indigo-600 hover:to-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Memuat..." : "Refresh"}
      </button> */}
    </div>
  );
}
