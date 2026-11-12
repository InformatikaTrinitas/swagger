# Dokumentasi Kontrak API Find Holiday

Folder ini memuat kontrak API Find Holiday beserta simulasi Swagger yang dapat dijalankan tanpa backend. Seluruh isi folder bersifat statis, sehingga dapat dibuka dari server berkas apa pun atau diunggah ke layanan hosting statis.

## Ringkasan

| Butir | Nilai |
| --- | --- |
| Versi kontrak | 1.0.0 |
| Format | OpenAPI 3.0.3 |
| Base path | `/api/v1` |
| Jumlah path | 59 |
| Jumlah operasi | 83 |
| Jumlah kelompok endpoint | 10 |
| Autentikasi | Bearer token, pola Sanctum |
| Format data | JSON, kecuali satu endpoint GeoJSON dan satu endpoint aliran event |

Kontrak disusun dari dokumen kebutuhan pada `MAIN-REQUIREMENTS.md`, dokumen DFD-01 sampai DFD-10 pada folder `plans/functionalities`, dokumen arsitektur dan pengujian, serta skema basis data pada `sql/db_ppl.sql`.

## Isi folder

| Berkas atau folder | Keterangan |
| --- | --- |
| `index.html` | Halaman simulasi Swagger dengan panel peran dan skenario respons |
| `mock.js` | Lapisan simulasi yang menjawab permintaan `/api/v1/*` di browser |
| `mock-data.json` | Data jawaban simulasi yang dibuat saat proses build |
| `openapi.yaml` | Kontrak OpenAPI dalam bentuk YAML |
| `openapi.json` | Kontrak OpenAPI dalam bentuk JSON, dipakai halaman Swagger |
| `assets/` | Berkas Swagger UI yang disimpan lokal agar tidak bergantung jaringan |
| `docs/` | Dokumentasi Markdown dan halaman dokumentasi HTML |
| `Find-Holiday-API-Contract.docx` | Dokumen Word berisi pemanggilan, respons positif, dan kasus negatif |
| `public/` | Salinan siap deploy yang dibuat oleh `npm run build` |
| `tools/` | Sumber kebenaran kontrak dan skrip build, validasi, serta server lokal |
| `styles.css` | Gaya halaman simulasi |
| `package.json` | Perintah build, validasi, dan server lokal |

## Cara membuka

Simulasi memuat `openapi.json` dan `mock-data.json` melalui permintaan berkas. Karena itu halaman harus dibuka melalui server berkas, bukan dengan klik dua kali pada `index.html`.

```bash
cd api-contract
npm install
npm run serve
```

Lalu buka `http://127.0.0.1:4173/`.

Bila tidak ingin memasang dependensi, folder ini juga dapat disajikan dengan server statis lain, misalnya:

```bash
npx serve .
```

atau

```bash
python -m http.server 4173
```

## Cara mencoba endpoint

1. Pilih peran aktif pada panel simulasi: wisatawan, mitra transportasi, atau administrator.
2. Pilih mode respons. Mode positif mengembalikan kode 2xx. Mode negatif mengembalikan contoh kesalahan yang relevan.
3. Buka salah satu endpoint, tekan Try it out, lalu tekan Execute.
4. Periksa kode status, header, dan isi respons. Nilai `X-Mock-Role` dan `X-Mock-Scenario` menunjukkan pengaturan yang sedang dipakai.

Tidak ada permintaan yang dikirim ke server. Seluruh jawaban dibuat di browser dari `mock-data.json`.

## Peta dokumen

| Dokumen | Isi |
| --- | --- |
| [Ringkasan dan Konvensi](./01-ringkasan-dan-konvensi.md) | Pola URL, autentikasi, amplop respons, kode status, penomoran halaman, dan daftar kode kesalahan |
| [Katalog Endpoint](./02-katalog-endpoint.md) | Tabel seluruh endpoint per kelompok, peran yang diizinkan, kode sukses, dan kasus negatif |
| [Contoh Positif dan Negatif](./03-contoh-positif-negatif.md) | Contoh isi respons untuk setiap endpoint beserta daftar kasus gagal |
| [Pemetaan Basis Data](./04-pemetaan-basis-data.md) | Hubungan tabel SQL dengan resource API, kolom turunan, dan usulan perubahan skema |
| [Simulasi dan Deploy](./05-simulasi-dan-deploy.md) | Cara kerja simulasi, perintah build, pilihan hosting, dan penanganan masalah |
| [Traceability Kebutuhan](./06-traceability-kf.md) | Hubungan setiap KF dan KNF dengan endpoint pada kontrak |

## Batasan yang perlu diketahui

- Simulasi tidak menyimpan perubahan. Permintaan POST, PUT, PATCH, dan DELETE hanya mengembalikan contoh respons.
- Aliran Server-Sent Events pada `GET /itineraries/{id}/alerts/stream` tidak dapat dijalankan penuh dari Swagger UI. Contoh event ditampilkan pada dokumentasi.
- Perhitungan rekomendasi, cuaca, dan lalu lintas tidak dijalankan. Kontrak hanya menetapkan bentuk permintaan dan respons.
- Token yang dipakai adalah token contoh. Jangan dipakai pada lingkungan nyata.
- Beberapa endpoint memerlukan penyesuaian skema basis data. Rinciannya ada pada [Pemetaan Basis Data](./04-pemetaan-basis-data.md).

## Membangun ulang kontrak

Semua berkas hasil build dibuat dari `tools/`. Jangan mengubah `openapi.yaml`, `openapi.json`, `mock-data.json`, `docs/02-katalog-endpoint.md`, `docs/03-contoh-positif-negatif.md`, atau `docs/index.html` secara langsung karena perubahan akan tertimpa.

```bash
npm run build
npm run validate
npm run docx
```

`npm run build` menulis ulang kontrak, data simulasi, aset Swagger UI, halaman dokumentasi, dan folder `public` yang siap diunggah ke hosting statis. `npm run validate` memeriksa keabsahan kontrak dengan `@apidevtools/swagger-parser`. `npm run docx` membuat `Find-Holiday-API-Contract.docx` dari sumber yang sama.
