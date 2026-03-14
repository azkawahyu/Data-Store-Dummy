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

  const employeeRows = [
    {
      id: randomUUID(),
      nip: "EMP001",
      nama: "Andi Pratama",
      jabatan: "Staff IT",
      unit: "Teknologi Informasi",
      status: "Tetap",
      alamat: "Jl. Merdeka No.10 Jakarta",
      no_hp: "081234567001",
      email: "andi.pratama@company.local",
    },
    {
      id: randomUUID(),
      nip: "EMP002",
      nama: "Budi Santoso",
      jabatan: "Teknisi Broadcast",
      unit: "Teknik",
      status: "Tetap",
      alamat: "Jl. Sudirman No.21 Jakarta",
      no_hp: "081234567002",
      email: "budi.santoso@company.local",
    },
    {
      id: randomUUID(),
      nip: "EMP003",
      nama: "Citra Lestari",
      jabatan: "Staff HR",
      unit: "SDM",
      status: "Tetap",
      alamat: "Jl. Gatot Subroto No.33 Jakarta",
      no_hp: "081234567003",
      email: "citra.lestari@company.local",
    },
    {
      id: randomUUID(),
      nip: "EMP004",
      nama: "Dedi Kurniawan",
      jabatan: "Operator MCR",
      unit: "Produksi",
      status: "Kontrak",
      alamat: "Jl. Diponegoro No.45 Jakarta",
      no_hp: "081234567004",
      email: "dedi.kurniawan@company.local",
    },
    {
      id: randomUUID(),
      nip: "EMP005",
      nama: "Eka Saputra",
      jabatan: "Staff Keuangan",
      unit: "Keuangan",
      status: "Tetap",
      alamat: "Jl. Ahmad Yani No.12 Jakarta",
      no_hp: "081234567005",
      email: "eka.saputra@company.local",
    },
    {
      id: randomUUID(),
      nip: "EMP006",
      nama: "Fajar Hidayat",
      jabatan: "Camera Person",
      unit: "Produksi",
      status: "Kontrak",
      alamat: "Jl. Thamrin No.18 Jakarta",
      no_hp: "081234567006",
      email: "fajar.hidayat@company.local",
    },
    {
      id: randomUUID(),
      nip: "EMP007",
      nama: "Gilang Ramadhan",
      jabatan: "Editor Video",
      unit: "Produksi",
      status: "Tetap",
      alamat: "Jl. Kebon Sirih No.7 Jakarta",
      no_hp: "081234567007",
      email: "gilang.ramadhan@company.local",
    },
    {
      id: randomUUID(),
      nip: "EMP008",
      nama: "Hendra Wijaya",
      jabatan: "Network Engineer",
      unit: "Teknologi Informasi",
      status: "Tetap",
      alamat: "Jl. Rasuna Said No.5 Jakarta",
      no_hp: "081234567008",
      email: "hendra.wijaya@company.local",
    },
    {
      id: randomUUID(),
      nip: "EMP009",
      nama: "Indra Gunawan",
      jabatan: "Staff Logistik",
      unit: "Umum",
      status: "Kontrak",
      alamat: "Jl. Mangga Besar No.22 Jakarta",
      no_hp: "081234567009",
      email: "indra.gunawan@company.local",
    },
    {
      id: randomUUID(),
      nip: "EMP010",
      nama: "Joko Susilo",
      jabatan: "Driver",
      unit: "Umum",
      status: "Tetap",
      alamat: "Jl. Cempaka Putih No.9 Jakarta",
      no_hp: "081234567010",
      email: "joko.susilo@company.local",
    },
  ];

  await prisma.employees.createMany({ data: employeeRows });

  await prisma.roles.createMany({
    data: [
      { id: roleAdminId, name: "admin" },
      { id: roleHrId, name: "hr" },
      { id: roleEmployeeId, name: "employee" },
    ],
    skipDuplicates: true,
  });

  await prisma.users.createMany({
    data: [
      {
        id: userAdminId,
        username: "admin",
        email: "admin@test.com",
        password_hash: passwordHash,
        role_id: roleAdminId,
      },
      {
        id: userHrId,
        username: "hr",
        email: "hr@test.com",
        password_hash: passwordHash,
        role_id: roleHrId,
      },
    ],
  });

  await prisma.documents.createMany({
    data: [
      {
        employee_id: employeeRows[0].id,
        document_type: "KTP",
        file_path: "/uploads/documents/ktp_andi.jpg",
        uploaded_at: new Date(),
        verified_by: userAdminId,
        verified_at: new Date(),
        file_name: "",
        file_size: 0,
        mime_type: "",
      },
      {
        employee_id: employeeRows[1].id,
        document_type: "NPWP",
        file_path: "/uploads/documents/npwp_budi.jpg",
        uploaded_at: new Date(),
        verified_by: userAdminId,
        verified_at: new Date(),
        file_name: "",
        file_size: 0,
        mime_type: "",
      },
      {
        employee_id: employeeRows[2].id,
        document_type: "Ijazah",
        file_path: "/uploads/documents/ijazah_siti.pdf",
        uploaded_at: new Date(),
        verified_by: userHrId,
        verified_at: new Date(),
        file_name: "",
        file_size: 0,
        mime_type: "",
      },
      {
        employee_id: employeeRows[0].id,
        document_type: "KK",
        file_path: "/uploads/documents/kk_andi.pdf",
        uploaded_at: new Date(),
        verified_by: userHrId,
        verified_at: new Date(),
        file_name: "",
        file_size: 0,
        mime_type: "",
      },
      {
        employee_id: employeeRows[3].id,
        document_type: "SIM",
        file_path: "/uploads/documents/sim_rina.jpg",
        uploaded_at: new Date(),
        verified_by: userAdminId,
        verified_at: new Date(),
        file_name: "",
        file_size: 0,
        mime_type: "",
      },
    ],
  });

  console.log("Seed documents berhasil 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
