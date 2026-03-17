interface Props {
  search: string;
  onSearch: (v: string) => void;
  filterUnit: string;
  onFilterUnit: (v: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrder: (v: "asc" | "desc") => void;
  unitOptions: string[];
  canManage: boolean;
  onAdd: () => void;
}

export default function EmployeeToolbar({
  search,
  onSearch,
  filterUnit,
  onFilterUnit,
  sortOrder,
  onSortOrder,
  unitOptions,
  canManage,
  onAdd,
}: Props) {
  return (
    <>
      <style>{`
        .emp-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          justify-content: space-between;
        }
        .emp-toolbar-left {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          flex: 1;
          min-width: 0;
        }
        .emp-toolbar-right {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        .emp-search {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 14px;
          outline: none;
          min-width: 200px;
          flex: 1;
          transition: border-color .2s;
        }
        .emp-search:focus { border-color: #94a3b8; }
        .emp-select {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 13px;
          outline: none;
          background: white;
          cursor: pointer;
        }
        .emp-select:focus { border-color: #94a3b8; }
        .emp-btn {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          background: white;
          white-space: nowrap;
          transition: background .15s;
        }
        .emp-btn:hover { background: #f1f5f9; }
        .emp-btn-primary {
          background: #0f172a;
          color: white;
          border-color: #0f172a;
        }
        .emp-btn-primary:hover { background: #1e293b; }

        @media (max-width: 640px) {
          .emp-search { min-width: unset; width: 100%; }
          .emp-toolbar-left { width: 100%; }
        }
      `}</style>

      <div className="emp-toolbar">
        <div className="emp-toolbar-left">
          <input
            type="text"
            className="emp-search"
            placeholder="Cari nama, NIP, jabatan, unit..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />

          <select
            className="emp-select"
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
        </div>

        <div className="emp-toolbar-right">
          <button
            className="emp-btn"
            onClick={() => onSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "A → Z" : "Z → A"}
          </button>

          {canManage && (
            <button className="emp-btn emp-btn-primary" onClick={onAdd}>
              + Tambah Pegawai
            </button>
          )}
        </div>
      </div>
    </>
  );
}
