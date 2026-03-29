# Pemisahan Frontend dan Backend

Panduan ini untuk memisahkan aplikasi Next.js ini menjadi frontend dan backend agar bisa di-deploy terpisah, termasuk untuk jaringan lokal.

## Rekomendasi arsitektur

- Frontend: Next.js UI saja
- Backend: service API terpisah untuk auth, CRUD, upload, dan akses database
- Shared: schema validasi, tipe TypeScript, dan konstanta bersama

## Jalur paling minim perubahan

Kalau tujuan utama adalah menghindari broken pipeline di QNAP dan Anda tidak ingin mengubah logic web yang sudah berjalan, maka pilih jalur ini:

- frontend tetap seperti sekarang
- login tetap mengembalikan token seperti sekarang
- frontend tetap menyimpan token di `localStorage` seperti sekarang
- cookie tetap dipakai untuk validasi sesi server
- backend dipindah ke service terpisah, tetapi tetap diekspos lewat path yang sama, misalnya `/api`

Dengan cara ini, perubahan frontend bisa sangat kecil atau bahkan tidak ada.

Yang biasanya perlu berubah hanya:

- setting `secure` / `sameSite` cookie sesuai environment
- URL base jika backend tidak lagi satu origin
- konfigurasi reverse proxy di QNAP

Kalau Anda langsung pindah ke cookie session murni tanpa token di frontend, maka banyak file web perlu diubah karena project ini masih membaca token dari `localStorage` di banyak tempat.

Struktur target yang disarankan:

- `apps/web` untuk frontend
- `apps/api` untuk backend
- `packages/shared` untuk tipe dan validasi bersama

## Urutan migrasi yang aman

1. Pindahkan logic dari route handler di `app/api` ke backend baru.
2. Ubah frontend agar hanya memanggil API via HTTP.
3. Pisahkan akses database dari UI.
4. Pindahkan upload file ke storage eksternal atau ke backend baru.
5. Baru hapus endpoint lama setelah frontend stabil.

## Folder yang biasanya dipindah dulu

- `app/api`
- `lib`
- `prisma`
- `utils/fileUpload.ts`
- `lib/validations`

## Yang dibutuhkan

- `DATABASE_URL` untuk backend
- `JWT_SECRET` atau secret session untuk auth
- `NEXT_PUBLIC_API_URL` untuk frontend
- CORS di backend jika frontend dan backend beda origin
- storage eksternal untuk file upload jika backend tidak satu server dengan frontend

## Opsi domain untuk jaringan lokal

### Opsi 1: 1 domain utama, paling mudah

Gunakan satu domain lokal lalu proxy backend di path `/api`.

- Frontend: `http://app.home.arpa`
- Backend: diproxy di `http://app.home.arpa/api`

Kelebihan:

- cookie lebih sederhana
- tidak perlu CORS rumit
- cocok untuk auth berbasis cookie

### Opsi 2: subdomain terpisah

Gunakan dua subdomain:

- Frontend: `http://app.home.arpa`
- Backend: `http://api.home.arpa`

Kelebihan:

- pemisahan lebih jelas
- mudah jika backend nanti dipindah server

Kekurangan:

- perlu CORS
- perlu pengaturan cookie `Domain`, `SameSite`, dan mungkin `Secure`

## Rekomendasi domain lokal

Untuk jaringan lokal, pakai domain `home.arpa`.

Alasan:

- memang ditujukan untuk jaringan rumah/lokal
- lebih aman dibanding nama acak yang kadang bentrok
- cocok untuk dipakai di semua device dalam LAN

Contoh:

- `app.home.arpa`
- `api.home.arpa`

## Cara membuat domain lokal bekerja

### Jika hanya satu komputer

Pakai `hosts` file di mesin tersebut.

Contoh:

- `127.0.0.1 app.home.arpa`
- `127.0.0.1 api.home.arpa`

### Jika untuk satu jaringan lokal

Pakai salah satu:

- router DNS custom
- Pi-hole
- dnsmasq
- reverse proxy yang juga menangani DNS internal

Setiap device di LAN harus bisa resolve nama domain yang sama ke IP server lokal Anda.

## Contoh skenario port lokal

- Frontend Next.js: `3000`
- Backend API: `4000`
- Reverse proxy: `80` atau `443`

Reverse proxy akan menerima request dari browser lalu meneruskan ke service yang benar.

## Saran untuk auth

Jika ingin tetap memakai cookie session, pilihan yang paling aman dan praktis untuk deployment perusahaan adalah:

- pakai cookie `HttpOnly`
- simpan `session id` di cookie, bukan data user lengkap
- simpan session di server/database
- set `Secure` jika sudah pakai HTTPS
- set `SameSite=Lax` untuk kebanyakan aplikasi internal
- gunakan `SameSite=Strict` jika alur login tidak butuh lintas site

Kenapa ini lebih baik:

- lebih mudah di-revoke saat logout
- lebih aman daripada menyimpan payload login di cookie
- cocok untuk kontrol akses internal di server QNAP
- lebih fleksibel jika nanti frontend dan backend dipisah

Namun untuk kondisi project Anda saat ini, saya sarankan jangan langsung ganti ke cookie-only. Tetap pertahankan token JWT yang sudah ada, lalu jadikan cookie sebagai pelengkap untuk sesi server dan validasi reverse proxy.

Jika Anda tetap memisah frontend dan backend ke subdomain atau origin berbeda, tetap perhatikan ini:

- usahakan frontend dan backend tetap satu site, misalnya lewat reverse proxy yang sama
- jika pakai subdomain, aktifkan CORS dengan `credentials`
- pastikan cookie sesuai dengan domain yang dipakai
- jika domain internal, set cookie domain ke parent domain yang sama bila perlu

Jika ingin lebih simpel untuk awal migrasi:

- pakai token di header `Authorization`
- frontend menyimpan token sesuai kebutuhan keamanan Anda

## Rekomendasi untuk server QNAP perusahaan

Untuk QNAP, paling aman dan mudah dikelola adalah:

- satu domain internal
- reverse proxy di QNAP untuk frontend dan backend
- HTTPS aktif, walau hanya internal
- session cookie `HttpOnly` + `Secure`

Contoh pola yang disarankan:

- `https://app.internal.company`
- backend diproxy di `https://app.internal.company/api`

Kalau Anda benar-benar ingin frontend dan backend di subdomain berbeda:

- `https://app.internal.company`
- `https://api.internal.company`

Maka pastikan:

- CORS mengizinkan origin frontend
- request membawa credentials
- cookie memiliki domain yang sesuai
- HTTPS tetap dipakai

Untuk aplikasi perusahaan, saya sarankan mulai dari session cookie berbasis server, lalu pindah ke JWT hanya jika nanti ada kebutuhan integrasi API yang lebih luas.

## Saran untuk upload file

Jangan simpan upload hanya di local disk jika frontend dan backend akan dipisah.

Pilih salah satu:

- S3
- Cloudflare R2
- MinIO
- Supabase Storage

## Tahap implementasi yang paling praktis

1. Buat backend baru.
2. Pindahkan auth.
3. Pindahkan documents.
4. Pindahkan employees.
5. Pindahkan roles dan activity.
6. Update frontend untuk konsumsi API baru.
7. Matikan route API lama setelah stabil.

## Langkah berikutnya yang disarankan

Jika ingin, langkah berikutnya bisa saya bantu:

- membuat struktur folder `apps/web`, `apps/api`, dan `packages/shared`
- membuat daftar endpoint API yang perlu dipindahkan
- membuat contoh konfigurasi reverse proxy untuk `app.home.arpa` dan `api.home.arpa`
