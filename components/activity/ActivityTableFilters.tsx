"use client";

interface Props {
  search: string;
  loading?: boolean;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}

export default function ActivityTableFilters({
  search,
  loading = false,
  onSearchChange,
  onRefresh,
}: Props) {
  return (
    <div className="mb-3 grid gap-3 sm:grid-cols-[1fr_auto]">
      <input
        type="text"
        placeholder="Cari user, aksi, dan deskripsi..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="input"
      />
      <button onClick={onRefresh} disabled={loading} className="btn btn-accent">
        {loading ? "Memuat..." : "Refresh"}
      </button>
    </div>
  );
}
