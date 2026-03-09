import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
    adapter: new PrismaPg({ 
        connectionString: process.env.DATABASE_URL 
    })});

async function main() {
  await prisma.employees.createMany({
    data: [
      {
        nip: "EMP001",
        nama: "Andi Pratama",
        jabatan: "Staff IT",
        unit: "Teknologi Informasi",
        status: "Tetap",
        alamat: "Jl. Merdeka No.10 Jakarta",
        no_hp: "081234567001",
        email: "andi.pratama@company.local"
      },
      {
        nip: "EMP002",
        nama: "Budi Santoso",
        jabatan: "Teknisi Broadcast",
        unit: "Teknik",
        status: "Tetap",
        alamat: "Jl. Sudirman No.21 Jakarta",
        no_hp: "081234567002",
        email: "budi.santoso@company.local"
      },
      {
        nip: "EMP003",
        nama: "Citra Lestari",
        jabatan: "Staff HR",
        unit: "SDM",
        status: "Tetap",
        alamat: "Jl. Gatot Subroto No.33 Jakarta",
        no_hp: "081234567003",
        email: "citra.lestari@company.local"
      },
      {
        nip: "EMP004",
        nama: "Dedi Kurniawan",
        jabatan: "Operator MCR",
        unit: "Produksi",
        status: "Kontrak",
        alamat: "Jl. Diponegoro No.45 Jakarta",
        no_hp: "081234567004",
        email: "dedi.kurniawan@company.local"
      },
      {
        nip: "EMP005",
        nama: "Eka Saputra",
        jabatan: "Staff Keuangan",
        unit: "Keuangan",
        status: "Tetap",
        alamat: "Jl. Ahmad Yani No.12 Jakarta",
        no_hp: "081234567005",
        email: "eka.saputra@company.local"
      },
      {
        nip: "EMP006",
        nama: "Fajar Hidayat",
        jabatan: "Camera Person",
        unit: "Produksi",
        status: "Kontrak",
        alamat: "Jl. Thamrin No.18 Jakarta",
        no_hp: "081234567006",
        email: "fajar.hidayat@company.local"
      },
      {
        nip: "EMP007",
        nama: "Gilang Ramadhan",
        jabatan: "Editor Video",
        unit: "Produksi",
        status: "Tetap",
        alamat: "Jl. Kebon Sirih No.7 Jakarta",
        no_hp: "081234567007",
        email: "gilang.ramadhan@company.local"
      },
      {
        nip: "EMP008",
        nama: "Hendra Wijaya",
        jabatan: "Network Engineer",
        unit: "Teknologi Informasi",
        status: "Tetap",
        alamat: "Jl. Rasuna Said No.5 Jakarta",
        no_hp: "081234567008",
        email: "hendra.wijaya@company.local"
      },
      {
        nip: "EMP009",
        nama: "Indra Gunawan",
        jabatan: "Staff Logistik",
        unit: "Umum",
        status: "Kontrak",
        alamat: "Jl. Mangga Besar No.22 Jakarta",
        no_hp: "081234567009",
        email: "indra.gunawan@company.local"
      },
      {
        nip: "EMP010",
        nama: "Joko Susilo",
        jabatan: "Driver",
        unit: "Umum",
        status: "Tetap",
        alamat: "Jl. Cempaka Putih No.9 Jakarta",
        no_hp: "081234567010",
        email: "joko.susilo@company.local"
      }
    ]
  });

  console.log("Seed data inserted 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });