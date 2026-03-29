# Deployment QNAP dengan Perubahan Minimal

Panduan ini ditulis untuk kondisi project yang sudah berjalan dan ingin dipisah agar tidak merusak pipeline yang ada di QNAP.

## Prinsip utama

- jangan ubah logic web yang sudah stabil
- pertahankan token JWT dan `localStorage` dulu
- pindahkan backend ke service terpisah secara bertahap
- buat frontend dan backend tetap terasa satu origin lewat reverse proxy

## Rekomendasi arsitektur

### Paling aman

- Frontend: `https://app.internal.company`
- Backend API: `https://app.internal.company/api`
- Reverse proxy: QNAP

Dengan pola ini:

- frontend tidak perlu banyak berubah
- cookie session tetap bisa dipakai
- CORS hampir tidak diperlukan
- risiko broken pipeline lebih kecil

### Jika terpaksa dipisah subdomain

- Frontend: `https://app.internal.company`
- Backend: `https://api.internal.company`

Ini boleh, tetapi Anda harus menyiapkan:

- CORS
- `credentials`
- pengaturan cookie domain
- HTTPS

## Apa yang tidak perlu diubah dulu

Kalau tujuan Anda hanya memisahkan deployment, jangan ubah dulu:

- halaman frontend
- alur login UI
- cara frontend membaca token
- komponen yang hanya membaca role dari token

Project ini masih membaca token dari `localStorage` di banyak tempat, jadi memaksa pindah ke cookie-only sekarang akan memicu banyak perubahan.

## Apa yang perlu diubah

Fokus pada ini saja:

1. Cookie login dan logout
2. Reverse proxy QNAP
3. URL backend jika beda origin
4. Environment variable
5. Upload file jika masih bergantung pada local disk

## Rekomendasi cookie session

Gunakan cookie session berbasis server dengan konfigurasi berikut:

- `HttpOnly`
- `Secure` saat HTTPS aktif
- `SameSite=Lax` untuk aplikasi internal
- `SameSite=Strict` jika alur login tidak lintas site

Saran praktis:

- simpan `session_id` di cookie
- simpan session di server/database
- jangan simpan data user penuh di cookie

## Environment variable yang umum dibutuhkan

Frontend:

- `NEXT_PUBLIC_API_URL`

Backend:

- `DATABASE_URL`
- `JWT_SECRET`
- secret cookie/session

## Contoh alur deploy

1. Backend baru jalan di port internal, misalnya `4000`.
2. Frontend tetap jalan di port `3000`.
3. QNAP reverse proxy meneruskan `/api` ke backend.
4. Browser tetap mengakses satu domain utama.
5. Setelah stabil, baru pertimbangkan memisahkan origin sepenuhnya.

## Langkah khusus untuk QNAP

### 1. Gunakan reverse proxy

Atur reverse proxy QNAP agar:

- request ke `/` mengarah ke frontend
- request ke `/api` mengarah ke backend

### 2. Aktifkan HTTPS internal

Meski hanya untuk jaringan kantor, HTTPS tetap disarankan supaya cookie `Secure` bisa dipakai.

### 3. Gunakan DNS internal

Pakai domain internal seperti:

- `app.internal.company`
- `api.internal.company`

Atau lebih simpel, cukup satu domain:

- `app.internal.company`

## Jika ingin minim perubahan sekali lagi

Rekomendasi paling konservatif:

- frontend tetap Next.js seperti sekarang
- login tetap mengembalikan JWT
- cookie tetap diset seperti sekarang
- backend dipisah dulu, frontend tetap pakai token yang sama
- reverse proxy QNAP menjaga path `/api`

Dengan pola ini, Anda bisa menghindari perubahan besar pada UI dan mengurangi risiko broken pipeline.

## Urutan migrasi

1. Pindahkan auth backend dulu.
2. Pastikan login/logout berjalan.
3. Pindahkan endpoint documents.
4. Pindahkan employees.
5. Pindahkan roles dan activity.
6. Pindahkan upload file bila perlu.
7. Baru evaluasi apakah token di `localStorage` perlu diganti.

## Kesimpulan

Untuk QNAP dan project yang sudah berjalan, pilihan terbaik adalah:

- satu domain internal
- reverse proxy
- HTTPS internal
- cookie session tetap dipakai
- frontend tetap memakai token dulu

Itu memberi pemisahan deployment tanpa memaksa refactor besar di frontend.
