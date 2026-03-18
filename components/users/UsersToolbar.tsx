"use client";

interface Props {
  onAdd: () => void;
}

export default function UsersToolbar({ onAdd }: Props) {
  return (
    <div className="header-card">
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h2 className="page-title">Manajemen User</h2>
          <p className="page-subtitle">Kelola akun login sistem</p>
        </div>
        <button type="button" onClick={onAdd} className="btn btn-primary">
          + Tambah User
        </button>
      </div>
    </div>
  );
}
