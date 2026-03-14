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
    <div style={{ marginTop: "30px" }}>
      <div
        style={{
          marginBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Data Pegawai</h2>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>
            Daftar nama dan jabatan pegawai
          </p>
        </div>

        <div
          ref={searchBoxRef}
          style={{ display: "flex", gap: 8, position: "relative" }}
        >
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

      <div
        style={{
          padding: "8px 12px",
          display: "grid",
          gridTemplateColumns: "220px 1px 1fr",
          columnGap: "16px",
          alignItems: "center",
          background: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          borderBottom: "1px solid #e2e8f0",
          fontWeight: 600,
          fontSize: 13,
          color: "#334155",
        }}
      >
        <div>Nama</div>
        <div
          aria-hidden
          style={{ width: 1, height: 14, background: "#cbd5e1" }}
        />
        <div>Jabatan</div>
      </div>

      {displayedEmployees.map((emp) => (
        <div
          key={emp.id}
          style={{
            borderBottom: "1px solid #ccc",
            padding: "10px 12px",
            boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns: "220px 1px 1fr",
            alignItems: "center",
            columnGap: "16px",
          }}
        >
          <div
            title={emp.nama}
            style={{
              fontSize: "16px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {emp.nama}
          </div>

          <div
            aria-hidden
            style={{ width: 1, height: 16, backgroundColor: "#cbd5e1" }}
          />

          <div
            style={{
              fontSize: "16px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {emp.jabatan}
          </div>
        </div>
      ))}

      {displayedEmployees.length === 0 && (
        <p style={{ marginTop: 12, color: "#64748b" }}>Data tidak ditemukan.</p>
      )}
    </div>
  );
}
