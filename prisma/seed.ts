import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  const roleAdminId = randomUUID();
  const roleHrId = randomUUID();
  const roleEmployeeId = randomUUID();

  const userAdminId = randomUUID();
  const userHrId = randomUUID();

  const passwordHash = await bcrypt.hash("admin1122", 10);

  // const employeeRows = [
  //   {
  //     id: randomUUID(),
  //     nip: "EMP001",
  //     nama: "Andi Pratama",
  //     jabatan: "Staff IT",
  //     unit: "Teknologi Informasi",
  //     status: "Tetap",
  //     alamat: "Jl. Merdeka No.10 Jakarta",
  //     no_hp: "081234567001",
  //     email: "andi.pratama@company.local",
  //   },
  //   {
  //     id: randomUUID(),
  //     nip: "EMP002",
  //     nama: "Budi Santoso",
  //     jabatan: "Teknisi Broadcast",
  //     unit: "Teknik",
  //     status: "Tetap",
  //     alamat: "Jl. Sudirman No.21 Jakarta",
  //     no_hp: "081234567002",
  //     email: "budi.santoso@company.local",
  //   },
  //   {
  //     id: randomUUID(),
  //     nip: "EMP003",
  //     nama: "Citra Lestari",
  //     jabatan: "Staff HR",
  //     unit: "SDM",
  //     status: "Tetap",
  //     alamat: "Jl. Gatot Subroto No.33 Jakarta",
  //     no_hp: "081234567003",
  //     email: "citra.lestari@company.local",
  //   },
  //   {
  //     id: randomUUID(),
  //     nip: "EMP004",
  //     nama: "Dedi Kurniawan",
  //     jabatan: "Operator MCR",
  //     unit: "Produksi",
  //     status: "Kontrak",
  //     alamat: "Jl. Diponegoro No.45 Jakarta",
  //     no_hp: "081234567004",
  //     email: "dedi.kurniawan@company.local",
  //   },
  //   {
  //     id: randomUUID(),
  //     nip: "EMP005",
  //     nama: "Eka Saputra",
  //     jabatan: "Staff Keuangan",
  //     unit: "Keuangan",
  //     status: "Tetap",
  //     alamat: "Jl. Ahmad Yani No.12 Jakarta",
  //     no_hp: "081234567005",
  //     email: "eka.saputra@company.local",
  //   },
  //   {
  //     id: randomUUID(),
  //     nip: "EMP006",
  //     nama: "Fajar Hidayat",
  //     jabatan: "Camera Person",
  //     unit: "Produksi",
  //     status: "Kontrak",
  //     alamat: "Jl. Thamrin No.18 Jakarta",
  //     no_hp: "081234567006",
  //     email: "fajar.hidayat@company.local",
  //   },
  //   {
  //     id: randomUUID(),
  //     nip: "EMP007",
  //     nama: "Gilang Ramadhan",
  //     jabatan: "Editor Video",
  //     unit: "Produksi",
  //     status: "Tetap",
  //     alamat: "Jl. Kebon Sirih No.7 Jakarta",
  //     no_hp: "081234567007",
  //     email: "gilang.ramadhan@company.local",
  //   },
  //   {
  //     id: randomUUID(),
  //     nip: "EMP008",
  //     nama: "Hendra Wijaya",
  //     jabatan: "Network Engineer",
  //     unit: "Teknologi Informasi",
  //     status: "Tetap",
  //     alamat: "Jl. Rasuna Said No.5 Jakarta",
  //     no_hp: "081234567008",
  //     email: "hendra.wijaya@company.local",
  //   },
  //   {
  //     id: randomUUID(),
  //     nip: "EMP009",
  //     nama: "Indra Gunawan",
  //     jabatan: "Staff Logistik",
  //     unit: "Umum",
  //     status: "Kontrak",
  //     alamat: "Jl. Mangga Besar No.22 Jakarta",
  //     no_hp: "081234567009",
  //     email: "indra.gunawan@company.local",
  //   },
  //   {
  //     id: randomUUID(),
  //     nip: "EMP010",
  //     nama: "Joko Susilo",
  //     jabatan: "Driver",
  //     unit: "Umum",
  //     status: "Tetap",
  //     alamat: "Jl. Cempaka Putih No.9 Jakarta",
  //     no_hp: "081234567010",
  //     email: "joko.susilo@company.local",
  //   },
  // ];

  // await prisma.employees.createMany({ data: employeeRows });

  // await prisma.roles.createMany({
  //   data: [
  //     { id: roleAdminId, name: "admin" },
  //     { id: roleHrId, name: "hr" },
  //     { id: roleEmployeeId, name: "employee" },
  //   ],
  //   skipDuplicates: true,
  // });

  // await prisma.users.createMany({
  //   data: [
  //     {
  //       id: userAdminId,
  //       username: "admin",
  //       email: "admin@test.com",
  //       password_hash: passwordHash,
  //       role_id: roleAdminId,
  //     },
  //     {
  //       id: userHrId,
  //       username: "hr",
  //       email: "hr@test.com",
  //       password_hash: passwordHash,
  //       role_id: roleHrId,
  //     },
  //   ],
  // });

  await prisma.documents.createMany({
    data: [
      {
        employee_id: "0da0fc58-3430-41a3-96f1-9793c17b1240",
        document_type: "KTP",
        file_path: "/uploads/documents/ktp_andi.jpg",
        uploaded_at: new Date(),
        verified_by: "6ea6da0c-dcef-4c92-b65f-88bb6c50a856",
        verified_at: new Date(),
        file_name: "ktp_andi.jpg",
        file_size: 12345,
        mime_type: "image/jpeg",
      },
      {
        employee_id: "1235bc14-6972-4b8d-bd91-e8914c1115dd",
        document_type: "NPWP",
        file_path: "/uploads/documents/npwp_budi.jpg",
        uploaded_at: new Date(),
        verified_by: "6ea6da0c-dcef-4c92-b65f-88bb6c50a856",
        verified_at: new Date(),
        file_name: "npwp_budi.jpg",
        file_size: 23456,
        mime_type: "image/jpeg",
      },
      {
        employee_id: "1e83feb7-16d9-4382-9da6-7de384314b98",
        document_type: "Ijazah",
        file_path: "/uploads/documents/ijazah_siti.pdf",
        uploaded_at: new Date(),
        verified_by: "9ffe229c-06b2-41e5-8b5b-70b27f816cbb",
        verified_at: new Date(),
        file_name: "ijazah_siti.pdf",
        file_size: 34567,
        mime_type: "application/pdf",
      },
      {
        employee_id: "0da0fc58-3430-41a3-96f1-9793c17b1240",
        document_type: "KK",
        file_path: "/uploads/documents/kk_andi.pdf",
        uploaded_at: new Date(),
        verified_by: "9ffe229c-06b2-41e5-8b5b-70b27f816cbb",
        verified_at: new Date(),
        file_name: "kk_andi.pdf",
        file_size: 45678,
        mime_type: "application/pdf",
      },
      {
        employee_id: "456173e5-0dc7-4e21-9dcf-a1c83f97c96c",
        document_type: "SIM",
        file_path: "/uploads/documents/sim_rina.jpg",
        uploaded_at: new Date(),
        verified_by: "6ea6da0c-dcef-4c92-b65f-88bb6c50a856",
        verified_at: new Date(),
        file_name: "sim_rina.jpg",
        file_size: 56789,
        mime_type: "image/jpeg",
      },
    ],
  });

  // Hapus dokumen seed yang sudah ada (berdasarkan file_path dari daftar seed)

  // Buat ulang entri documents dari daftar documentsSeed
  // await prisma.documents.createMany({
  //   data: documentsSeed,
  //   // skipDuplicates: true,
  // });

  console.log("Seed documents diperbarui ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
