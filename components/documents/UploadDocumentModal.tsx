"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useToast } from "@/components/ToastProvider";
import { apiFetch } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onUploaded?: () => void;
}

export default function UploadDocumentModal({
  open,
  onClose,
  onUploaded,
}: Props) {
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employees, setEmployees] = useState<
    Array<{ id: string; name: string; nip?: string }>
  >([]);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [docType, setDocType] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const resetForm = useCallback(() => {
    setEmployeeId("");
    setEmployeeName("");
    setEmployeeSearch("");
    setDocType("");
    setFiles(null);
    setSelectedFiles([]);
    setShowDropdown(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (!open) {
      resetForm();
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const data = await apiFetch("/api/employees");
        const list = Array.isArray(data) ? data : (data?.data ?? []);
        type EmployeeRaw = {
          id?: string;
          _id?: string;
          nama?: string;
          name?: string;
          full_name?: string;
          employee_name?: string;
          first_name?: string;
          last_name?: string;
          nip?: string;
        };

        const mapped = (list as EmployeeRaw[]).map((e) => ({
          id: String(e.id ?? e._id ?? ""),
          name:
            (e.nama ??
              e.name ??
              e.full_name ??
              e.employee_name ??
              `${e.first_name ?? ""} ${e.last_name ?? ""}`.trim()) ||
            String(e.id ?? ""),
          nip: e.nip ?? undefined,
        }));

        if (mounted) setEmployees(mapped);
      } catch (err) {
        console.error("Failed to load employees for upload modal:", err);
        setEmployees([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [open, resetForm]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (e.target instanceof Node && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!employeeId) {
      toast.push("Pilih pegawai terlebih dahulu", "error");
      return;
    }

    if (!docType.trim()) {
      toast.push("Pilih tipe dokumen", "error");
      return;
    }

    if (!selectedFiles || selectedFiles.length === 0) {
      toast.push("Pilih file terlebih dahulu", "error");
      return;
    }

    const formData = new FormData();
    formData.append("employee_id", employeeId);
    formData.append("document_type", docType);
    for (let i = 0; i < selectedFiles.length; i++)
      formData.append("files", selectedFiles[i]);

    try {
      setLoading(true);

      const token =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("token")
          : null;

      const res = await fetch(`http://localhost:3002/api/documents/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token ?? ""}`,
        },
      });

      const data = await res.json();

      const normalizeMessage = (m: unknown) =>
        typeof m === "string" ? m : JSON.stringify(m ?? "");

      if (!res.ok) {
        toast.push(normalizeMessage(data?.message) || "Gagal upload", "error");
        return;
      }

      toast.push(
        normalizeMessage(data?.message) || "Upload berhasil",
        "success",
      );
      onUploaded && onUploaded();
      handleClose(); // pakai close yang sudah reset
    } catch (err) {
      console.error(err);
      toast.push("Terjadi kesalahan saat upload", "error");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const modal = (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-slate-900/40 grid place-items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[min(920px,96vw)] bg-white rounded-lg border border-slate-200 p-6 shadow-lg"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium">Upload Dokumen</h3>
          <button onClick={handleClose} className="text-slate-500">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-700">
              Pilih Pegawai
            </label>

            <div ref={wrapperRef} className="relative mt-1">
              <input
                value={employeeSearch}
                onChange={(e) => {
                  setEmployeeSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onClick={() => setShowDropdown((s) => !s)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setShowDropdown(false);
                }}
                onFocus={() => setShowDropdown(true)}
                className="block w-full border rounded-md px-3 py-2 text-sm"
                placeholder="Cari nama pegawai..."
              />

              {showDropdown && (
                <ul className="absolute z-40 left-0 right-0 bg-white border rounded-md mt-1 max-h-44 overflow-auto">
                  {employees
                    .filter((emp) =>
                      (emp.name || "")
                        .toLowerCase()
                        .includes(employeeSearch.toLowerCase()),
                    )
                    .map((emp) => (
                      <li
                        key={emp.id}
                        onClick={() => {
                          setEmployeeId(emp.id);
                          setEmployeeSearch(emp.name || "");
                          setEmployeeName(emp.name || "");
                          setShowDropdown(false);
                        }}
                        className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                      >
                        {emp.name}
                        {emp.nip ? ` — ${emp.nip}` : ` (${emp.id})`}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-700">Tipe Dokumen</label>
            <select
              className="block w-full border rounded-md px-3 py-2 text-sm mt-1"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option value="">Pilih tipe dokumen...</option>
              <option value="KTP">KTP</option>
              <option value="NPWP">NPWP</option>
              <option value="Ijazah">Ijazah</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div
            onDrop={(e) => {
              e.preventDefault();
              const dropped = Array.from(e.dataTransfer?.files || []);
              if (dropped.length)
                setSelectedFiles((prev) => [...prev, ...dropped]);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="mt-1 border-dashed border-2 border-slate-200 rounded-md p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-slate-800 text-white px-3 py-1 rounded-md text-sm"
                >
                  Pilih File
                </button>
              </div>
              <div className="text-sm text-slate-600 ml-4">
                Klik atau seret file ke sini untuk mengunggah
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => {
                const f = Array.from(e.target.files || []);
                if (f.length) setSelectedFiles((prev) => [...prev, ...f]);
              }}
              className="hidden"
            />

            {selectedFiles.length > 0 ? (
              <ul className="max-h-40 overflow-auto">
                {selectedFiles.map((f, idx) => (
                  <li
                    key={`${f.name}-${idx}`}
                    className="flex items-center justify-between text-sm py-1"
                  >
                    <div className="truncate">{f.name}</div>
                    <div className="flex items-center gap-3">
                      <div className="text-slate-500 text-xs">
                        {Math.round(f.size / 1024)} KB
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedFiles((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                        className="text-red-500 text-xs"
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-slate-400 text-sm">
                Belum ada file terpilih
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-2 text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-800 text-white px-4 py-2 rounded-md text-sm disabled:opacity-60"
            >
              {loading ? "Mengunggah..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modal, document.body)
    : modal;
}
