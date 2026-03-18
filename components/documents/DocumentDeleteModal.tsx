"use client";

import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import type { DocumentItem } from "./types";

interface Props {
  open: boolean;
  doc: DocumentItem | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export default function DocumentDeleteModal({
  open,
  doc,
  onClose,
  onConfirm,
}: Props) {
  return (
    <DeleteConfirmModal
      open={open && !!doc}
      title="Hapus Dokumen"
      description={
        doc ? (
          <>
            Anda akan menghapus <b>{doc.fileName}</b>. Tindakan ini tidak dapat
            dibatalkan.
          </>
        ) : (
          ""
        )
      }
      onClose={onClose}
      onConfirm={async () => {
        if (!doc) return;
        await onConfirm(doc.id);
      }}
    />
  );
}
