"use client";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  filterUnit: string;
  onFilterUnit: (v: string) => void;
  sortOrder: "newest" | "oldest" | "asc" | "desc";
  onSortOrder: (v: "newest" | "oldest" | "asc" | "desc") => void;
  unitOptions: string[];
}

export default function EmployeeToolbar({
  search,
  onSearch,
  filterUnit,
  onFilterUnit,
  sortOrder,
  onSortOrder,
  unitOptions,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        className="input"
        style={{ flex: 1, minWidth: "200px" }}
        placeholder="Cari nama, NIP, jabatan, unit..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

      <select
        className="select"
        value={filterUnit}
        onChange={(e) => onFilterUnit(e.target.value)}
      >
        <option value="">Semua Unit</option>
        {unitOptions.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>

      <select
        className="select"
        value={sortOrder}
        onChange={(e) =>
          onSortOrder(e.target.value as "newest" | "oldest" | "asc" | "desc")
        }
      >
        <option value="newest">Terbaru</option>
        <option value="oldest">Terlama</option>
        <option value="asc">Nama A → Z</option>
        <option value="desc">Nama Z → A</option>
      </select>
    </div>
  );
}
