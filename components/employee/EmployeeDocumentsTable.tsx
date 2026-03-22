import React from "react";

export interface EmployeeDocument {
  id: string;
  file_name?: string;
  fileName?: string;
  document_type?: string;
  documentType?: string;
  status?: string;
  uploaded_at?: string;
  file_path?: string;
  filePath?: string;
}

type Props = {
  documents: EmployeeDocument[];
};

export default function EmployeeDocumentsTable({ documents }: Props) {
  return (
    <div className="bg-white rounded shadow p-6">
      {documents.length === 0 ? (
        <div className="text-slate-500">Belum ada dokumen.</div>
      ) : (
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 border">Nama Dokumen</th>
              <th className="p-2 border">Tipe</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Tanggal Upload</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="p-2 border">{doc.file_name || doc.fileName}</td>
                <td className="p-2 border">
                  {doc.document_type || doc.documentType}
                </td>
                <td className="p-2 border">{doc.status}</td>
                <td className="p-2 border">
                  {doc.uploaded_at
                    ? new Date(doc.uploaded_at).toLocaleDateString()
                    : "-"}
                </td>
                <td className="p-2 border">
                  {doc.file_path || doc.filePath ? (
                    <a
                      href={doc.file_path || doc.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      Lihat
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
