# Simulasi dan Deploy

Halaman simulasi memungkinkan seluruh endpoint dicoba tanpa backend. Dokumen ini menjelaskan cara kerja simulasi, perintah yang tersedia, pilihan hosting, dan penanganan masalah yang sering muncul.

## Cara kerja simulasi

Berkas `mock.js` menggantikan `window.fetch` untuk alamat yang memuat `/api/v1`. Alurnya:

1. Halaman memuat `openapi.json` dan `mock-data.json` dari folder yang sama.
2. `mock.js` membaca `mock-data.json` dan menyusun daftar rute berdasarkan path dan metode.
3. Saat Swagger UI mengirim permintaan ke `/api/v1/...`, `mock.js` mencocokkan path dengan pola rute, misalnya `/itineraries/{id}`.
4. Peran aktif dan mode respons menentukan jawaban.
5. Jawaban dibuat sebagai objek `Response` lengkap dengan kode status dan header.

Tidak ada permintaan jaringan keluar untuk alamat `/api/v1`. Permintaan lain, misalnya untuk memuat `openapi.json`, tetap memakai `fetch` asli.

Pencocokan rute memilih pola yang paling spesifik lebih dahulu. Contohnya, `GET /itineraries/{id}/alerts` tidak akan tertukar dengan `GET /itineraries/{id}`. Ini penting karena Swagger UI hanya mengirim path yang sudah diisi pengguna.

## Menjalankan secara lokal

```bash
cd api-contract
npm install
npm run serve
```

Buka `http://127.0.0.1:4173/`. Port dapat diubah:

```powershell
$env:PORT=8080; npm run serve
```

Untuk membuka dari perangkat lain pada jaringan lokal:

```powershell
$env:HOST='0.0.0.0'; npm run serve
```

Lalu akses `http://<alamat-ip-komputer>:4173/`.

### Mengapa tidak boleh dibuka langsung

Membuka `index.html` dengan klik dua kali memakai skema `file://`. Pada skema tersebut, browser menolak permintaan `fetch` ke berkas JSON setempat karena alasan keamanan. Akibatnya `mock-data.json` dan `openapi.json` gagal dimuat, lalu muncul pesan bahwa data simulasi tidak tersedia.

Gunakan server berkas. Perintah `npm run serve` sudah disediakan dan tidak memerlukan dependensi tambahan. Alternatif lain:

```bash
npx serve .
python -m http.server 4173
php -S 127.0.0.1:4173
```

## Perintah build

| Perintah | Kegunaan |
| --- | --- |
| `npm install` | Memasang dependensi build |
| `npm run build` | Menulis ulang kontrak, data simulasi, aset Swagger UI, dan halaman dokumentasi |
| `npm run validate` | Memeriksa keabsahan `openapi.json` |
| `npm run docx` | Membuat dokumen Word berisi pemanggilan dan contoh respons |
| `npm run serve` | Menjalankan server statis lokal |

Urutan yang disarankan setelah mengubah berkas di `tools/`:

```bash
npm run build
npm run validate
npm run docx
npm run serve
```

### Berkas yang dihasilkan

| Berkas | Sumber |
| --- | --- |
| `openapi.yaml` | `tools/build.mjs` |
| `openapi.json` | `tools/build.mjs` |
| `mock-data.json` | `tools/build.mjs` |
| `assets/swagger-ui.css` | Paket `swagger-ui-dist` |
| `assets/swagger-ui-bundle.js` | Paket `swagger-ui-dist` |
| `assets/swagger-ui-standalone-preset.js` | Paket `swagger-ui-dist` |
| `docs/02-katalog-endpoint.md` | `tools/build.mjs` |
| `docs/03-contoh-positif-negatif.md` | `tools/build.mjs` |
| `docs/index.html` | `tools/build.mjs` |
| `public/` | `tools/bundle.mjs`, salinan siap deploy untuk Vercel dan Netlify |
| `Find-Holiday-API-Contract.docx` | `tools/docx.mjs`, dokumen Word berisi pemanggilan dan contoh respons |

Jangan mengubah berkas hasil build secara langsung. Perubahan akan hilang pada build berikutnya. Ubah sumber pada `tools/` atau dokumen manual di `docs/`.

### Membuat dokumen Word

```bash
npm run docx
```

Perintah ini menulis `Find-Holiday-API-Contract.docx` pada folder `api-contract`. Isinya dibuat dari sumber kontrak yang sama dengan halaman Swagger, sehingga tidak perlu diperbarui secara terpisah.

Susunan dokumen:

| Bagian | Isi |
| --- | --- |
| Sampul | Versi, alamat dasar, jumlah endpoint, dan jumlah kasus negatif |
| Cara memakai dokumen | Penjelasan singkat, token contoh per peran, amplop respons, dan daftar kode status |
| Daftar kelompok endpoint | Sebaran endpoint pada sepuluh kelompok |
| Bab per kelompok | Tabel endpoint, lalu rincian tiap endpoint |

Rincian tiap endpoint memuat peran, kode sukses, kebutuhan terkait, contoh pemanggilan lengkap dengan header dan isi permintaan, parameter, contoh respons positif, dan tabel kasus negatif beserta isi respons.

Dokumen memakai gaya judul bawaan Word, sehingga panel navigasi Word dapat dipakai untuk berpindah antarbab dan antar endpoint. Nomor halaman dan jumlah halaman diperbarui otomatis oleh Word.

Dokumen ini memerlukan paket `docx` yang sudah tercatat sebagai dependensi pengembangan. Jalankan `npm install` sebelum `npm run docx` pada mesin baru.

## Mode respons

Panel simulasi memiliki dua pilihan: peran aktif dan mode respons.

### Peran aktif

| Nilai | Label | Efek |
| --- | --- | --- |
| `tourist` | Wisatawan | Token dan contoh profil wisatawan |
| `partner` | Mitra transportasi | Token dan contoh profil mitra |
| `admin` | Administrator | Token dan contoh profil admin |

Peran disimpan pada `localStorage` dengan kunci `fh-api-simulation-v1`, sehingga pilihan tetap ada setelah halaman dimuat ulang.

### Mode respons

| Mode | Kode yang dicari | Perilaku bila endpoint tidak memiliki kode tersebut |
| --- | --- | --- |
| `positif` | 2xx | Mengembalikan contoh sukses |
| `negatif-validasi` | 400 atau 422 | Mengembalikan contoh validasi umum |
| `negatif-autentikasi` | 401 | Mengembalikan contoh `UNAUTHENTICATED` |
| `negatif-otorisasi` | 403 | Mengembalikan contoh `FORBIDDEN_ROLE` |
| `negatif-tidak-ditemukan` | 404 | Mengembalikan contoh `NOT_FOUND` |
| `negatif-konflik` | 409 | Mengembalikan contoh `CONFLICT` |
| `negatif-rate-limit` | 429 | Mengembalikan contoh `RATE_LIMITED` |
| `negatif-upstream` | 503 | Mengembalikan contoh `UPSTREAM_UNAVAILABLE` |
| `negatif-server` | 500 | Mengembalikan contoh `INTERNAL_ERROR` |

Bila endpoint memiliki beberapa kesalahan dengan kode status yang sama, simulasi memilih yang pertama pada daftar. Contohnya, mode konflik pada `POST /auth/register` mengembalikan `EMAIL_ALREADY_USED`, bukan kode konflik lain.

Mode negatif tidak mengubah status peran. Artinya, mode `negatif-validasi` pada endpoint admin tetap mengembalikan `422` meskipun peran aktif adalah wisatawan. Ini disengaja agar setiap contoh kesalahan dapat diperiksa tanpa mengganti peran.

### Perilaku positif dan peran

Pada mode positif, simulasi memeriksa izin:

- Endpoint dengan peran `public` dapat dipanggil siapa saja.
- Endpoint dengan peran `tourist`, `partner`, atau `admin` hanya berhasil bila peran aktif sesuai.
- Peran yang tidak sesuai menghasilkan `403 FORBIDDEN_ROLE`.
- Contoh respons yang berbeda per peran dipakai pada `POST /auth/login` dan `GET /user/profile`.

Contoh: bila peran aktif adalah wisatawan lalu Anda menjalankan `GET /admin/users`, responsnya `403`. Ganti peran ke admin untuk melihat respons sukses.

### Header jawaban simulasi

| Header | Isi |
| --- | --- |
| `X-Mock-Role` | Peran aktif |
| `X-Mock-Scenario` | Mode respons |
| `X-Mock-Operation` | `operationId` endpoint |
| `X-Mock-Result` | `positif` atau `negatif` |
| `X-Mock-Error` | Kode kesalahan pada respons negatif |
| `X-Request-Id` | ID permintaan contoh |

Header ini membantu saat memeriksa apakah jawaban berasal dari rute yang benar.

## Yang tidak disimulasikan

| Hal | Keterangan |
| --- | --- |
| Penyimpanan data | Perubahan tidak disimpan. Setiap permintaan dimulai dari data contoh yang sama |
| Aliran event | `GET /itineraries/{id}/alerts/stream` tidak membuka koneksi berkelanjutan. Contoh event hanya ditampilkan pada dokumentasi |
| Perhitungan rekomendasi | Skor dan biaya diambil dari data contoh, bukan dihitung |
| Cuaca dan lalu lintas | Nilai diambil dari data contoh, bukan dari layanan pihak ketiga |
| Pembatasan nyata | `429` hanya contoh. Tidak ada penghitung permintaan sebenarnya |
| Unggah berkas | Kontrak tidak memuat unggah berkas. Dokumen legalitas mitra memakai URL |
| Autentikasi nyata | Token contoh tidak diperiksa oleh server mana pun |
| Waktu respons | Jeda 120 sampai 240 milidetik hanya untuk memberi kesan proses berjalan |

## Deploy

Folder `api-contract` bersifat statis. Seluruh path memakai bentuk relatif, sehingga dapat ditempatkan pada akar domain atau subfolder.

### GitHub Pages

Pilihan pertama, publikasikan folder sebagai artefak:

1. Buat alur kerja yang menjalankan `npm ci` dan `npm run build` di dalam `api-contract`.
2. Unggah folder `api-contract` sebagai artefak Pages.
3. Aktifkan Pages dengan sumber GitHub Actions.

Pilihan kedua, tanpa alur kerja:

1. Jalankan `npm run build` secara lokal.
2. Salin isi `api-contract` ke folder yang dipublikasikan, misalnya `docs/` pada repositori.
3. Aktifkan Pages dari folder tersebut.

Catatan:

- Jangan mengunggah `node_modules`. Folder tersebut tidak diperlukan pada hosting.
- Folder `tools` tidak diperlukan saat runtime, tetapi boleh diunggah agar sumber build ikut terdokumentasi.
- Nama berkas harus tetap huruf kecil. GitHub Pages pada Linux membedakan huruf besar dan kecil.
- Swagger UI memuat `./openapi.json` dan `./mock-data.json` secara relatif, sehingga tetap bekerja pada subfolder.

### Vercel

Vercel mengharapkan folder keluaran bernama `public` bila proyek menjalankan perintah build. Karena itu `npm run build` sekarang menulis dua hal sekaligus: berkas kontrak, lalu salinan siap saji pada folder `public/`.

Pengaturan proyek:

| Butir | Nilai |
| --- | --- |
| Direktori dasar | `api-contract` |
| Framework Preset | `Other` |
| Perintah pemasangan | `npm install` |
| Perintah build | `npm run build` |
| Direktori keluaran | `public` |

Langkah pada dasbor:

1. Unggah repositori ke GitHub.
2. Di Vercel, pilih Add New lalu Project, kemudian impor repositori tersebut.
3. Isi Root Directory dengan `api-contract` dan Framework Preset dengan `Other`.
4. Pastikan Build Command berisi `npm run build` dan Output Directory berisi `public`.
5. Tekan Deploy.

Pesan galat berikut muncul bila Build Command dijalankan tetapi folder `public` belum dibuat:

```text
Error: [STATIC_BUILD_NO_OUT_DIR] No Output Directory named "public" found after the Build completed.
```

Penyebab dan tindakan:

| Sebab | Tindakan |
| --- | --- |
| Build Command kosong | Isi dengan `npm run build` |
| Build Command mengarah ke perintah lain | Ganti menjadi `npm run build` agar `public` ikut dibuat |
| Output Directory diisi `.` | Ganti menjadi `public`, atau biarkan bawaan |
| Repositori belum memuat `tools/bundle.mjs` | Perbarui repositori, lalu deploy ulang |

Bila tidak ingin menjalankan build di Vercel sama sekali, kosongkan Build Command lalu isi Output Directory dengan `.`. Cara ini menyajikan seluruh isi folder `api-contract`, termasuk `tools` dan `package.json`, sehingga kurang rapi dibandingkan folder `public`.

Lewat antarmuka baris perintah:

```bash
npm i -g vercel
vercel login
cd api-contract
vercel          # pratinjau
vercel --prod   # produksi
```

Saat pertama dijalankan, jawab pertanyaan yang muncul: pilih akun, pilih `N` pada pertanyaan tautkan proyek yang sudah ada, isi nama proyek, gunakan direktori `./`, lalu pilih `N` pada pertanyaan ubah pengaturan.

Yang perlu dihindari:

- Jangan membuat folder bernama `api` di dalam proyek. Vercel menganggapnya sebagai fungsi serverless, padahal simulasi berjalan di browser.
- Jangan menambahkan aturan penulisan ulang semua path ke `index.html`.
- Jangan mengunggah `node_modules`. Folder `public` sudah memuat semua berkas yang dibutuhkan.
- Jangan mengubah isi `public` secara langsung. Folder itu dibuat ulang pada setiap `npm run build`.

### Netlify

| Butir | Nilai |
| --- | --- |
| Direktori dasar | `api-contract` |
| Perintah build | `npm run build` |
| Direktori publikasi | `public` |
| Perintah pemasangan | `npm install` |

### Server web biasa

Salin isi folder ke direktori publik, misalnya `/var/www/find-holiday-api`. Pastikan:

- Berkas `index.html`, `openapi.json`, dan `mock-data.json` berada pada direktori yang sama.
- Folder `assets` dan `docs` ikut tersalin.
- Server mengirim `application/json` untuk berkas `.json`.
- Server mengirim `text/javascript` untuk berkas `.js`.
- Tidak ada aturan penulisan ulang yang mengarahkan semua permintaan ke `index.html`, karena permintaan `/api/v1/...` harus tetap ditangani simulasi di browser.

Contoh Nginx:

```nginx
server {
  listen 80;
  server_name contoh.findholiday.id;
  root /var/www/find-holiday-api;
  index index.html;

  location / {
    try_files $uri $uri/ =404;
  }
}
```

### Pemeriksaan setelah deploy

1. Buka halaman utama dan pastikan daftar endpoint tampil.
2. Jalankan `GET /health`. Respons harus `200` dan berisi `status: ok`.
3. Ganti peran ke admin lalu jalankan `GET /admin/dashboard`.
4. Pilih mode negatif lalu jalankan endpoint yang sama. Respons harus `500` atau kode negatif lain sesuai mode.
5. Buka tautan Dokumentasi dan pastikan seluruh bagian tampil.
6. Periksa konsol browser. Tidak boleh ada kesalahan JavaScript.

## Penanganan masalah

| Gejala | Kemungkinan penyebab | Tindakan |
| --- | --- | --- |
| Halaman kosong tanpa daftar endpoint | Dibuka melalui `file://` | Jalankan server statis, lalu buka alamat `http://` |
| Pesan data simulasi tidak dapat dimuat | `mock-data.json` belum dibuat atau tidak ikut tersalin | Jalankan `npm run build`, lalu salin ulang seluruh isi folder |
| Swagger menampilkan galat saat memuat kontrak | `openapi.json` rusak atau tidak ada | Jalankan `npm run build` lalu `npm run validate` |
| Endpoint selalu `404` | Metode atau path tidak ada pada data simulasi | Periksa metode pada Swagger dan nilai `X-Mock-Operation` |
| Endpoint selalu `403` pada mode positif | Peran aktif tidak sesuai | Ganti peran pada panel simulasi |
| Mode negatif mengembalikan kode lain | Endpoint tidak memiliki kode tersebut, sehingga dipakai contoh cadangan | Periksa `X-Mock-Error` dan daftar kasus negatif pada dokumentasi |
| Token lama masih terpakai | Swagger menyimpan otorisasi | Tekan Authorize, logout, atau tekan Atur ulang |
| Pilihan peran kembali ke wisatawan | Penyimpanan lokal dibersihkan | Pilih ulang peran pada panel |
| Tampilan berubah setelah pembaruan | Cache browser | Muat ulang paksa dengan Ctrl dan F5 |
| Ikon kecil tidak muncul pada tab | Tidak ada favicon | Halaman memakai ikon bawaan berbentuk data URI, jadi tidak perlu berkas tambahan |
| Berkas YAML terbuka sebagai teks | Server tidak mengenali tipe YAML | Tidak memengaruhi simulasi. Gunakan tautan unduh atau `openapi.json` |

### Menghapus pengaturan simulasi

Buka konsol browser lalu jalankan:

```js
localStorage.removeItem('fh-api-simulation-v1')
location.reload()
```

Atau tekan tombol Atur ulang pada panel simulasi.

## Daftar periksa sebelum demonstrasi

- `npm run build` berhasil tanpa galat.
- `npm run validate` menyatakan kontrak valid.
- Halaman dibuka melalui server, bukan `file://`.
- `GET /health` berhasil pada mode positif.
- Alur wisatawan berhasil: login, daftar itinerary, detail itinerary, rekomendasi.
- Alur mitra berhasil: daftar armada, detail armada.
- Alur admin berhasil: dashboard, daftar pengguna, verifikasi mitra.
- Mode negatif utama sudah dicoba: validasi, autentikasi, otorisasi, tidak ditemukan, konflik, batas permintaan, layanan pihak ketiga, kesalahan server.
- Respons `204` tidak menampilkan isi.
- Contoh GeoJSON tampil pada `GET /itineraries/{id}/route-geometry`.
- Tautan Dokumentasi terbuka dan seluruh bagian dapat dibaca.
- Tampilan tetap nyaman pada lebar layar ponsel.
- Konsol browser tidak menampilkan kesalahan.

## Keamanan dan kebersihan repositori

- `node_modules` tidak boleh masuk Git. Pastikan `.gitignore` memuat `node_modules/`.
- Folder `dist` juga tidak perlu masuk Git.
- Token pada simulasi hanya contoh. Jangan memakai token asli pada berkas ini.
- Jangan menambahkan data pribadi nyata ke `mock-data.json`.
- Bila kontrak dipublikasikan, ingat bahwa seluruh isi folder dapat dibaca siapa saja, termasuk contoh data.

## Menambah endpoint baru

1. Tambahkan definisi pada salah satu berkas `tools/endpoints-*.mjs`.
2. Tambahkan schema pada `tools/schemas.mjs` bila diperlukan.
3. Tambahkan data contoh pada `tools/data.mjs`.
4. Jalankan `npm run build` lalu `npm run validate`.
5. Uji endpoint baru pada mode positif dan minimal satu mode negatif.
6. Perbarui dokumen manual bila endpoint baru mengubah konvensi atau pemetaan basis data.

Setiap endpoint wajib memiliki `method`, `path`, `operationId`, `tag`, `summary`, `description`, `roles`, `success`, dan `errors`. Nilai `operationId` harus unik karena dipakai pada header simulasi dan dokumentasi.
