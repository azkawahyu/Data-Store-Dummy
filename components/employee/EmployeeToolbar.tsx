interface Props {
  search: string;
  onSearch: (v: string) => void;
  filterUnit: string;
  onFilterUnit: (v: string) => void;
  sortOrder: "newest" | "oldest" | "asc" | "desc";
  onSortOrder: (v: "newest" | "oldest" | "asc" | "desc") => void;
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
          border: 1.5px solid #c7d2fe;
          border-radius: 9px;
          padding: 8px 12px;
          font-size: 13.5px;
          outline: none;
          min-width: 200px;
          flex: 1;
          transition: border-color .2s, box-shadow .2s;
          background: #fafaff;
        }
        .emp-search::placeholder { color: #a5b4fc; }
        .emp-search:focus {
          border-color: #818cf8;
          box-shadow: 0 0 0 3px rgba(129,140,248,.15);
        }
        .emp-select {
          border: 1.5px solid #c7d2fe;
          border-radius: 9px;
          padding: 8px 10px;
          font-size: 13px;
          outline: none;
          background: #fafaff;
          cursor: pointer;
          color: #4338ca;
          font-weight: 600;
          transition: border-color .2s;
        }
        .emp-select:focus { border-color: #818cf8; }
        .emp-btn-add {
          border: none;
          border-radius: 9px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          background: linear-gradient(135deg,#6366f1 0%,#7c3aed 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(99,102,241,.3);
          transition: opacity .15s, transform .1s;
        }
        .emp-btn-add:hover {
          opacity: .92;
          transform: translateY(-1px);
        }

        @media (max-width: 640px) {
          .emp-search { min-width: unset; width: 100%; }
          .emp-toolbar-left { width: 100%; }
          .emp-toolbar-right { width: 100%; }
          .emp-btn-add { width: 100%; text-align: center; }
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
          <select
            className="emp-select"
            value={sortOrder}
            onChange={(e) =>
              onSortOrder(
                e.target.value as "newest" | "oldest" | "asc" | "desc",
              )
            }
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="asc">Nama A → Z</option>
            <option value="desc">Nama Z → A</option>
          </select>

          {canManage && (
            <button className="emp-btn-add" onClick={onAdd}>
              + Tambah Pegawai
            </button>
          )}
        </div>
      </div>
    </>
  );
}
