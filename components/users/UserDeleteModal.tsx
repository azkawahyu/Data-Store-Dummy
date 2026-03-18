"use client";

import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import type { UserItem } from "./types";

interface Props {
  open: boolean;
  user: UserItem | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export default function UserDeleteModal({
  open,
  user,
  onClose,
  onConfirm,
}: Props) {
  return (
    <DeleteConfirmModal
      open={open && !!user}
      title="Hapus User"
      description={
        user ? (
          <>
            Anda akan menghapus user <b>{user.username}</b>. Tindakan ini tidak
            dapat dibatalkan.
          </>
        ) : (
          ""
        )
      }
      onClose={onClose}
      onConfirm={async () => {
        if (!user) return;
        await onConfirm(user.id);
      }}
    />
  );
}
