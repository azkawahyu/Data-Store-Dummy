"use client";

import { useEffect, useMemo, useState } from "react";
import DocumentDetailModal from "@/components/documents/DocumentDetailModal";
import DocumentsStats from "@/components/documents/DocumentsStats";
import DocumentsTable from "@/components/documents/DocumentsTable";
import DocumentsToolbar from "@/components/documents/DocumentsToolbar";
import { DocumentItem, DocumentStatus } from "@/components/documents/types";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type SortValue = "newest" | "oldest" | "az" | "za";

export default function DocumentsPage() {
  const [rows, setRows] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"all" | DocumentStatus>("all");
  const [docType, setDocType] = useState("");
  const [sort, setSort] = useState<SortValue>("newest");

  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState<DocumentItem | null>(null);
  const [canManage, setCanManage] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();

  interface JwtPayload {
    userId?: string;
    sub?: string;
    role?: string;
    [key: string]: unknown;
  }

  function parseJwt(token: string): JwtPayload | null {
    try {
      const p = token.split(".")[1];
      if (!p) return null;
      return JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/")));
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");

        console.log("Token:", token);

        if (!token) {
          router.push("/login");
          return;
        }

        const payload = parseJwt(token);
        if (payload) {
          const id = payload.userId ?? payload.sub ?? payload.userId;
          setUserId(id ? String(id) : null);
          const role = (payload.role ?? "").toString().toLowerCase();
          setCanManage(role === "admin" || role === "hr");
        }

        const data = await apiFetch("/api/documents");

        console.log("Documents Data:", data);

        const list = (
          Array.isArray(data) ? data : (data?.data ?? [])
        ) as DocumentItem[];
        setRows(list);
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const docTypeOptions = useMemo(
    () =>
      Array.from(new Set(rows.map((r) => r.documentType ?? "")))
        .filter(Boolean)
        .sort(),
    [rows],
  );

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    const out = rows.filter((r) => {
      const emp = (r.employeeName ?? "").toLowerCase();
      const docT = (r.documentType ?? "").toLowerCase();
      const fname = (r.fileName ?? "").toLowerCase();

      const matchQ = emp.includes(q) || docT.includes(q) || fname.includes(q);
      const matchStatus = status === "all" || r.status === status;
      const matchType = !docType || r.documentType === docType;
      return matchQ && matchStatus && matchType;
    });

    out.sort((a, b) => {
      if (sort === "newest")
        return +new Date(b.uploadedAt) - +new Date(a.uploadedAt);
      if (sort === "oldest")
        return +new Date(a.uploadedAt) - +new Date(b.uploadedAt);
      if (sort === "az")
        return (a.employeeName ?? "").localeCompare(b.employeeName ?? "", "id");
      return (b.employeeName ?? "").localeCompare(a.employeeName ?? "", "id");
    });

    return out;
  }, [rows, debouncedSearch, status, docType, sort]);

  const stats = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter((r) => r.status === "pending").length;
    const verified = rows.filter((r) => r.status === "verified").length;
    const rejected = rows.filter((r) => r.status === "rejected").length;
    return { total, pending, verified, rejected };
  }, [rows]);

  async function updateStatus(doc: DocumentItem, next: DocumentStatus) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === doc.id
          ? {
              ...r,
              status: next,
              verifiedAt: new Date().toISOString(),
              verifiedByName: "Current User",
            }
          : r,
      ),
    );

    try {
      const endpoint = next === "verified" ? "verify" : "reject";

      let verifiedBy = userId;
      if (!verifiedBy) {
        const token = localStorage.getItem("token");
        const payload = token ? parseJwt(token) : null;
        verifiedBy = payload
          ? String(payload.userId ?? payload.sub ?? "")
          : null;
      }

      if (!verifiedBy) return; // cannot call API without verifier id

      await fetch(`/api/documents/${doc.id}/${endpoint}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified_by: verifiedBy }),
      });
    } catch {
      // no-op: optimistic only
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Documents</h1>
          <p style={{ margin: "4px 0 0", color: "#64748b" }}>
            Kelola dokumen pegawai
          </p>
        </div>
      </div>

      <DocumentsStats {...stats} />

      <DocumentsToolbar
        search={search}
        status={status}
        docType={docType}
        sort={sort}
        docTypeOptions={docTypeOptions}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onDocTypeChange={setDocType}
        onSortChange={setSort}
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <DocumentsTable
          rows={filtered}
          canManage={canManage}
          onView={(d) => {
            setSelected(d);
            setOpenDetail(true);
          }}
          onVerify={(d) => updateStatus(d, "verified")}
          onReject={(d) => updateStatus(d, "rejected")}
        />
      )}

      <DocumentDetailModal
        open={openDetail}
        data={selected}
        onClose={() => setOpenDetail(false)}
      />
    </div>
  );
}
