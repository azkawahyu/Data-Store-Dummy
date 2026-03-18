"use client";

import { useState } from "react";

interface Props {
  open: boolean;
  title: string;
  description: React.ReactNode;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  confirmText?: string;
  loadingText?: string;
}

export default function DeleteConfirmModal({
  open,
  title,
  description,
  onClose,
  onConfirm,
  confirmText = "Ya, Hapus",
  loadingText = "Menghapus...",
}: Props) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleConfirm() {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .emp-del-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15,23,42,.45);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .emp-del-modal {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(15,23,42,.2);
          overflow: hidden;
        }
        .emp-del-header {
          padding: 20px 24px 0;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .emp-del-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #fee2e2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .emp-del-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px;
        }
        .emp-del-desc {
          font-size: 13px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }
        .emp-del-footer {
          padding: 20px 24px;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
        .emp-btn {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 9px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          background: white;
          transition: background .15s;
        }
        .emp-btn:hover { background: #f1f5f9; }
        .emp-btn:disabled { opacity: .5; cursor: not-allowed; }
        .emp-btn-danger {
          background: #dc2626;
          color: white;
          border-color: #dc2626;
        }
        .emp-btn-danger:hover:not(:disabled) { background: #b91c1c; }
      `}</style>

      <div className="emp-del-overlay" onClick={onClose}>
        <div className="emp-del-modal" onClick={(e) => e.stopPropagation()}>
          <div className="emp-del-header">
            <div className="emp-del-icon">🗑️</div>
            <div>
              <p className="emp-del-title">{title}</p>
              <p className="emp-del-desc">{description}</p>
            </div>
          </div>

          <div className="emp-del-footer">
            <button className="emp-btn" onClick={onClose} disabled={loading}>
              Batal
            </button>
            <button
              className="emp-btn emp-btn-danger"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? loadingText : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
