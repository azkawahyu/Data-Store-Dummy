"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Employee {
  id: number;
  nama: string;
  jabatan: string;
}

interface Props {
  employees: Employee[];
}

type SortOrder = "asc" | "desc";

export default function EmployeeList({ employees }: Props) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!searchBoxRef.current) return;
      if (!searchBoxRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const displayedEmployees = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();

    const filtered = employees.filter(
      (emp) =>
        emp.nama.toLowerCase().includes(keyword) ||
        emp.jabatan.toLowerCase().includes(keyword),
    );

    filtered.sort((a, b) => {
      const cmp = a.nama.localeCompare(b.nama, "id", { sensitivity: "base" });
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return filtered;
  }, [employees, debouncedSearch, sortOrder]);

  return (
    <div style={{ marginTop: "30px", minWidth: 0 }}>
      <style>{`
        .employee-toolbar {
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          gap: 12px;
          flex-wrap: wrap;
        }

        .employee-toolbar-actions {
          display: flex;
          gap: 8px;
          position: relative;
          margin-left: auto;
        }

        .employee-head,
        .employee-row {
          display: grid;
          grid-template-columns: minmax(140px, 220px) 1px minmax(0, 1fr);
          column-gap: 16px;
          align-items: center;
        }

        .employee-head {
          padding: 8px 12px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
          font-size: 13px;
          color: #334155;
        }

        .employee-row {
          border-bottom: 1px solid #ccc;
          padding: 10px 12px;
          box-sizing: border-box;
        }

        .employee-divider {
          width: 1px;
          height: 16px;
          background: #cbd5e1;
        }

        .employee-cell {
          min-width: 0;
        }

        .employee-label {
          display: none;
          margin-bottom: 4px;
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }

        .employee-value {
          display: block;
          font-size: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 768px) {
          .employee-toolbar {
            align-items: stretch;
          }

          .employee-toolbar-actions {
            width: 100%;
            justify-content: flex-end;
          }

          .employee-head {
            display: none;
          }

          .employee-row {
            grid-template-columns: 1fr;
            gap: 10px;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            margin-bottom: 10px;
            background: white;
          }

          .employee-divider {
            display: none;
          }

          .employee-label {
            display: block;
          }

          .employee-value {
            white-space: normal;
            overflow: visible;
            text-overflow: unset;
            word-break: break-word;
          }

          .employee-search-popover {
            left: 0;
            right: 0;
            width: auto !important;
          }
        }
      `}</style>

      <div className="employee-toolbar">
        <div>
          <h2 style={{ margin: 0 }}>Data Pegawai</h2>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>
            Daftar nama dan jabatan pegawai
          </p>
        </div>

        <div ref={searchBoxRef} className="employee-toolbar-actions">
          <button
            type="button"
            onClick={() => setSearchOpen((p) => !p)}
            title="Cari"
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: "8px 10px",
              background: "white",
              cursor: "pointer",
            }}
          >
            🔍
          </button>

          <button
            type="button"
            onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
            title="Urutkan"
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: "8px 10px",
              background: "white",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {sortOrder === "asc" ? "A-Z" : "Z-A"}
          </button>

          {searchOpen && (
            <div
              className="employee-search-popover"
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                width: 260,
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                padding: 10,
                zIndex: 20,
              }}
            >
              <input
                autoFocus
                type="text"
                placeholder="Cari nama/jabatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  padding: "8px 10px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="employee-head">
        <div>Nama</div>
        <div className="employee-divider" aria-hidden />
        <div>Jabatan</div>
      </div>

      {displayedEmployees.map((emp) => (
        <div key={emp.id} className="employee-row">
          <div className="employee-cell">
            <span className="employee-label">Nama</span>
            <span className="employee-value" title={emp.nama}>
              {emp.nama}
            </span>
          </div>

          <div className="employee-divider" aria-hidden />

          <div className="employee-cell">
            <span className="employee-label">Jabatan</span>
            <span className="employee-value">{emp.jabatan}</span>
          </div>
        </div>
      ))}

      {displayedEmployees.length === 0 && (
        <p style={{ marginTop: 12, color: "#64748b" }}>Data tidak ditemukan.</p>
      )}
    </div>
  );
}
