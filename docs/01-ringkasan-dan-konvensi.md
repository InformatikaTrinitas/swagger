# Ringkasan dan Konvensi API

Dokumen ini menjelaskan aturan umum yang berlaku pada seluruh endpoint. Tujuannya agar tim frontend, backend, dan penguji memakai pemahaman yang sama sebelum membaca katalog endpoint.

## Ruang lingkup

Kontrak mencakup seluruh alur utama aplikasi Find Holiday:

| Kelompok | Cakupan |
| --- | --- |
| Sistem | Pemeriksaan kesehatan layanan |
| Autentikasi dan Akun | Registrasi, login, logout, profil, kata sandi, penghapusan akun |
| Destinasi dan Ulasan | Daftar destinasi, destinasi populer, detail, fasilitas, ulasan |
| Wilayah dan Konteks | Wilayah layanan, cuaca, kondisi lalu lintas |
| Transportasi | Katalog moda, detail moda, moda yang tersedia untuk itinerary |
| Itinerary | Pembuatan, perubahan, penghapusan, urutan perhentian, geometri rute |
| Rekomendasi dan Riwayat | Perhitungan ulang, perbandingan strategi, detail faktor, riwayat, umpan balik |
| Notifikasi | Daftar peringatan, aliran event, status baca |
| Mitra | Pengelolaan armada dan jejak audit mitra |
| Admin | Pengelolaan pengguna, mitra, wilayah, destinasi, fasilitas, transportasi, konteks, itinerary, rekomendasi, notifikasi, ulasan, dan audit |

Ada tiga peran pengguna: `tourist`, `partner`, dan `admin`. Ditambah akses `public` untuk endpoint yang tidak memerlukan token.

## Alamat dasar dan versi

| Butir | Nilai |
| --- | --- |
| Alamat dasar | `https://<domain>/api/v1` |
| Versi pada URL | `v1` |
| Versi pada kontrak | `1.0.0` |
| Format | JSON dengan pengodean UTF-8 |

Aturan versi:

- Perubahan yang merusak kompatibilitas harus diterbitkan pada versi baru, misalnya `/api/v2`.
- Penambahan field opsional pada respons dianggap perubahan yang kompatibel.
- Penghapusan atau penggantian nama field harus melalui versi baru.
- Field baru yang wajib pada permintaan harus diberi nilai bawaan agar klien lama tetap berjalan.

## Aturan penamaan

- Path memakai huruf kecil dan tanda hubung, contoh `/transport-modes`, `/audit-logs`, `/route-geometry`.
- Nama field memakai `snake_case` agar sejajar dengan kolom basis data, contoh `tanggal_mulai`, `total_anggaran`, `status_verifikasi`.
- Nama field pada API dipertahankan dalam bahasa Indonesia karena mengikuti istilah pada dokumen kebutuhan dan basis data.
- ID memakai UUID berbentuk string 36 karakter.
- Endpoint daftar memakai bentuk jamak, contoh `/destinations`, `/itineraries`, `/notifications`.
- Endpoint aksi memakai kata kerja yang jelas, contoh `/recommendations/calculate`, `/notifications/read-all`, `/partners/{id}/verify`.

## Autentikasi

Autentikasi memakai Bearer token dengan pola Sanctum.

```http
Authorization: Bearer 1|fh_demo_tourist_9f8e7d6c5b4a39281706
```

Alur umum:

1. Klien memanggil `POST /auth/register` atau `POST /auth/login`.
2. Server mengembalikan objek `AuthSession` berisi `token`, `token_type`, dan `abilities`.
3. Klien mengirim token pada header `Authorization` untuk permintaan berikutnya.
4. `POST /auth/logout` mencabut token yang sedang dipakai.

Nilai `abilities` mengikuti peran:

| Peran | Kemampuan token |
| --- | --- |
| Wisatawan | `role:tourist` |
| Mitra | `role:partner` |
| Admin | `role:admin` |

Ketentuan penting:

- Endpoint bertanda publik tidak memerlukan token.
- Token yang tidak dikirim, kedaluwarsa, atau sudah dicabut menghasilkan `401 UNAUTHENTICATED`.
- Token yang valid tetapi perannya tidak sesuai menghasilkan `403 FORBIDDEN_ROLE`.
- Peran tidak dapat diubah melalui endpoint profil. Perubahan peran hanya dapat dilakukan admin melalui `PUT /admin/users/{id}`.
- Kata sandi tidak pernah dikembalikan pada respons apa pun.

### Matriks peran

| Kemampuan | Publik | Wisatawan | Mitra | Admin |
| --- | --- | --- | --- | --- |
| Registrasi dan login | Ya | Ya | Ya | Ya |
| Logout dan profil sendiri | Tidak | Ya | Ya | Ya |
| Melihat wilayah, destinasi, konteks, katalog transportasi | Ya | Ya | Ya | Ya |
| Menulis ulasan destinasi | Tidak | Ya | Tidak | Tidak |
| Mengelola itinerary sendiri | Tidak | Ya | Tidak | Tidak |
| Menerima notifikasi perjalanan | Tidak | Ya | Tidak | Tidak |
| Mengirim umpan balik rekomendasi | Tidak | Ya | Tidak | Tidak |
| Mengelola armada sendiri | Tidak | Tidak | Ya | Tidak |
| Melihat jejak audit mitra | Tidak | Tidak | Ya | Tidak |
| Mengelola data seluruh sistem | Tidak | Tidak | Tidak | Ya |

Admin tidak memakai endpoint itinerary milik wisatawan. Untuk melihat seluruh itinerary, admin memakai kelompok endpoint `/admin/itineraries`.

## Amplop respons sukses

Respons sukses memakai bentuk berikut:

```json
{
  "data": {
    "user_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01",
    "nama": "Alfian Hanif",
    "email": "alfian.hanif@example.com",
    "role": "tourist"
  },
  "message": "Profil berhasil diambil."
}
```

Ketentuan:

- `data` selalu ada pada respons sukses yang memiliki isi.
- `message` bersifat opsional dan boleh ditampilkan langsung kepada pengguna.
- `meta` hanya muncul pada respons daftar.
- Respons `204 No Content` tidak memiliki isi.

### Amplop respons daftar

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 4,
    "total_pages": 1
  }
}
```

### Pengecualian amplop

Ada dua endpoint yang tidak memakai amplop standar:

| Endpoint | Bentuk respons | Alasan |
| --- | --- | --- |
| `GET /itineraries/{id}/route-geometry` | GeoJSON `FeatureCollection` langsung | Pustaka peta memerlukan format GeoJSON tanpa pembungkus |
| `GET /itineraries/{id}/alerts/stream` | `text/event-stream` | Aliran Server-Sent Events dikirim sebagai baris event |

## Amplop respons kesalahan

Seluruh kesalahan memakai bentuk berikut:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data yang dikirim belum lengkap atau formatnya belum benar.",
    "details": [
      {
        "field": "email",
        "message": "Format email belum benar."
      }
    ]
  },
  "request_id": "req_demo_0001"
}
```

Ketentuan:

- `error.code` bersifat stabil dan cocok untuk logika program.
- `error.message` dapat ditampilkan kepada pengguna.
- `error.details` bersifat opsional dan dipakai terutama pada kesalahan validasi.
- `request_id` dipakai untuk menelusuri log. Nilai pada simulasi dibuat otomatis.
- Jangan menampilkan jejak tumpukan, nama tabel, atau pesan basis data kepada pengguna.

## Kode status

| Status | Arti | Kapan dipakai |
| --- | --- | --- |
| `200` | Berhasil | Permintaan baca atau perubahan yang mengembalikan data |
| `201` | Dibuat | Registrasi, pembuatan itinerary, ulasan, armada, wilayah, destinasi, fasilitas, transportasi, konteks, umpan balik |
| `204` | Berhasil tanpa isi | Logout, hapus akun, hapus itinerary, hapus data admin |
| `400` | Permintaan tidak dapat diproses | Nilai filter atau rentang tanggal tidak valid |
| `401` | Belum terautentikasi | Token tidak ada, tidak valid, atau sudah dicabut |
| `403` | Tidak berwenang | Peran tidak sesuai atau data bukan milik pengguna |
| `404` | Tidak ditemukan | ID tidak ada atau data sudah dihapus |
| `409` | Konflik | Duplikasi data atau perubahan yang bertentangan dengan keadaan saat ini |
| `422` | Validasi gagal | Field wajib kosong, format salah, atau nilai di luar rentang |
| `429` | Terlalu banyak permintaan | Batas permintaan atau percobaan login terlampaui |
| `500` | Kesalahan server | Kegagalan tak terduga |
| `503` | Layanan pihak ketiga terganggu | Layanan cuaca atau mesin rekomendasi tidak tersedia |

Perbedaan `400` dan `422`:

- `400` dipakai untuk parameter pada URL, misalnya filter dengan format salah.
- `422` dipakai untuk isi permintaan, misalnya email tidak valid atau kata sandi terlalu pendek.

## Daftar kode kesalahan

### 400

| Kode | Arti |
| --- | --- |
| `BAD_REQUEST` | Parameter filter, rentang tanggal, atau nilai query tidak dapat diproses |

### 401

| Kode | Arti |
| --- | --- |
| `UNAUTHENTICATED` | Token tidak dikirim, tidak valid, atau sudah dicabut |
| `INVALID_CREDENTIALS` | Pasangan email dan kata sandi tidak cocok |

### 403

| Kode | Arti |
| --- | --- |
| `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin, atau data bukan milik pengguna |

### 404

| Kode | Arti |
| --- | --- |
| `NOT_FOUND` | Data yang diminta tidak ditemukan |

### 409

| Kode | Arti |
| --- | --- |
| `EMAIL_ALREADY_USED` | Email sudah dipakai akun lain |
| `ALREADY_VERIFIED` | Status verifikasi mitra sudah sama dengan permintaan |
| `CONTEXT_IN_USE` | Konteks lingkungan masih dirujuk rekomendasi |
| `FACILITY_ALREADY_EXISTS` | Jenis fasilitas yang sama sudah ada pada tempat tersebut |
| `FEEDBACK_ALREADY_EXISTS` | Umpan balik untuk rekomendasi itu sudah pernah dikirim |
| `FLEET_ALREADY_EXISTS` | Armada dengan nama dan jenis yang sama sudah terdaftar |
| `FLEET_IN_USE` | Armada masih dipakai itinerary atau segmen perjalanan |
| `ITINERARY_ACTIVE` | Itinerary aktif harus diselesaikan atau dibatalkan sebelum dihapus |
| `ITINERARY_LOCKED` | Itinerary selesai atau dibatalkan tidak dapat diubah |
| `LAST_ADMIN` | Akun atau peran admin terakhir tidak dapat dihapus atau diubah |
| `NO_AVAILABLE_MODES` | Tidak ada moda yang sesuai preferensi |
| `PLACE_ALREADY_EXISTS` | Destinasi dengan nama dan alamat yang sama sudah ada |
| `PLACE_IN_USE` | Destinasi masih dipakai itinerary atau memiliki data terkait |
| `REGION_ALREADY_EXISTS` | Nama wilayah sudah dipakai |
| `REGION_IN_USE` | Wilayah masih memiliki destinasi atau moda transportasi |
| `REVIEW_ALREADY_EXISTS` | Wisatawan sudah menulis ulasan untuk destinasi tersebut |
| `ROUTE_NOT_READY` | Rute belum dapat digambar karena perhentian belum cukup |
| `TRANSPORT_ALREADY_EXISTS` | Nama moda transportasi sudah dipakai |
| `TRANSPORT_IN_USE` | Moda transportasi masih dipakai itinerary atau segmen perjalanan |
| `USER_HAS_ACTIVE_DATA` | Pengguna masih memiliki itinerary aktif |
| `CONFLICT` | Konflik umum yang belum memiliki kode khusus |

### 422

| Kode | Arti |
| --- | --- |
| `VALIDATION_ERROR` | Satu atau beberapa field tidak lolos validasi |
| `INVALID_PASSWORD` | Kata sandi lama tidak cocok saat mengubah kata sandi |

### 429

| Kode | Arti |
| --- | --- |
| `RATE_LIMITED` | Batas permintaan atau percobaan terlampaui |

### 500 dan 503

| Kode | Arti |
| --- | --- |
| `INTERNAL_ERROR` | Kesalahan tak terduga pada server |
| `UPSTREAM_UNAVAILABLE` | Layanan cuaca atau mesin rekomendasi tidak tersedia |

Kode `MOCK_DATA_UNAVAILABLE` hanya muncul pada simulasi bila `mock-data.json` gagal dimuat. Kode ini tidak termasuk kontrak produksi.

## Penomoran halaman

Endpoint daftar menerima parameter berikut:

| Parameter | Tipe | Bawaan | Keterangan |
| --- | --- | --- | --- |
| `page` | integer | 1 | Halaman yang diminta |
| `per_page` | integer | 10 | Jumlah data per halaman, maksimum 100 |

Nilai di luar batas menghasilkan `400 BAD_REQUEST`. Respons menyertakan `meta` berisi `page`, `per_page`, `total`, dan `total_pages`.

Bila halaman yang diminta melebihi jumlah halaman, server mengembalikan `data` kosong dengan `meta` yang tetap valid. Ini bukan kesalahan.

## Filter, pencarian, dan urutan

- Filter memakai nama field sebagai parameter query, contoh `?status_rencana=aktif&wilayah_id=<uuid>`.
- Pencarian kata kunci memakai parameter `q`.
- Urutan memakai parameter `sort` dengan nilai yang dibatasi pada setiap endpoint.
- Filter yang tidak dikenal diabaikan, tetapi nilai yang tidak valid pada filter yang dikenal menghasilkan `400 BAD_REQUEST`.
- Nilai boolean pada query ditulis `true` atau `false`.

## Tanggal, waktu, dan angka

| Jenis | Format | Contoh |
| --- | --- | --- |
| Tanggal | `YYYY-MM-DD` | `2026-11-14` |
| Waktu | `YYYY-MM-DD HH:MM:SS` | `2026-10-30 14:10:00` |
| Zona waktu | Asia/Jakarta | Waktu Indonesia Barat |
| Uang | Angka dalam rupiah, tanpa pemisah ribuan | `1500000` |
| Koordinat | Derajat desimal | `-6.902484` |
| Skor | Angka 0 sampai 1 | `0.94` |
| Rating | Angka 1 sampai 5 | `4.7` |

Catatan:

- Uang dikirim sebagai angka, bukan string. Pembulatan dan pemisah tampilan menjadi tanggung jawab antarmuka.
- Waktu pada basis data disimpan tanpa zona waktu. Kontrak menetapkan bahwa nilai tersebut adalah waktu Asia/Jakarta.
- Selisih waktu antarserver dan klien tidak boleh mengubah arti `terakhir_diperbarui` atau `generated_at`.

## Boolean dan nilai kosong

Basis data menyimpan beberapa nilai sebagai `0` atau `1`. Pada API nilai tersebut dikirim sebagai boolean:

| Kolom basis data | Field API | Nilai API |
| --- | --- | --- |
| `status_aktif` | `status_aktif` | `true` atau `false` |
| `status_verifikasi` | `status_verifikasi` | `true` atau `false` |
| `is_gratis` | `is_gratis` | `true` atau `false` |
| `is_dibaca` | `is_dibaca` | `true` atau `false` |
| `status_publikasi` | `status_publikasi` | `true` atau `false` |
| `ada_insiden_kecelakaan` | `ada_insiden_kecelakaan` | `true` atau `false` |
| `hindari_jalan_kaki_jauh` | `hindari_jalan_kaki_jauh` | `true` atau `false` |
| `is_manual_selected` | `is_manual_selected` | `true` atau `false` |
| `is_jalur_pedestrian_tersedia` | `is_jalur_pedestrian_tersedia` | `true` atau `false` |
| `termasuk_driver` | `termasuk_driver` | `true` atau `false` |

Field yang boleh kosong dikirim sebagai `null`, bukan string kosong. Field yang tidak relevan untuk suatu peran tidak dikirim sama sekali, misalnya `nama_perusahaan` tidak muncul pada profil wisatawan.

## Header

Header yang dipakai pada respons:

| Header | Keterangan |
| --- | --- |
| `Content-Type` | `application/json`, `text/event-stream`, atau tidak ada pada `204` |
| `X-Request-Id` | ID permintaan untuk penelusuran log |

Header tambahan yang hanya muncul pada simulasi:

| Header | Keterangan |
| --- | --- |
| `X-Mock-Role` | Peran aktif saat permintaan dijalankan |
| `X-Mock-Scenario` | Skenario respons yang dipilih |
| `X-Mock-Operation` | `operationId` endpoint yang dijawab |
| `X-Mock-Result` | `positif` atau `negatif` |
| `X-Mock-Error` | Kode kesalahan pada respons negatif |

Header simulasi tidak termasuk kontrak produksi dan tidak boleh dipakai aplikasi.

## Batas permintaan

Endpoint berikut memiliki kemungkinan respons `429 RATE_LIMITED`:

- `POST /auth/register`
- `POST /auth/login`
- `POST /destinations/{id}/reviews`
- `POST /itineraries`
- `POST /itineraries/{id}/recommendations/calculate`
- `GET /itineraries/{id}/alerts/stream`

Ketentuan yang disarankan untuk implementasi:

- Batasi percobaan login per kombinasi email dan alamat IP.
- Batasi pembuatan itinerary dan perhitungan ulang rekomendasi per pengguna.
- Batasi jumlah koneksi aliran event per pengguna.
- Sertakan `Retry-After` pada respons `429` agar klien tahu kapan boleh mencoba lagi. Header ini belum diwajibkan pada kontrak versi ini.

## Keamanan

- Gunakan HTTPS pada semua lingkungan selain pengembangan lokal.
- Simpan token hanya pada penyimpanan yang aman. Untuk aplikasi web, hindari menyimpan token pada `localStorage` bila ada pilihan yang lebih aman.
- Jangan mencatat token, kata sandi, atau isi header `Authorization` pada log.
- Periksa kepemilikan data pada setiap endpoint yang memakai ID, bukan hanya peran pengguna.
- Pesan `403` tidak boleh mengungkap apakah data ada atau tidak. Gunakan pesan umum seperti "data bukan milik akun yang sedang masuk".
- Endpoint publik hanya boleh menampilkan data yang memang layak untuk publik, misalnya ulasan dengan `status_publikasi` bernilai `true`.
