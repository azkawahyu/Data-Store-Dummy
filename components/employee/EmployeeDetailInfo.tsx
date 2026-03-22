import React from "react";

type Props = {
  employee: {
    nip: string;
    nama: string;
    jabatan: string;
    unit: string;
    email: string;
    no_hp: string;
    alamat: string;
    status: string;
  };
};

export default function EmployeeDetailInfo({ employee }: Props) {
  return (
    <div className="bg-white rounded shadow p-6 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="font-semibold text-slate-700">NIP</div>
          <div className="mb-2">{employee.nip}</div>
          <div className="font-semibold text-slate-700">Nama</div>
          <div className="mb-2">{employee.nama}</div>
          <div className="font-semibold text-slate-700">Jabatan</div>
          <div className="mb-2">{employee.jabatan}</div>
          <div className="font-semibold text-slate-700">Unit</div>
          <div className="mb-2">{employee.unit}</div>
        </div>
        <div>
          <div className="font-semibold text-slate-700">Email</div>
          <div className="mb-2">{employee.email}</div>
          <div className="font-semibold text-slate-700">No. HP</div>
          <div className="mb-2">{employee.no_hp}</div>
          <div className="font-semibold text-slate-700">Alamat</div>
          <div className="mb-2">{employee.alamat}</div>
          <div className="font-semibold text-slate-700">Status</div>
          <div className="mb-2">{employee.status}</div>
        </div>
      </div>
    </div>
  );
}
