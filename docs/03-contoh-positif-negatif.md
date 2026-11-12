# Contoh Positif dan Negatif per Endpoint

Setiap bagian memperlihatkan contoh respons positif dan daftar kasus negatif. Semua contoh dapat dicoba pada halaman Swagger dengan memilih peran dan skenario respons.

## Sistem

### GET /health

Memeriksa status layanan utama, basis data, layanan cuaca, dan mesin rekomendasi. Endpoint ini dapat dipanggil tanpa token.

- Peran: **Publik**
- Sukses: **200** Layanan berjalan normal.
- Kebutuhan: KNF-02

**Contoh respons positif**

```json
{
  "data": {
    "status": "ok",
    "service": "find-holiday-api",
    "version": "1.0.0",
    "waktu": "2026-10-30 15:50:00",
    "pemeriksaan": {
      "database": "ok",
      "weather_service": "ok",
      "recommendation_engine": "ok"
    }
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Format parameter pada permintaan cek kesehatan layanan tidak valid atau nilai query di luar batas yang diizinkan. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Format parameter pada permintaan cek kesehatan layanan tidak valid atau nilai query di luar batas yang diizinkan."   },   "request_id": "req_demo_0001" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0002" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0003" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi."   },   "request_id": "req_demo_0004" }` |

## Autentikasi dan Akun

### POST /auth/register

Membuat akun wisatawan atau mitra. Pendaftaran admin tidak tersedia dari endpoint publik. Setelah berhasil, token Bearer langsung dikirim agar pengguna dapat masuk ke aplikasi.

- Peran: **Publik**
- Sukses: **201** Akun berhasil dibuat.
- Kebutuhan: KF-03

**Contoh respons positif**

```json
{
  "data": {
    "user": {
      "user_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e99",
      "nama": "Budi Santoso",
      "email": "budi.santoso@example.com",
      "nomor_telepon": "+6281234567890",
      "role": "tourist",
      "profil": {
        "preferensi_umum": "Wisata Budaya & Kuliner",
        "jumlah_itinerary": 0,
        "jumlah_notifikasi_belum_dibaca": 0
      }
    },
    "token": "1|fh_demo_tourist_9f8e7d6c5b4a39281706",
    "token_type": "Bearer",
    "abilities": [
      "role:tourist"
    ]
  },
  "message": "Akun berhasil dibuat. Token sudah dapat dipakai."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Struktur tubuh permintaan (request body) tidak dapat diproses atau format JSON rusak. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Struktur tubuh permintaan (request body) tidak dapat diproses atau format JSON rusak."   },   "request_id": "req_demo_0001" }` |
| 409 | `EMAIL_ALREADY_USED` | Email sudah dipakai oleh akun lain. | `{   "error": {     "code": "EMAIL_ALREADY_USED",     "message": "Email sudah dipakai oleh akun lain."   },   "request_id": "req_demo_0002" }` |
| 422 | `VALIDATION_ERROR` | Data pendaftaran belum lengkap atau formatnya belum benar. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data pendaftaran belum lengkap atau formatnya belum benar.",     "details": [       {         "field": "email",         "message": "Format email belum benar."       },       {         "field": "password",         "message": "Kata sandi minimal 8 karakter."       }     ]   },   "request_id": "req_demo_0003" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak percobaan pendaftaran. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak percobaan pendaftaran. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0004" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0005" }` |

### POST /auth/login

Memeriksa email dan kata sandi, lalu membuat token Bearer dengan izin sesuai peran. Respons contoh tersedia untuk wisatawan, mitra, dan admin melalui pilihan peran pada halaman simulasi.

- Peran: **Publik**
- Sukses: **200** Login berhasil.
- Kebutuhan: KF-01, KF-02

**Contoh respons positif**

```json
{
  "data": {
    "user": {
      "user_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01",
      "nama": "Alfian Hanif",
      "email": "alfian.hanif@example.com",
      "nomor_telepon": "+6281321001001",
      "role": "tourist",
      "profil": {
        "preferensi_umum": "Wisata Budaya & Kuliner",
        "jumlah_itinerary": 2,
        "jumlah_notifikasi_belum_dibaca": 3
      }
    },
    "token": "1|fh_demo_tourist_9f8e7d6c5b4a39281706",
    "token_type": "Bearer",
    "abilities": [
      "role:tourist"
    ]
  },
  "message": "Login berhasil."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Struktur tubuh permintaan (request body) tidak dapat diproses atau format JSON rusak. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Struktur tubuh permintaan (request body) tidak dapat diproses atau format JSON rusak."   },   "request_id": "req_demo_0001" }` |
| 401 | `INVALID_CREDENTIALS` | Email atau kata sandi tidak cocok. Periksa kembali data Anda. | `{   "error": {     "code": "INVALID_CREDENTIALS",     "message": "Email atau kata sandi tidak cocok. Periksa kembali data Anda."   },   "request_id": "req_demo_0002" }` |
| 409 | `CONFLICT` | Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas). | `{   "error": {     "code": "CONFLICT",     "message": "Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas)."   },   "request_id": "req_demo_0003" }` |
| 422 | `VALIDATION_ERROR` | Email atau kata sandi belum diisi dengan benar. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Email atau kata sandi belum diisi dengan benar.",     "details": [       {         "field": "email",         "message": "Email wajib diisi."       },       {         "field": "password",         "message": "Kata sandi wajib diisi."       }     ]   },   "request_id": "req_demo_0004" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak percobaan login. Coba lagi setelah beberapa menit. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak percobaan login. Coba lagi setelah beberapa menit."   },   "request_id": "req_demo_0005" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0006" }` |

### POST /auth/logout

Mencabut token yang sedang dipakai. Setelah berhasil, token tidak dapat digunakan lagi.

- Peran: **Wisatawan, Mitra, Admin**
- Sukses: **204** Token berhasil dicabut. Tidak ada isi respons.
- Kebutuhan: KF-01

**Contoh respons positif**

Tidak ada isi respons. Server hanya mengembalikan kode 204.

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 409 | `CONFLICT` | Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas). | `{   "error": {     "code": "CONFLICT",     "message": "Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas)."   },   "request_id": "req_demo_0004" }` |
| 422 | `VALIDATION_ERROR` | Data input untuk keluar dari aplikasi tidak lolos validasi aturan bisnis atau format field. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data input untuk keluar dari aplikasi tidak lolos validasi aturan bisnis atau format field.",     "details": [       {         "field": "payload",         "message": "Terdapat isian yang belum lengkap atau nilainya berada di luar batasan yang ditentukan."       }     ]   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### GET /user/profile

Mengembalikan data pengguna yang sedang masuk beserta profil tambahan sesuai peran. Respons menyesuaikan peran aktif pada halaman simulasi.

- Peran: **Wisatawan, Mitra, Admin**
- Sukses: **200** Profil berhasil diambil.
- Kebutuhan: KF-05

**Contoh respons positif**

_Wisatawan_

```json
{
  "data": {
    "user_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01",
    "nama": "Alfian Hanif",
    "email": "alfian.hanif@example.com",
    "nomor_telepon": "+6281321001001",
    "role": "tourist",
    "profil": {
      "preferensi_umum": "Wisata Budaya & Kuliner",
      "jumlah_itinerary": 2,
      "jumlah_notifikasi_belum_dibaca": 3
    }
  }
}
```

_Mitra_

```json
{
  "data": {
    "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
    "nama": "Dewi Lestari",
    "email": "dewi.lestari@bandungjayatour.co.id",
    "nomor_telepon": "+622242020011",
    "role": "partner",
    "profil": {
      "nama_perusahaan": "PT Bandung Jaya Tour",
      "legalitas_doc_url": "/docs/legalitas-bandung-jaya.txt",
      "status_verifikasi": true,
      "verified_by_admin_id": "7d3c9b1a-4e2f-4c83-b015-3c4d5e6f7a21",
      "jumlah_armada": 3
    }
  }
}
```

_Admin_

```json
{
  "data": {
    "user_id": "7d3c9b1a-4e2f-4c83-b015-3c4d5e6f7a21",
    "nama": "Tantan Nugraha",
    "email": "tantan.nugraha@findholiday.id",
    "nomor_telepon": "+6281122004001",
    "role": "admin",
    "profil": {
      "admin_level": "super_admin",
      "departemen": "Operasional",
      "terakhir_aktif": "2026-10-30 15:42:00"
    }
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0004" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0005" }` |

### PUT /user/profile

Mengubah nama, kontak, atau profil tambahan sesuai peran. Peran akun tidak dapat diubah melalui endpoint ini.

- Peran: **Wisatawan, Mitra, Admin**
- Sukses: **200** Profil berhasil diperbarui.
- Kebutuhan: KF-04

**Contoh respons positif**

```json
{
  "data": {
    "user_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01",
    "nama": "Alfian Hanif",
    "email": "alfian.hanif@example.com",
    "nomor_telepon": "+6281321001001",
    "role": "tourist",
    "profil": {
      "preferensi_umum": "Wisata Budaya & Kuliner",
      "jumlah_itinerary": 2,
      "jumlah_notifikasi_belum_dibaca": 3
    }
  },
  "message": "Profil berhasil diperbarui."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Struktur tubuh permintaan (request body) tidak dapat diproses atau format JSON rusak. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Struktur tubuh permintaan (request body) tidak dapat diproses atau format JSON rusak."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Akses ditolak. Peran aktif Anda tidak memiliki izin untuk ubah profil pengguna. Endpoint ini dibatasi untuk peran: Wisatawan, Mitra, Admin. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Akses ditolak. Peran aktif Anda tidak memiliki izin untuk ubah profil pengguna. Endpoint ini dibatasi untuk peran: Wisatawan, Mitra, Admin."   },   "request_id": "req_demo_0003" }` |
| 409 | `EMAIL_ALREADY_USED` | Email sudah dipakai oleh akun lain. | `{   "error": {     "code": "EMAIL_ALREADY_USED",     "message": "Email sudah dipakai oleh akun lain."   },   "request_id": "req_demo_0004" }` |
| 422 | `VALIDATION_ERROR` | Data profil belum lengkap atau formatnya belum benar. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data profil belum lengkap atau formatnya belum benar.",     "details": [       {         "field": "email",         "message": "Format email belum benar."       }     ]   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### PUT /user/password

Mengganti kata sandi setelah memeriksa kata sandi lama. Setelah berhasil, token lama tetap berlaku sampai dicabut melalui logout.

- Peran: **Wisatawan, Mitra, Admin**
- Sukses: **200** Kata sandi berhasil diperbarui.
- Kebutuhan: KF-04

**Contoh respons positif**

```json
{
  "data": {
    "diperbarui": true
  },
  "message": "Kata sandi berhasil diperbarui."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Struktur tubuh permintaan (request body) tidak dapat diproses atau format JSON rusak. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Struktur tubuh permintaan (request body) tidak dapat diproses atau format JSON rusak."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Akses ditolak. Peran aktif Anda tidak memiliki izin untuk ubah kata sandi. Endpoint ini dibatasi untuk peran: Wisatawan, Mitra, Admin. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Akses ditolak. Peran aktif Anda tidak memiliki izin untuk ubah kata sandi. Endpoint ini dibatasi untuk peran: Wisatawan, Mitra, Admin."   },   "request_id": "req_demo_0003" }` |
| 409 | `CONFLICT` | Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas). | `{   "error": {     "code": "CONFLICT",     "message": "Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas)."   },   "request_id": "req_demo_0004" }` |
| 422 | `VALIDATION_ERROR` | Kata sandi baru belum memenuhi syarat. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Kata sandi baru belum memenuhi syarat.",     "details": [       {         "field": "password",         "message": "Kata sandi minimal 8 karakter."       }     ]   },   "request_id": "req_demo_0005" }` |
| 422 | `INVALID_PASSWORD` | Kata sandi lama tidak cocok. | `{   "error": {     "code": "INVALID_PASSWORD",     "message": "Kata sandi lama tidak cocok."   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |

### DELETE /user/account

Menghapus akun beserta data profil. Penghapusan akun wisatawan juga menghapus itinerary dan data turunannya sesuai aturan cascade pada basis data.

- Peran: **Wisatawan, Mitra, Admin**
- Sukses: **204** Akun berhasil dihapus. Tidak ada isi respons.
- Kebutuhan: KF-04, KNF-03

**Contoh respons positif**

Tidak ada isi respons. Server hanya mengembalikan kode 204.

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Format parameter pada permintaan hapus akun pengguna tidak valid atau nilai query di luar batas yang diizinkan. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Format parameter pada permintaan hapus akun pengguna tidak valid atau nilai query di luar batas yang diizinkan."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Akses ditolak. Peran aktif Anda tidak memiliki izin untuk hapus akun pengguna. Endpoint ini dibatasi untuk peran: Wisatawan, Mitra, Admin. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Akses ditolak. Peran aktif Anda tidak memiliki izin untuk hapus akun pengguna. Endpoint ini dibatasi untuk peran: Wisatawan, Mitra, Admin."   },   "request_id": "req_demo_0003" }` |
| 409 | `LAST_ADMIN` | Akun admin terakhir tidak dapat dihapus karena akan menghilangkan akses administrasi. | `{   "error": {     "code": "LAST_ADMIN",     "message": "Akun admin terakhir tidak dapat dihapus karena akan menghilangkan akses administrasi."   },   "request_id": "req_demo_0004" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0005" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0006" }` |

## Destinasi dan Ulasan

### GET /destinations

Menampilkan destinasi dengan filter wilayah, kategori, kata kunci, dan urutan. Digunakan oleh halaman jelajah dan peta.

- Peran: **Publik**
- Sukses: **200** Daftar destinasi berhasil diambil.
- Kebutuhan: KF-06, KF-07

**Contoh respons positif**

```json
{
  "data": [
    {
      "place_id": "b1000000-0000-4000-8000-000000000001",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_tempat": "Gedung Sate",
      "alamat_lengkap": "Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan",
      "latitude": -6.902484,
      "longitude": 107.618765,
      "rating_rata_rata": 4.7,
      "jumlah_review": 3210,
      "jam_buka": "08:00",
      "jam_tutup": "16:00",
      "daftar_foto_url": [
        "/media/gedung-sate-1.jpg",
        "/media/gedung-sate-2.jpg"
      ],
      "kategori_wisata": "sejarah",
      "estimasi_durasi_kunjungan": 90,
      "harga_tiket_masuk": 5000,
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "fasilitas": [
        {
          "fasilitas_id": "fa1000000-0000-4000-8000-000000000001",
          "place_id": "b1000000-0000-4000-8000-000000000001",
          "jenis": "ATM",
          "is_gratis": true,
          "fasilitas_tersedia": [
            "ATM BCA",
            "ATM Mandiri",
            "Area parkir"
          ]
        },
        {
          "fasilitas_id": "fa1000000-0000-4000-8000-000000000002",
          "place_id": "b1000000-0000-4000-8000-000000000001",
          "jenis": "TOILET_UMUM",
          "is_gratis": true,
          "fasilitas_tersedia": [
            "Toilet pria",
            "Toilet wanita",
            "Mushola"
          ]
        }
      ]
    },
    {
      "place_id": "b1000000-0000-4000-8000-000000000002",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_tempat": "Braga Heritage Walk",
      "alamat_lengkap": "Jl. Braga, Kec. Sumur Bandung",
      "latitude": -6.917464,
      "longitude": 107.60981,
      "rating_rata_rata": 4.6,
      "jumlah_review": 2890,
      "jam_buka": "00:00",
      "jam_tutup": "24:00",
      "daftar_foto_url": [
        "/media/braga-1.jpg"
      ],
      "kategori_wisata": "budaya",
      "estimasi_durasi_kunjungan": 75,
      "harga_tiket_masuk": 0,
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "fasilitas": [
        {
          "fasilitas_id": "fa1000000-0000-4000-8000-000000000003",
          "place_id": "b1000000-0000-4000-8000-000000000002",
          "jenis": "RESTORAN_KULINER",
          "is_gratis": false,
          "fasilitas_tersedia": [
            "Kafe",
            "Restoran sunda",
            "Food court"
          ]
        }
      ]
    },
    {
      "place_id": "b1000000-0000-4000-8000-000000000003",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_tempat": "Saung Angklung Udjo",
      "alamat_lengkap": "Jl. Padasuka No.118, Cibeunying Kidul",
      "latitude": -6.89753,
      "longitude": 107.63551,
      "rating_rata_rata": 4.8,
      "jumlah_review": 4100,
      "jam_buka": "09:00",
      "jam_tutup": "17:00",
      "daftar_foto_url": [
        "/media/saung-angklung-1.jpg"
      ],
      "kategori_wisata": "budaya",
      "estimasi_durasi_kunjungan": 120,
      "harga_tiket_masuk": 85000,
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "fasilitas": [
        {
          "fasilitas_id": "fa1000000-0000-4000-8000-000000000004",
          "place_id": "b1000000-0000-4000-8000-000000000003",
          "jenis": "TOILET_UMUM",
          "is_gratis": true,
          "fasilitas_tersedia": [
            "Toilet",
            "Mushola",
            "Area tunggu"
          ]
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 3,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Filter destinasi tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Filter destinasi tidak valid."   },   "request_id": "req_demo_0001" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0002" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0003" }` |

### GET /destinations/popular

Menampilkan destinasi populer berdasarkan rating dan jumlah ulasan. Cocok untuk kartu beranda dan penanda awal pada peta.

- Peran: **Publik**
- Sukses: **200** Daftar destinasi populer berhasil diambil.
- Kebutuhan: KF-06, KF-07

**Contoh respons positif**

```json
{
  "data": [
    {
      "place_id": "b1000000-0000-4000-8000-000000000001",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_tempat": "Gedung Sate",
      "alamat_lengkap": "Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan",
      "latitude": -6.902484,
      "longitude": 107.618765,
      "rating_rata_rata": 4.7,
      "jumlah_review": 3210,
      "jam_buka": "08:00",
      "jam_tutup": "16:00",
      "daftar_foto_url": [
        "/media/gedung-sate-1.jpg",
        "/media/gedung-sate-2.jpg"
      ],
      "kategori_wisata": "sejarah",
      "estimasi_durasi_kunjungan": 90,
      "harga_tiket_masuk": 5000,
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "fasilitas": [
        {
          "fasilitas_id": "fa1000000-0000-4000-8000-000000000001",
          "place_id": "b1000000-0000-4000-8000-000000000001",
          "jenis": "ATM",
          "is_gratis": true,
          "fasilitas_tersedia": [
            "ATM BCA",
            "ATM Mandiri",
            "Area parkir"
          ]
        },
        {
          "fasilitas_id": "fa1000000-0000-4000-8000-000000000002",
          "place_id": "b1000000-0000-4000-8000-000000000001",
          "jenis": "TOILET_UMUM",
          "is_gratis": true,
          "fasilitas_tersedia": [
            "Toilet pria",
            "Toilet wanita",
            "Mushola"
          ]
        }
      ]
    },
    {
      "place_id": "b1000000-0000-4000-8000-000000000002",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_tempat": "Braga Heritage Walk",
      "alamat_lengkap": "Jl. Braga, Kec. Sumur Bandung",
      "latitude": -6.917464,
      "longitude": 107.60981,
      "rating_rata_rata": 4.6,
      "jumlah_review": 2890,
      "jam_buka": "00:00",
      "jam_tutup": "24:00",
      "daftar_foto_url": [
        "/media/braga-1.jpg"
      ],
      "kategori_wisata": "budaya",
      "estimasi_durasi_kunjungan": 75,
      "harga_tiket_masuk": 0,
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "fasilitas": [
        {
          "fasilitas_id": "fa1000000-0000-4000-8000-000000000003",
          "place_id": "b1000000-0000-4000-8000-000000000002",
          "jenis": "RESTORAN_KULINER",
          "is_gratis": false,
          "fasilitas_tersedia": [
            "Kafe",
            "Restoran sunda",
            "Food court"
          ]
        }
      ]
    },
    {
      "place_id": "b1000000-0000-4000-8000-000000000003",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_tempat": "Saung Angklung Udjo",
      "alamat_lengkap": "Jl. Padasuka No.118, Cibeunying Kidul",
      "latitude": -6.89753,
      "longitude": 107.63551,
      "rating_rata_rata": 4.8,
      "jumlah_review": 4100,
      "jam_buka": "09:00",
      "jam_tutup": "17:00",
      "daftar_foto_url": [
        "/media/saung-angklung-1.jpg"
      ],
      "kategori_wisata": "budaya",
      "estimasi_durasi_kunjungan": 120,
      "harga_tiket_masuk": 85000,
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "fasilitas": [
        {
          "fasilitas_id": "fa1000000-0000-4000-8000-000000000004",
          "place_id": "b1000000-0000-4000-8000-000000000003",
          "jenis": "TOILET_UMUM",
          "is_gratis": true,
          "fasilitas_tersedia": [
            "Toilet",
            "Mushola",
            "Area tunggu"
          ]
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 3,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter limit atau wilayah tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter limit atau wilayah tidak valid."   },   "request_id": "req_demo_0001" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0002" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0003" }` |

### GET /destinations/{id}

Menampilkan detail destinasi, lokasi, foto, fasilitas, dan informasi tiket. Data ini dipakai oleh panel peta dan halaman detail.

- Peran: **Publik**
- Sukses: **200** Detail destinasi berhasil diambil.
- Kebutuhan: KF-06, KF-07

**Contoh respons positif**

```json
{
  "data": {
    "place_id": "b1000000-0000-4000-8000-000000000001",
    "wilayah_id": "a1000000-0000-4000-8000-000000000001",
    "nama_tempat": "Gedung Sate",
    "alamat_lengkap": "Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan",
    "latitude": -6.902484,
    "longitude": 107.618765,
    "rating_rata_rata": 4.7,
    "jumlah_review": 3210,
    "jam_buka": "08:00",
    "jam_tutup": "16:00",
    "daftar_foto_url": [
      "/media/gedung-sate-1.jpg",
      "/media/gedung-sate-2.jpg"
    ],
    "kategori_wisata": "sejarah",
    "estimasi_durasi_kunjungan": 90,
    "harga_tiket_masuk": 5000,
    "wilayah": {
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_wilayah": "Kota Bandung",
      "provinsi": "Jawa Barat"
    },
    "fasilitas": [
      {
        "fasilitas_id": "fa1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000001",
        "jenis": "ATM",
        "is_gratis": true,
        "fasilitas_tersedia": [
          "ATM BCA",
          "ATM Mandiri",
          "Area parkir"
        ]
      },
      {
        "fasilitas_id": "fa1000000-0000-4000-8000-000000000002",
        "place_id": "b1000000-0000-4000-8000-000000000001",
        "jenis": "TOILET_UMUM",
        "is_gratis": true,
        "fasilitas_tersedia": [
          "Toilet pria",
          "Toilet wanita",
          "Mushola"
        ]
      }
    ]
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/destinations/{id}' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/destinations/{id}' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 404 | `NOT_FOUND` | Destinasi tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Destinasi tidak ditemukan."   },   "request_id": "req_demo_0002" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0003" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0004" }` |

### GET /destinations/{id}/reviews

Menampilkan ulasan yang sudah dipublikasikan untuk satu destinasi. Ulasan yang menunggu moderasi tidak ditampilkan pada endpoint publik.

- Peran: **Publik**
- Sukses: **200** Daftar ulasan berhasil diambil.
- Kebutuhan: KF-06

**Contoh respons positif**

```json
{
  "data": [
    {
      "ulasan_id": "a4000000-0000-4000-8000-000000000001",
      "place_id": "b1000000-0000-4000-8000-000000000001",
      "nama_penulis": "Rina Kartika",
      "skor_rating": 5,
      "isi_komentar": "Bangunan ikonik dengan taman yang tertata. Tur museum informatif dan petugas ramah.",
      "waktu_ulasan": "2026-10-28 10:15:00",
      "status_publikasi": true
    },
    {
      "ulasan_id": "a4000000-0000-4000-8000-000000000002",
      "place_id": "b1000000-0000-4000-8000-000000000001",
      "nama_penulis": "Dimas Prakoso",
      "skor_rating": 4,
      "isi_komentar": "Antrean tiket cukup panjang saat akhir pekan. Datang pagi agar lebih nyaman.",
      "waktu_ulasan": "2026-10-26 09:40:00",
      "status_publikasi": true
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/destinations/{id}/reviews' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/destinations/{id}/reviews' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 404 | `NOT_FOUND` | Destinasi tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Destinasi tidak ditemukan."   },   "request_id": "req_demo_0002" }` |
| 409 | `CONFLICT` | Anda sudah mengirimkan ulasan untuk destinasi ini pada periode kunjungan yang sama. | `{   "error": {     "code": "CONFLICT",     "message": "Anda sudah mengirimkan ulasan untuk destinasi ini pada periode kunjungan yang sama."   },   "request_id": "req_demo_0003" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0004" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0005" }` |

### POST /destinations/{id}/reviews

Menambahkan ulasan untuk destinasi. Ulasan baru masuk ke antrean moderasi sehingga status_publikasi bernilai false sampai disetujui admin.

- Peran: **Wisatawan**
- Sukses: **201** Ulasan berhasil dikirim dan menunggu moderasi.
- Kebutuhan: KF-06

**Contoh respons positif**

```json
{
  "data": {
    "ulasan_id": "a4000000-0000-4000-8000-000000000099",
    "place_id": "b1000000-0000-4000-8000-000000000001",
    "nama_penulis": "Alfian Hanif",
    "skor_rating": 5,
    "isi_komentar": "Bangunan ikonik dengan taman yang tertata. Tur museum informatif dan petugas ramah.",
    "waktu_ulasan": "2026-10-30 15:55:00",
    "status_publikasi": false
  },
  "message": "Ulasan berhasil dikirim dan menunggu moderasi."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/destinations/{id}/reviews' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/destinations/{id}/reviews' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Hanya wisatawan yang dapat menulis ulasan. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Hanya wisatawan yang dapat menulis ulasan."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Destinasi tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Destinasi tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `REVIEW_ALREADY_EXISTS` | Anda sudah menulis ulasan untuk destinasi ini. | `{   "error": {     "code": "REVIEW_ALREADY_EXISTS",     "message": "Anda sudah menulis ulasan untuk destinasi ini."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Ulasan belum lengkap atau rating di luar rentang 1 sampai 5. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Ulasan belum lengkap atau rating di luar rentang 1 sampai 5.",     "details": [       {         "field": "skor_rating",         "message": "Rating harus antara 1 sampai 5."       },       {         "field": "isi_komentar",         "message": "Ulasan minimal 10 karakter."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak ulasan dalam waktu singkat. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak ulasan dalam waktu singkat."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |

## Wilayah dan Konteks

### GET /regions

Menampilkan wilayah yang tersedia beserta status cakupan. Dapat difilter berdasarkan provinsi dan status aktif.

- Peran: **Publik**
- Sukses: **200** Daftar wilayah berhasil diambil.
- Kebutuhan: KF-06, KF-07

**Contoh respons positif**

```json
{
  "data": [
    {
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_wilayah": "Kota Bandung",
      "provinsi": "Jawa Barat",
      "boundary_coordinates": [
        [
          106.947,
          -6.984
        ],
        [
          107.089,
          -6.984
        ],
        [
          107.089,
          -6.822
        ],
        [
          106.947,
          -6.822
        ]
      ],
      "status_cakupan_aktif": true,
      "jumlah_destinasi": 9
    },
    {
      "wilayah_id": "a1000000-0000-4000-8000-000000000002",
      "nama_wilayah": "Kabupaten Bandung Barat",
      "provinsi": "Jawa Barat",
      "boundary_coordinates": [
        [
          107.241,
          -7.047
        ],
        [
          107.515,
          -7.047
        ],
        [
          107.515,
          -6.731
        ],
        [
          107.241,
          -6.731
        ]
      ],
      "status_cakupan_aktif": true,
      "jumlah_destinasi": 2
    },
    {
      "wilayah_id": "a1000000-0000-4000-8000-000000000003",
      "nama_wilayah": "Kota Cimahi",
      "provinsi": "Jawa Barat",
      "boundary_coordinates": [
        [
          107.497,
          -6.941
        ],
        [
          107.594,
          -6.941
        ],
        [
          107.594,
          -6.833
        ],
        [
          107.497,
          -6.833
        ]
      ],
      "status_cakupan_aktif": true,
      "jumlah_destinasi": 0
    },
    {
      "wilayah_id": "a1000000-0000-4000-8000-000000000004",
      "nama_wilayah": "Kabupaten Bandung",
      "provinsi": "Jawa Barat",
      "boundary_coordinates": [
        [
          107.402,
          -7.286
        ],
        [
          107.768,
          -7.286
        ],
        [
          107.768,
          -6.874
        ],
        [
          107.402,
          -6.874
        ]
      ],
      "status_cakupan_aktif": false,
      "jumlah_destinasi": 1
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 4,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Filter wilayah tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Filter wilayah tidak valid."   },   "request_id": "req_demo_0001" }` |
| 409 | `CONFLICT` | Kode wilayah atau nama wilayah sudah terdaftar dalam sistem. | `{   "error": {     "code": "CONFLICT",     "message": "Kode wilayah atau nama wilayah sudah terdaftar dalam sistem."   },   "request_id": "req_demo_0002" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0003" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0004" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi."   },   "request_id": "req_demo_0005" }` |

### GET /regions/{id}

Menampilkan satu wilayah beserta batas geografis dan jumlah destinasi.

- Peran: **Publik**
- Sukses: **200** Detail wilayah berhasil diambil.
- Kebutuhan: KF-07

**Contoh respons positif**

```json
{
  "data": {
    "wilayah_id": "a1000000-0000-4000-8000-000000000001",
    "nama_wilayah": "Kota Bandung",
    "provinsi": "Jawa Barat",
    "boundary_coordinates": [
      [
        106.947,
        -6.984
      ],
      [
        107.089,
        -6.984
      ],
      [
        107.089,
        -6.822
      ],
      [
        106.947,
        -6.822
      ]
    ],
    "status_cakupan_aktif": true,
    "jumlah_destinasi": 9
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/regions/{id}' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/regions/{id}' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 404 | `NOT_FOUND` | Wilayah tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Wilayah tidak ditemukan."   },   "request_id": "req_demo_0002" }` |
| 409 | `CONFLICT` | Kode wilayah atau nama wilayah sudah terdaftar dalam sistem. | `{   "error": {     "code": "CONFLICT",     "message": "Kode wilayah atau nama wilayah sudah terdaftar dalam sistem."   },   "request_id": "req_demo_0003" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0004" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0005" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi."   },   "request_id": "req_demo_0006" }` |

### GET /context/weather

Menampilkan cuaca terkini dan waktu pembaruan untuk satu wilayah. Bila layanan cuaca sedang bermasalah, kontrak menetapkan respons 503 agar aplikasi dapat menampilkan data terakhir yang tersimpan.

- Peran: **Publik**
- Sukses: **200** Konteks cuaca berhasil diambil.
- Kebutuhan: KF-30, KNF-06

**Contoh respons positif**

```json
{
  "data": {
    "context_id": "a2000000-0000-4000-8000-000000000001",
    "wilayah_id": "a1000000-0000-4000-8000-000000000001",
    "nama_wilayah": "Kota Bandung",
    "kondisi_cuaca": "Hujan Ringan",
    "suhu_celsius": 24.5,
    "tingkat_curah_hujan": 8.4,
    "terakhir_diperbarui": "2026-10-30 14:10:00",
    "status_data": "segar"
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Format parameter pada permintaan konteks cuaca wilayah tidak valid atau nilai query di luar batas yang diizinkan. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Format parameter pada permintaan konteks cuaca wilayah tidak valid atau nilai query di luar batas yang diizinkan."   },   "request_id": "req_demo_0001" }` |
| 404 | `NOT_FOUND` | Wilayah tidak ditemukan atau belum memiliki data cuaca. | `{   "error": {     "code": "NOT_FOUND",     "message": "Wilayah tidak ditemukan atau belum memiliki data cuaca."   },   "request_id": "req_demo_0002" }` |
| 422 | `VALIDATION_ERROR` | wilayah_id wajib diisi dengan format UUID yang benar. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "wilayah_id wajib diisi dengan format UUID yang benar.",     "details": [       {         "field": "wilayah_id",         "message": "Wilayah wajib dipilih."       }     ]   },   "request_id": "req_demo_0003" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0004" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0005" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan cuaca pihak ketiga sedang tidak tersedia. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan cuaca pihak ketiga sedang tidak tersedia."   },   "request_id": "req_demo_0006" }` |

### GET /context/environment

Menampilkan gabungan kondisi cuaca, kepadatan jalan, dan insiden kecelakaan untuk satu wilayah. Data ini menjadi masukan mesin rekomendasi.

- Peran: **Publik**
- Sukses: **200** Konteks lingkungan berhasil diambil.
- Kebutuhan: KF-26, KF-30

**Contoh respons positif**

```json
{
  "data": {
    "context_id": "a2000000-0000-4000-8000-000000000001",
    "wilayah_id": "a1000000-0000-4000-8000-000000000001",
    "nama_wilayah": "Kota Bandung",
    "kondisi_cuaca": "Hujan Ringan",
    "suhu_celsius": 24.5,
    "tingkat_curah_hujan": 8.4,
    "kondisi_lalu_lintas": "Padat",
    "ada_insiden_kecelakaan": false,
    "rata_rata_kepadatan_jalan": 0.72,
    "terakhir_diperbarui": "2026-10-30 14:10:00"
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Format parameter pada permintaan konteks cuaca dan lalu lintas tidak valid atau nilai query di luar batas yang diizinkan. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Format parameter pada permintaan konteks cuaca dan lalu lintas tidak valid atau nilai query di luar batas yang diizinkan."   },   "request_id": "req_demo_0001" }` |
| 404 | `NOT_FOUND` | Wilayah tidak ditemukan atau belum memiliki data konteks. | `{   "error": {     "code": "NOT_FOUND",     "message": "Wilayah tidak ditemukan atau belum memiliki data konteks."   },   "request_id": "req_demo_0002" }` |
| 422 | `VALIDATION_ERROR` | wilayah_id wajib diisi dengan format UUID yang benar. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "wilayah_id wajib diisi dengan format UUID yang benar.",     "details": [       {         "field": "wilayah_id",         "message": "Wilayah wajib dipilih."       }     ]   },   "request_id": "req_demo_0003" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0004" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0005" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan penyedia data cuaca (BMKG / Weather Service) sedang mengalami gangguan atau batas kuota habis. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan penyedia data cuaca (BMKG / Weather Service) sedang mengalami gangguan atau batas kuota habis."   },   "request_id": "req_demo_0006" }` |

## Transportasi

### GET /transport-modes

Menampilkan seluruh moda transportasi beserta tarif, kapasitas, dan wilayah layanan. Filter jenis dan status membantu wisatawan mengenal pilihan yang tersedia.

- Peran: **Publik**
- Sukses: **200** Katalog moda transportasi berhasil diambil.
- Kebutuhan: KF-20, KF-21

**Contoh respons positif**

```json
{
  "data": [
    {
      "transportasi_id": "f1000000-0000-4000-8000-000000000001",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f12",
      "nama_moda": "Trans Metro Bandung Koridor 3",
      "jenis_transportasi": "BUS",
      "kapasitas_penumpang": 60,
      "status_aktif": true,
      "sumber_data": "GTFS Feed",
      "terakhir_diperbarui": "2026-10-30 06:00:00",
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "mitra": {
        "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f12",
        "nama_perusahaan": "CV Cimahi Trans"
      },
      "detail": {
        "nomor_trayek": "Koridor 3",
        "rute_halte": [
          "Halte Gasibu",
          "Halte Alun-Alun",
          "Halte Cicaheum",
          "Halte Riung Bandung"
        ],
        "tarif_tetap": 4900,
        "interval_menit": 15
      }
    },
    {
      "transportasi_id": "f1000000-0000-4000-8000-000000000002",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "mitra_id": null,
      "nama_moda": "Angkot Kalapa Dago 02",
      "jenis_transportasi": "ANGKOT",
      "kapasitas_penumpang": 14,
      "status_aktif": true,
      "sumber_data": "Dishub Bandung",
      "terakhir_diperbarui": "2026-10-29 18:20:00",
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "mitra": null,
      "detail": {
        "nomor_trayek": "02",
        "rute_halte": [
          "Halte Savoy Homann",
          "Halte Braga",
          "Halte Dago",
          "Halte Kalapa"
        ],
        "tarif_tetap": 8000,
        "interval_menit": 10
      }
    },
    {
      "transportasi_id": "f1000000-0000-4000-8000-000000000003",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
      "nama_moda": "GoCar Bandung",
      "jenis_transportasi": "ONLINE_TAXI",
      "kapasitas_penumpang": 4,
      "status_aktif": true,
      "sumber_data": "Mitra Portal",
      "terakhir_diperbarui": "2026-10-30 14:05:00",
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "mitra": {
        "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
        "nama_perusahaan": "PT Bandung Jaya Tour"
      },
      "detail": {
        "tarif_dasar": 10000,
        "tarif_per_km": 4500,
        "surge_multiplier": 1.2
      }
    },
    {
      "transportasi_id": "f1000000-0000-4000-8000-000000000004",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f12",
      "nama_moda": "GrabBike Bandung",
      "jenis_transportasi": "ONLINE_MOTOR",
      "kapasitas_penumpang": 1,
      "status_aktif": true,
      "sumber_data": "Mitra Portal",
      "terakhir_diperbarui": "2026-10-30 13:50:00",
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "mitra": {
        "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f12",
        "nama_perusahaan": "CV Cimahi Trans"
      },
      "detail": {
        "tarif_dasar": 8000,
        "tarif_per_km": 2500,
        "surge_multiplier": 1
      }
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 4,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Filter moda transportasi tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Filter moda transportasi tidak valid."   },   "request_id": "req_demo_0001" }` |
| 409 | `CONFLICT` | Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas). | `{   "error": {     "code": "CONFLICT",     "message": "Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas)."   },   "request_id": "req_demo_0002" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0003" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0004" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi."   },   "request_id": "req_demo_0005" }` |

### GET /transport-modes/{id}

Menampilkan detail satu moda, termasuk rincian tarif dan rute halte bila tersedia.

- Peran: **Publik**
- Sukses: **200** Detail moda transportasi berhasil diambil.
- Kebutuhan: KF-20, KF-21

**Contoh respons positif**

```json
{
  "data": {
    "transportasi_id": "f1000000-0000-4000-8000-000000000003",
    "wilayah_id": "a1000000-0000-4000-8000-000000000001",
    "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
    "nama_moda": "GoCar Bandung",
    "jenis_transportasi": "ONLINE_TAXI",
    "kapasitas_penumpang": 4,
    "status_aktif": true,
    "sumber_data": "Mitra Portal",
    "terakhir_diperbarui": "2026-10-30 14:05:00",
    "wilayah": {
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_wilayah": "Kota Bandung",
      "provinsi": "Jawa Barat"
    },
    "mitra": {
      "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
      "nama_perusahaan": "PT Bandung Jaya Tour"
    },
    "detail": {
      "tarif_dasar": 10000,
      "tarif_per_km": 4500,
      "surge_multiplier": 1.2
    }
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/transport-modes/{id}' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/transport-modes/{id}' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 404 | `NOT_FOUND` | Moda transportasi tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Moda transportasi tidak ditemukan."   },   "request_id": "req_demo_0002" }` |
| 409 | `CONFLICT` | Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas). | `{   "error": {     "code": "CONFLICT",     "message": "Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas)."   },   "request_id": "req_demo_0003" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0004" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0005" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi."   },   "request_id": "req_demo_0006" }` |

### GET /itineraries/{id}/available-modes

Menampilkan moda transportasi yang sesuai dengan preferensi itinerary, lengkap dengan alasan filter dan rincian tarif.

- Peran: **Wisatawan**
- Sukses: **200** Moda transportasi yang tersedia berhasil diambil.
- Kebutuhan: KF-20, KF-21

**Contoh respons positif**

```json
{
  "data": {
    "itinerary_id": "c1000000-0000-4000-8000-000000000001",
    "preferensi": {
      "preferensi_id": 1,
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "prioritas_utama": "kenyamanan",
      "hindari_jalan_kaki_jauh": true,
      "maksimal_transit": 2,
      "preferensi_biaya": "standar"
    },
    "moda": [
      {
        "transportasi_id": "f1000000-0000-4000-8000-000000000001",
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f12",
        "nama_moda": "Trans Metro Bandung Koridor 3",
        "jenis_transportasi": "BUS",
        "kapasitas_penumpang": 60,
        "status_aktif": true,
        "sumber_data": "GTFS Feed",
        "terakhir_diperbarui": "2026-10-30 06:00:00",
        "wilayah": {
          "wilayah_id": "a1000000-0000-4000-8000-000000000001",
          "nama_wilayah": "Kota Bandung",
          "provinsi": "Jawa Barat"
        },
        "mitra": {
          "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f12",
          "nama_perusahaan": "CV Cimahi Trans"
        },
        "detail": {
          "nomor_trayek": "Koridor 3",
          "rute_halte": [
            "Halte Gasibu",
            "Halte Alun-Alun",
            "Halte Cicaheum",
            "Halte Riung Bandung"
          ],
          "tarif_tetap": 4900,
          "interval_menit": 15
        },
        "cocok_dengan_preferensi": true,
        "alasan": "Tarif tetap dan kapasitas cukup untuk 2 wisatawan."
      },
      {
        "transportasi_id": "f1000000-0000-4000-8000-000000000003",
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
        "nama_moda": "GoCar Bandung",
        "jenis_transportasi": "ONLINE_TAXI",
        "kapasitas_penumpang": 4,
        "status_aktif": true,
        "sumber_data": "Mitra Portal",
        "terakhir_diperbarui": "2026-10-30 14:05:00",
        "wilayah": {
          "wilayah_id": "a1000000-0000-4000-8000-000000000001",
          "nama_wilayah": "Kota Bandung",
          "provinsi": "Jawa Barat"
        },
        "mitra": {
          "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
          "nama_perusahaan": "PT Bandung Jaya Tour"
        },
        "detail": {
          "tarif_dasar": 10000,
          "tarif_per_km": 4500,
          "surge_multiplier": 1.2
        },
        "cocok_dengan_preferensi": true,
        "alasan": "Waktu tempuh singkat dan terlindung dari hujan."
      },
      {
        "transportasi_id": "f1000000-0000-4000-8000-000000000002",
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "mitra_id": null,
        "nama_moda": "Angkot Kalapa Dago 02",
        "jenis_transportasi": "ANGKOT",
        "kapasitas_penumpang": 14,
        "status_aktif": true,
        "sumber_data": "Dishub Bandung",
        "terakhir_diperbarui": "2026-10-29 18:20:00",
        "wilayah": {
          "wilayah_id": "a1000000-0000-4000-8000-000000000001",
          "nama_wilayah": "Kota Bandung",
          "provinsi": "Jawa Barat"
        },
        "mitra": null,
        "detail": {
          "nomor_trayek": "02",
          "rute_halte": [
            "Halte Savoy Homann",
            "Halte Braga",
            "Halte Dago",
            "Halte Kalapa"
          ],
          "tarif_tetap": 8000,
          "interval_menit": 10
        },
        "cocok_dengan_preferensi": false,
        "alasan": "Paparan luar ruang lebih tinggi dari batas kenyamanan."
      }
    ],
    "catatan": "Satu moda disembunyikan karena tidak aktif. Dua moda disarankan sesuai preferensi kenyamanan."
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/itineraries/{id}/available-modes' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/itineraries/{id}/available-modes' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Itinerary ini bukan milik akun yang sedang masuk. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Itinerary ini bukan milik akun yang sedang masuk."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Itinerary tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Itinerary tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `NO_AVAILABLE_MODES` | Tidak ada moda transportasi yang sesuai dengan preferensi saat ini. | `{   "error": {     "code": "NO_AVAILABLE_MODES",     "message": "Tidak ada moda transportasi yang sesuai dengan preferensi saat ini."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi."   },   "request_id": "req_demo_0008" }` |

## Itinerary

### GET /itineraries

Menampilkan itinerary milik wisatawan yang sedang masuk. Admin memakai endpoint /admin/itineraries untuk melihat seluruh itinerary.

- Peran: **Wisatawan**
- Sukses: **200** Daftar itinerary berhasil diambil.
- Kebutuhan: KF-10

**Contoh respons positif**

```json
{
  "data": [
    {
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "wisatawan_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01",
      "start_place_id": "b1000000-0000-4000-8000-000000000011",
      "judul_perjalanan": "Bandung Heritage & Kuliner Weekend",
      "tanggal_mulai": "2026-11-14",
      "tanggal_selesai": "2026-11-15",
      "jumlah_wisatawan": 2,
      "total_anggaran": 1500000,
      "status_rencana": "aktif",
      "jumlah_destinasi": 3,
      "total_estimasi_biaya": 28000,
      "preferensi": {
        "preferensi_id": 1,
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "prioritas_utama": "kenyamanan",
        "hindari_jalan_kaki_jauh": true,
        "maksimal_transit": 2,
        "preferensi_biaya": "standar"
      }
    },
    {
      "itinerary_id": "c1000000-0000-4000-8000-000000000002",
      "wisatawan_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01",
      "start_place_id": "b1000000-0000-4000-8000-000000000011",
      "judul_perjalanan": "Lembang Highland Escape",
      "tanggal_mulai": "2026-11-22",
      "tanggal_selesai": "2026-11-23",
      "jumlah_wisatawan": 4,
      "total_anggaran": 2000000,
      "status_rencana": "draft",
      "jumlah_destinasi": 3,
      "total_estimasi_biaya": 95000,
      "preferensi": {
        "preferensi_id": 2,
        "itinerary_id": "c1000000-0000-4000-8000-000000000002",
        "prioritas_utama": "kecepatan",
        "hindari_jalan_kaki_jauh": false,
        "maksimal_transit": 1,
        "preferensi_biaya": "premium"
      }
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Filter status itinerary tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Filter status itinerary tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Hanya wisatawan yang memiliki daftar itinerary pribadi. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Hanya wisatawan yang memiliki daftar itinerary pribadi."   },   "request_id": "req_demo_0003" }` |
| 409 | `CONFLICT` | Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama. | `{   "error": {     "code": "CONFLICT",     "message": "Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama."   },   "request_id": "req_demo_0004" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0005" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0006" }` |

### POST /itineraries

Membuat itinerary, preferensi perjalanan, dan daftar perhentian dalam satu transaksi. Setelah data tersimpan, sistem menjalankan perhitungan rekomendasi awal.

- Peran: **Wisatawan**
- Sukses: **201** Itinerary berhasil dibuat.
- Kebutuhan: KF-08, KF-28

**Contoh respons positif**

```json
{
  "data": {
    "itinerary_id": "c1000000-0000-4000-8000-000000000099",
    "wisatawan_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01",
    "start_place_id": "b1000000-0000-4000-8000-000000000011",
    "judul_perjalanan": "Bandung Heritage & Kuliner Weekend",
    "tanggal_mulai": "2026-11-14",
    "tanggal_selesai": "2026-11-15",
    "jumlah_wisatawan": 2,
    "total_anggaran": 1500000,
    "status_rencana": "aktif",
    "jumlah_destinasi": 3,
    "total_estimasi_biaya": 28000,
    "preferensi": {
      "preferensi_id": 1,
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "prioritas_utama": "kenyamanan",
      "hindari_jalan_kaki_jauh": true,
      "maksimal_transit": 2,
      "preferensi_biaya": "standar"
    },
    "destinasi": [
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000001",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000001",
        "urutan": 1,
        "waktu_mulai_rencana": "2026-11-14 09:00:00",
        "waktu_selesai_rencana": "2026-11-14 11:00:00",
        "total_jarak_segment_km": 2.4,
        "total_durasi_segment_menit": 15,
        "total_biaya_segment": 8000,
        "is_manual_selected": false,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000001",
          "nama_tempat": "Gedung Sate",
          "kategori_wisata": "sejarah",
          "latitude": -6.902484,
          "longitude": 107.618765,
          "alamat_lengkap": "Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000001",
            "plan_item_id": "d1000000-0000-4000-8000-000000000001",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 600 m dari Hotel Savoy Homann ke Halte Savoy.",
            "jarak_leg_km": 0.6,
            "estimasi_durasi_menit": 7,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000002",
            "plan_item_id": "d1000000-0000-4000-8000-000000000001",
            "transportasi_id": "f1000000-0000-4000-8000-000000000002",
            "urutan_leg": 2,
            "instruksi_rute": "Naik Angkot 02 dan turun di depan Gedung Sate.",
            "jarak_leg_km": 1.8,
            "estimasi_durasi_menit": 8,
            "biaya_leg": 8000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000002",
              "nama_moda": "Angkot Kalapa Dago 02",
              "jenis_transportasi": "ANGKOT"
            }
          }
        ]
      },
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000002",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000002",
        "urutan": 2,
        "waktu_mulai_rencana": "2026-11-14 12:30:00",
        "waktu_selesai_rencana": "2026-11-14 14:00:00",
        "total_jarak_segment_km": 3.1,
        "total_durasi_segment_menit": 18,
        "total_biaya_segment": 12000,
        "is_manual_selected": false,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000002",
          "nama_tempat": "Braga Heritage Walk",
          "kategori_wisata": "budaya",
          "latitude": -6.917464,
          "longitude": 107.60981,
          "alamat_lengkap": "Jl. Braga, Kec. Sumur Bandung"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000003",
            "plan_item_id": "d1000000-0000-4000-8000-000000000002",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 400 m menyusuri Jl. Diponegoro ke titik jemput.",
            "jarak_leg_km": 0.4,
            "estimasi_durasi_menit": 6,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000004",
            "plan_item_id": "d1000000-0000-4000-8000-000000000002",
            "transportasi_id": "f1000000-0000-4000-8000-000000000003",
            "urutan_leg": 2,
            "instruksi_rute": "GoCar dari Gedung Sate ke Braga Heritage Walk.",
            "jarak_leg_km": 2.7,
            "estimasi_durasi_menit": 12,
            "biaya_leg": 12000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000003",
              "nama_moda": "GoCar Bandung",
              "jenis_transportasi": "ONLINE_TAXI"
            }
          }
        ]
      },
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000003",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000003",
        "urutan": 3,
        "waktu_mulai_rencana": "2026-11-14 15:30:00",
        "waktu_selesai_rencana": "2026-11-14 17:00:00",
        "total_jarak_segment_km": 4.2,
        "total_durasi_segment_menit": 22,
        "total_biaya_segment": 8000,
        "is_manual_selected": true,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000003",
          "nama_tempat": "Saung Angklung Udjo",
          "kategori_wisata": "budaya",
          "latitude": -6.89753,
          "longitude": 107.63551,
          "alamat_lengkap": "Jl. Padasukah No.118, Cibeunying Kidul"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000005",
            "plan_item_id": "d1000000-0000-4000-8000-000000000003",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 500 m ke Halte Alun-Alun.",
            "jarak_leg_km": 0.5,
            "estimasi_durasi_menit": 6,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000006",
            "plan_item_id": "d1000000-0000-4000-8000-000000000003",
            "transportasi_id": "f1000000-0000-4000-8000-000000000007",
            "urutan_leg": 2,
            "instruksi_rute": "Tourist Shuttle 04 dari Halte Alun-Alun ke gerbang Saung Angklung Udjo.",
            "jarak_leg_km": 3.7,
            "estimasi_durasi_menit": 16,
            "biaya_leg": 8000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000007",
              "nama_moda": "Tourist Shuttle Bandung",
              "jenis_transportasi": "SHUTTLE"
            }
          }
        ]
      }
    ],
    "rekomendasi_teratas": {
      "recommendation_id": "91000000-0000-4000-8000-000000000001",
      "ranking": 1,
      "total_estimated_cost": 28000,
      "total_estimated_duration": 55,
      "suitability_score": 0.94
    }
  },
  "message": "Itinerary berhasil dibuat dan rekomendasi mulai dihitung."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Struktur tubuh permintaan (request body) tidak dapat diproses atau format JSON rusak. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Struktur tubuh permintaan (request body) tidak dapat diproses atau format JSON rusak."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Hanya wisatawan yang dapat membuat itinerary. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Hanya wisatawan yang dapat membuat itinerary."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Tempat awal atau destinasi yang dipilih tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Tempat awal atau destinasi yang dipilih tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama. | `{   "error": {     "code": "CONFLICT",     "message": "Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Data itinerary belum lengkap atau formatnya belum benar. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data itinerary belum lengkap atau formatnya belum benar.",     "details": [       {         "field": "tanggal_selesai",         "message": "Tanggal selesai tidak boleh sebelum tanggal mulai."       },       {         "field": "destinasi",         "message": "Minimal satu destinasi harus dipilih."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan pembuatan itinerary. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan pembuatan itinerary."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |

### GET /itineraries/{id}

Menampilkan itinerary beserta preferensi, perhentian berurutan, segmen perjalanan, dan rekomendasi teratas.

- Peran: **Wisatawan**
- Sukses: **200** Detail itinerary berhasil diambil.
- Kebutuhan: KF-10

**Contoh respons positif**

```json
{
  "data": {
    "itinerary_id": "c1000000-0000-4000-8000-000000000001",
    "wisatawan_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01",
    "start_place_id": "b1000000-0000-4000-8000-000000000011",
    "judul_perjalanan": "Bandung Heritage & Kuliner Weekend",
    "tanggal_mulai": "2026-11-14",
    "tanggal_selesai": "2026-11-15",
    "jumlah_wisatawan": 2,
    "total_anggaran": 1500000,
    "status_rencana": "aktif",
    "jumlah_destinasi": 3,
    "total_estimasi_biaya": 28000,
    "preferensi": {
      "preferensi_id": 1,
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "prioritas_utama": "kenyamanan",
      "hindari_jalan_kaki_jauh": true,
      "maksimal_transit": 2,
      "preferensi_biaya": "standar"
    },
    "destinasi": [
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000001",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000001",
        "urutan": 1,
        "waktu_mulai_rencana": "2026-11-14 09:00:00",
        "waktu_selesai_rencana": "2026-11-14 11:00:00",
        "total_jarak_segment_km": 2.4,
        "total_durasi_segment_menit": 15,
        "total_biaya_segment": 8000,
        "is_manual_selected": false,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000001",
          "nama_tempat": "Gedung Sate",
          "kategori_wisata": "sejarah",
          "latitude": -6.902484,
          "longitude": 107.618765,
          "alamat_lengkap": "Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000001",
            "plan_item_id": "d1000000-0000-4000-8000-000000000001",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 600 m dari Hotel Savoy Homann ke Halte Savoy.",
            "jarak_leg_km": 0.6,
            "estimasi_durasi_menit": 7,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000002",
            "plan_item_id": "d1000000-0000-4000-8000-000000000001",
            "transportasi_id": "f1000000-0000-4000-8000-000000000002",
            "urutan_leg": 2,
            "instruksi_rute": "Naik Angkot 02 dan turun di depan Gedung Sate.",
            "jarak_leg_km": 1.8,
            "estimasi_durasi_menit": 8,
            "biaya_leg": 8000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000002",
              "nama_moda": "Angkot Kalapa Dago 02",
              "jenis_transportasi": "ANGKOT"
            }
          }
        ]
      },
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000002",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000002",
        "urutan": 2,
        "waktu_mulai_rencana": "2026-11-14 12:30:00",
        "waktu_selesai_rencana": "2026-11-14 14:00:00",
        "total_jarak_segment_km": 3.1,
        "total_durasi_segment_menit": 18,
        "total_biaya_segment": 12000,
        "is_manual_selected": false,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000002",
          "nama_tempat": "Braga Heritage Walk",
          "kategori_wisata": "budaya",
          "latitude": -6.917464,
          "longitude": 107.60981,
          "alamat_lengkap": "Jl. Braga, Kec. Sumur Bandung"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000003",
            "plan_item_id": "d1000000-0000-4000-8000-000000000002",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 400 m menyusuri Jl. Diponegoro ke titik jemput.",
            "jarak_leg_km": 0.4,
            "estimasi_durasi_menit": 6,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000004",
            "plan_item_id": "d1000000-0000-4000-8000-000000000002",
            "transportasi_id": "f1000000-0000-4000-8000-000000000003",
            "urutan_leg": 2,
            "instruksi_rute": "GoCar dari Gedung Sate ke Braga Heritage Walk.",
            "jarak_leg_km": 2.7,
            "estimasi_durasi_menit": 12,
            "biaya_leg": 12000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000003",
              "nama_moda": "GoCar Bandung",
              "jenis_transportasi": "ONLINE_TAXI"
            }
          }
        ]
      },
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000003",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000003",
        "urutan": 3,
        "waktu_mulai_rencana": "2026-11-14 15:30:00",
        "waktu_selesai_rencana": "2026-11-14 17:00:00",
        "total_jarak_segment_km": 4.2,
        "total_durasi_segment_menit": 22,
        "total_biaya_segment": 8000,
        "is_manual_selected": true,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000003",
          "nama_tempat": "Saung Angklung Udjo",
          "kategori_wisata": "budaya",
          "latitude": -6.89753,
          "longitude": 107.63551,
          "alamat_lengkap": "Jl. Padasukah No.118, Cibeunying Kidul"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000005",
            "plan_item_id": "d1000000-0000-4000-8000-000000000003",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 500 m ke Halte Alun-Alun.",
            "jarak_leg_km": 0.5,
            "estimasi_durasi_menit": 6,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000006",
            "plan_item_id": "d1000000-0000-4000-8000-000000000003",
            "transportasi_id": "f1000000-0000-4000-8000-000000000007",
            "urutan_leg": 2,
            "instruksi_rute": "Tourist Shuttle 04 dari Halte Alun-Alun ke gerbang Saung Angklung Udjo.",
            "jarak_leg_km": 3.7,
            "estimasi_durasi_menit": 16,
            "biaya_leg": 8000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000007",
              "nama_moda": "Tourist Shuttle Bandung",
              "jenis_transportasi": "SHUTTLE"
            }
          }
        ]
      }
    ],
    "rekomendasi_teratas": {
      "recommendation_id": "91000000-0000-4000-8000-000000000001",
      "ranking": 1,
      "total_estimated_cost": 28000,
      "total_estimated_duration": 55,
      "suitability_score": 0.94
    }
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/itineraries/{id}' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/itineraries/{id}' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Itinerary ini bukan milik akun yang sedang masuk. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Itinerary ini bukan milik akun yang sedang masuk."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Itinerary tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Itinerary tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama. | `{   "error": {     "code": "CONFLICT",     "message": "Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### PUT /itineraries/{id}

Memperbarui data itinerary, preferensi, dan urutan destinasi. Perubahan memicu perhitungan ulang rekomendasi sesuai KF-28.

- Peran: **Wisatawan**
- Sukses: **200** Itinerary berhasil diperbarui.
- Kebutuhan: KF-09, KF-28

**Contoh respons positif**

```json
{
  "data": {
    "itinerary_id": "c1000000-0000-4000-8000-000000000001",
    "wisatawan_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01",
    "start_place_id": "b1000000-0000-4000-8000-000000000011",
    "judul_perjalanan": "Bandung Heritage & Kuliner Weekend",
    "tanggal_mulai": "2026-11-14",
    "tanggal_selesai": "2026-11-15",
    "jumlah_wisatawan": 2,
    "total_anggaran": 1750000,
    "status_rencana": "aktif",
    "jumlah_destinasi": 3,
    "total_estimasi_biaya": 28000,
    "preferensi": {
      "preferensi_id": 1,
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "prioritas_utama": "kecepatan",
      "hindari_jalan_kaki_jauh": true,
      "maksimal_transit": 2,
      "preferensi_biaya": "standar"
    },
    "destinasi": [
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000001",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000001",
        "urutan": 1,
        "waktu_mulai_rencana": "2026-11-14 09:00:00",
        "waktu_selesai_rencana": "2026-11-14 11:00:00",
        "total_jarak_segment_km": 2.4,
        "total_durasi_segment_menit": 15,
        "total_biaya_segment": 8000,
        "is_manual_selected": false,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000001",
          "nama_tempat": "Gedung Sate",
          "kategori_wisata": "sejarah",
          "latitude": -6.902484,
          "longitude": 107.618765,
          "alamat_lengkap": "Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000001",
            "plan_item_id": "d1000000-0000-4000-8000-000000000001",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 600 m dari Hotel Savoy Homann ke Halte Savoy.",
            "jarak_leg_km": 0.6,
            "estimasi_durasi_menit": 7,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000002",
            "plan_item_id": "d1000000-0000-4000-8000-000000000001",
            "transportasi_id": "f1000000-0000-4000-8000-000000000002",
            "urutan_leg": 2,
            "instruksi_rute": "Naik Angkot 02 dan turun di depan Gedung Sate.",
            "jarak_leg_km": 1.8,
            "estimasi_durasi_menit": 8,
            "biaya_leg": 8000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000002",
              "nama_moda": "Angkot Kalapa Dago 02",
              "jenis_transportasi": "ANGKOT"
            }
          }
        ]
      },
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000002",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000002",
        "urutan": 2,
        "waktu_mulai_rencana": "2026-11-14 12:30:00",
        "waktu_selesai_rencana": "2026-11-14 14:00:00",
        "total_jarak_segment_km": 3.1,
        "total_durasi_segment_menit": 18,
        "total_biaya_segment": 12000,
        "is_manual_selected": false,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000002",
          "nama_tempat": "Braga Heritage Walk",
          "kategori_wisata": "budaya",
          "latitude": -6.917464,
          "longitude": 107.60981,
          "alamat_lengkap": "Jl. Braga, Kec. Sumur Bandung"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000003",
            "plan_item_id": "d1000000-0000-4000-8000-000000000002",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 400 m menyusuri Jl. Diponegoro ke titik jemput.",
            "jarak_leg_km": 0.4,
            "estimasi_durasi_menit": 6,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000004",
            "plan_item_id": "d1000000-0000-4000-8000-000000000002",
            "transportasi_id": "f1000000-0000-4000-8000-000000000003",
            "urutan_leg": 2,
            "instruksi_rute": "GoCar dari Gedung Sate ke Braga Heritage Walk.",
            "jarak_leg_km": 2.7,
            "estimasi_durasi_menit": 12,
            "biaya_leg": 12000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000003",
              "nama_moda": "GoCar Bandung",
              "jenis_transportasi": "ONLINE_TAXI"
            }
          }
        ]
      },
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000003",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000003",
        "urutan": 3,
        "waktu_mulai_rencana": "2026-11-14 15:30:00",
        "waktu_selesai_rencana": "2026-11-14 17:00:00",
        "total_jarak_segment_km": 4.2,
        "total_durasi_segment_menit": 22,
        "total_biaya_segment": 8000,
        "is_manual_selected": true,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000003",
          "nama_tempat": "Saung Angklung Udjo",
          "kategori_wisata": "budaya",
          "latitude": -6.89753,
          "longitude": 107.63551,
          "alamat_lengkap": "Jl. Padasukah No.118, Cibeunying Kidul"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000005",
            "plan_item_id": "d1000000-0000-4000-8000-000000000003",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 500 m ke Halte Alun-Alun.",
            "jarak_leg_km": 0.5,
            "estimasi_durasi_menit": 6,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000006",
            "plan_item_id": "d1000000-0000-4000-8000-000000000003",
            "transportasi_id": "f1000000-0000-4000-8000-000000000007",
            "urutan_leg": 2,
            "instruksi_rute": "Tourist Shuttle 04 dari Halte Alun-Alun ke gerbang Saung Angklung Udjo.",
            "jarak_leg_km": 3.7,
            "estimasi_durasi_menit": 16,
            "biaya_leg": 8000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000007",
              "nama_moda": "Tourist Shuttle Bandung",
              "jenis_transportasi": "SHUTTLE"
            }
          }
        ]
      }
    ],
    "rekomendasi_teratas": {
      "recommendation_id": "91000000-0000-4000-8000-000000000001",
      "ranking": 1,
      "total_estimated_cost": 28000,
      "total_estimated_duration": 55,
      "suitability_score": 0.94
    }
  },
  "message": "Itinerary berhasil diperbarui dan rekomendasi dihitung ulang."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/itineraries/{id}' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/itineraries/{id}' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Itinerary ini bukan milik akun yang sedang masuk. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Itinerary ini bukan milik akun yang sedang masuk."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Itinerary atau destinasi yang dipilih tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Itinerary atau destinasi yang dipilih tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `ITINERARY_LOCKED` | Itinerary yang sudah selesai atau dibatalkan tidak dapat diubah. | `{   "error": {     "code": "ITINERARY_LOCKED",     "message": "Itinerary yang sudah selesai atau dibatalkan tidak dapat diubah."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Data perubahan itinerary belum lengkap atau tidak konsisten. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data perubahan itinerary belum lengkap atau tidak konsisten.",     "details": [       {         "field": "tanggal_selesai",         "message": "Tanggal selesai tidak boleh sebelum tanggal mulai."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |

### DELETE /itineraries/{id}

Menghapus itinerary beserta preferensi, perhentian, segmen perjalanan, rekomendasi, dan notifikasi terkait melalui aturan cascade.

- Peran: **Wisatawan**
- Sukses: **204** Itinerary berhasil dihapus. Tidak ada isi respons.
- Kebutuhan: KF-12

**Contoh respons positif**

Tidak ada isi respons. Server hanya mengembalikan kode 204.

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/itineraries/{id}' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/itineraries/{id}' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Itinerary ini bukan milik akun yang sedang masuk. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Itinerary ini bukan milik akun yang sedang masuk."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Itinerary tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Itinerary tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `ITINERARY_ACTIVE` | Itinerary yang sedang aktif harus diselesaikan atau dibatalkan sebelum dihapus. | `{   "error": {     "code": "ITINERARY_ACTIVE",     "message": "Itinerary yang sedang aktif harus diselesaikan atau dibatalkan sebelum dihapus."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### PUT /itineraries/{id}/stops

Mengubah urutan perhentian tanpa mengubah data itinerary lain. Setelah urutan tersimpan, rekomendasi dihitung ulang.

- Peran: **Wisatawan**
- Sukses: **200** Urutan perhentian berhasil diperbarui.
- Kebutuhan: KF-09, KF-28

**Contoh respons positif**

```json
{
  "data": {
    "itinerary_id": "c1000000-0000-4000-8000-000000000001",
    "wisatawan_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01",
    "start_place_id": "b1000000-0000-4000-8000-000000000011",
    "judul_perjalanan": "Bandung Heritage & Kuliner Weekend",
    "tanggal_mulai": "2026-11-14",
    "tanggal_selesai": "2026-11-15",
    "jumlah_wisatawan": 2,
    "total_anggaran": 1500000,
    "status_rencana": "aktif",
    "jumlah_destinasi": 3,
    "total_estimasi_biaya": 28000,
    "preferensi": {
      "preferensi_id": 1,
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "prioritas_utama": "kenyamanan",
      "hindari_jalan_kaki_jauh": true,
      "maksimal_transit": 2,
      "preferensi_biaya": "standar"
    },
    "destinasi": [
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000002",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000002",
        "urutan": 2,
        "waktu_mulai_rencana": "2026-11-14 12:30:00",
        "waktu_selesai_rencana": "2026-11-14 14:00:00",
        "total_jarak_segment_km": 3.1,
        "total_durasi_segment_menit": 18,
        "total_biaya_segment": 12000,
        "is_manual_selected": false,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000002",
          "nama_tempat": "Braga Heritage Walk",
          "kategori_wisata": "budaya",
          "latitude": -6.917464,
          "longitude": 107.60981,
          "alamat_lengkap": "Jl. Braga, Kec. Sumur Bandung"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000003",
            "plan_item_id": "d1000000-0000-4000-8000-000000000002",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 400 m menyusuri Jl. Diponegoro ke titik jemput.",
            "jarak_leg_km": 0.4,
            "estimasi_durasi_menit": 6,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000004",
            "plan_item_id": "d1000000-0000-4000-8000-000000000002",
            "transportasi_id": "f1000000-0000-4000-8000-000000000003",
            "urutan_leg": 2,
            "instruksi_rute": "GoCar dari Gedung Sate ke Braga Heritage Walk.",
            "jarak_leg_km": 2.7,
            "estimasi_durasi_menit": 12,
            "biaya_leg": 12000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000003",
              "nama_moda": "GoCar Bandung",
              "jenis_transportasi": "ONLINE_TAXI"
            }
          }
        ]
      },
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000001",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000001",
        "urutan": 1,
        "waktu_mulai_rencana": "2026-11-14 09:00:00",
        "waktu_selesai_rencana": "2026-11-14 11:00:00",
        "total_jarak_segment_km": 2.4,
        "total_durasi_segment_menit": 15,
        "total_biaya_segment": 8000,
        "is_manual_selected": false,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000001",
          "nama_tempat": "Gedung Sate",
          "kategori_wisata": "sejarah",
          "latitude": -6.902484,
          "longitude": 107.618765,
          "alamat_lengkap": "Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000001",
            "plan_item_id": "d1000000-0000-4000-8000-000000000001",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 600 m dari Hotel Savoy Homann ke Halte Savoy.",
            "jarak_leg_km": 0.6,
            "estimasi_durasi_menit": 7,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000002",
            "plan_item_id": "d1000000-0000-4000-8000-000000000001",
            "transportasi_id": "f1000000-0000-4000-8000-000000000002",
            "urutan_leg": 2,
            "instruksi_rute": "Naik Angkot 02 dan turun di depan Gedung Sate.",
            "jarak_leg_km": 1.8,
            "estimasi_durasi_menit": 8,
            "biaya_leg": 8000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000002",
              "nama_moda": "Angkot Kalapa Dago 02",
              "jenis_transportasi": "ANGKOT"
            }
          }
        ]
      },
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000003",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000003",
        "urutan": 3,
        "waktu_mulai_rencana": "2026-11-14 15:30:00",
        "waktu_selesai_rencana": "2026-11-14 17:00:00",
        "total_jarak_segment_km": 4.2,
        "total_durasi_segment_menit": 22,
        "total_biaya_segment": 8000,
        "is_manual_selected": true,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000003",
          "nama_tempat": "Saung Angklung Udjo",
          "kategori_wisata": "budaya",
          "latitude": -6.89753,
          "longitude": 107.63551,
          "alamat_lengkap": "Jl. Padasukah No.118, Cibeunying Kidul"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000005",
            "plan_item_id": "d1000000-0000-4000-8000-000000000003",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 500 m ke Halte Alun-Alun.",
            "jarak_leg_km": 0.5,
            "estimasi_durasi_menit": 6,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000006",
            "plan_item_id": "d1000000-0000-4000-8000-000000000003",
            "transportasi_id": "f1000000-0000-4000-8000-000000000007",
            "urutan_leg": 2,
            "instruksi_rute": "Tourist Shuttle 04 dari Halte Alun-Alun ke gerbang Saung Angklung Udjo.",
            "jarak_leg_km": 3.7,
            "estimasi_durasi_menit": 16,
            "biaya_leg": 8000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000007",
              "nama_moda": "Tourist Shuttle Bandung",
              "jenis_transportasi": "SHUTTLE"
            }
          }
        ]
      }
    ],
    "rekomendasi_teratas": {
      "recommendation_id": "91000000-0000-4000-8000-000000000001",
      "ranking": 1,
      "total_estimated_cost": 28000,
      "total_estimated_duration": 55,
      "suitability_score": 0.94
    }
  },
  "message": "Urutan perhentian berhasil diperbarui dan rekomendasi dihitung ulang."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/itineraries/{id}/stops' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/itineraries/{id}/stops' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Itinerary ini bukan milik akun yang sedang masuk. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Itinerary ini bukan milik akun yang sedang masuk."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Itinerary atau perhentian tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Itinerary atau perhentian tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `ITINERARY_LOCKED` | Urutan perhentian pada itinerary yang sudah selesai tidak dapat diubah. | `{   "error": {     "code": "ITINERARY_LOCKED",     "message": "Urutan perhentian pada itinerary yang sudah selesai tidak dapat diubah."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Daftar urutan perhentian tidak lengkap atau berisi duplikat. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Daftar urutan perhentian tidak lengkap atau berisi duplikat.",     "details": [       {         "field": "destinasi",         "message": "Setiap perhentian harus muncul tepat satu kali."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |

### GET /itineraries/{id}/route-geometry

Mengembalikan GeoJSON FeatureCollection berisi titik perhentian dan garis rute antar perhentian. Respons ini memakai format GeoJSON langsung, bukan amplop data.

- Peran: **Wisatawan**
- Sukses: **200** Geometri rute berhasil diambil.
- Kebutuhan: KF-11

**Contoh respons positif**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          107.6101,
          -6.9212
        ]
      },
      "properties": {
        "kind": "waypoint",
        "plan_item_id": "d1000000-0000-4000-8000-000000000001",
        "urutan": 1,
        "nama_tempat": "Hotel Savoy Homann"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            107.6101,
            -6.9212
          ],
          [
            107.6128,
            -6.918
          ],
          [
            107.6162,
            -6.9101
          ],
          [
            107.6188,
            -6.9025
          ]
        ]
      },
      "properties": {
        "kind": "leg",
        "leg_id": "e1000000-0000-4000-8000-000000000001",
        "urutan_leg": 1,
        "nama_moda": "Trotoar Dago Heritage",
        "jenis_transportasi": "PEDESTRIAN"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          107.6188,
          -6.9025
        ]
      },
      "properties": {
        "kind": "waypoint",
        "plan_item_id": "d1000000-0000-4000-8000-000000000001",
        "urutan": 1,
        "nama_tempat": "Gedung Sate"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            107.6188,
            -6.9025
          ],
          [
            107.6172,
            -6.9085
          ],
          [
            107.6136,
            -6.914
          ],
          [
            107.6098,
            -6.9175
          ]
        ]
      },
      "properties": {
        "kind": "leg",
        "leg_id": "e1000000-0000-4000-8000-000000000002",
        "urutan_leg": 2,
        "nama_moda": "Angkot Kalapa Dago 02",
        "jenis_transportasi": "ANGKOT"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          107.6098,
          -6.9175
        ]
      },
      "properties": {
        "kind": "waypoint",
        "plan_item_id": "d1000000-0000-4000-8000-000000000002",
        "urutan": 2,
        "nama_tempat": "Braga Heritage Walk"
      }
    }
  ]
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/itineraries/{id}/route-geometry' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/itineraries/{id}/route-geometry' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Itinerary ini bukan milik akun yang sedang masuk. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Itinerary ini bukan milik akun yang sedang masuk."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Itinerary tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Itinerary tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `ROUTE_NOT_READY` | Rute belum dapat digambar karena itinerary belum memiliki cukup perhentian. | `{   "error": {     "code": "ROUTE_NOT_READY",     "message": "Rute belum dapat digambar karena itinerary belum memiliki cukup perhentian."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

## Rekomendasi dan Riwayat

### GET /itineraries/{id}/strategies/compare

Membandingkan seluruh alternatif strategi berdasarkan total biaya, durasi, dan jarak. Data diambil dari rekomendasi yang tersimpan.

- Peran: **Wisatawan**
- Sukses: **200** Perbandingan strategi berhasil diambil.
- Kebutuhan: KF-22, KF-23, KF-24, KF-25

**Contoh respons positif**

```json
{
  "data": {
    "itinerary_id": "c1000000-0000-4000-8000-000000000001",
    "total_anggaran_limit": 1500000,
    "alternatives": [
      {
        "title": "Opsi 1: Transportasi Online (Taksi atau Mobil)",
        "total_estimasi_biaya": 75000,
        "total_estimasi_durasi_menit": 32,
        "total_estimasi_jarak_km": 11.4,
        "legs": [
          {
            "urutan_leg": 1,
            "nama_moda": "GoCar Bandung",
            "instruksi_rute": "Naik taksi online dari Gedung Sate ke Braga Citywalk.",
            "jarak_leg_km": 4.2,
            "estimasi_durasi_menit": 15,
            "biaya_leg": 30000
          }
        ]
      },
      {
        "title": "Opsi 2: Transportasi Umum (Bus Trans Metro)",
        "total_estimasi_biaya": 9800,
        "total_estimasi_durasi_menit": 58,
        "total_estimasi_jarak_km": 12.1,
        "legs": [
          {
            "urutan_leg": 1,
            "nama_moda": "Jalan Kaki ke Halte",
            "instruksi_rute": "Jalan kaki 300 m ke Halte Gasibu.",
            "jarak_leg_km": 0.3,
            "estimasi_durasi_menit": 5,
            "biaya_leg": 0
          },
          {
            "urutan_leg": 2,
            "nama_moda": "Trans Metro Bandung Koridor 3",
            "instruksi_rute": "Naik TMB Koridor 3 dan turun di Halte Alun-Alun.",
            "jarak_leg_km": 3.8,
            "estimasi_durasi_menit": 25,
            "biaya_leg": 4900
          }
        ]
      }
    ],
    "catatan": "Alternatif transportasi online paling cepat, sedangkan transportasi umum paling hemat."
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/itineraries/{id}/strategies/compare' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/itineraries/{id}/strategies/compare' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Itinerary ini bukan milik akun yang sedang masuk. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Itinerary ini bukan milik akun yang sedang masuk."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Itinerary atau rekomendasi tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Itinerary atau rekomendasi tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama. | `{   "error": {     "code": "CONFLICT",     "message": "Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Itinerary belum memiliki cukup data untuk dibandingkan. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Itinerary belum memiliki cukup data untuk dibandingkan.",     "details": [       {         "field": "itinerary_id",         "message": "Rekomendasi belum tersedia."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Mesin rekomendasi sedang tidak tersedia. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Mesin rekomendasi sedang tidak tersedia."   },   "request_id": "req_demo_0009" }` |

### POST /itineraries/{id}/recommendations/calculate

Menjalankan ulang perhitungan rekomendasi untuk itinerary. Sistem mengambil konteks cuaca dan lalu lintas terbaru, memanggil mesin rekomendasi, lalu mengganti rekomendasi lama dengan hasil baru.

- Peran: **Wisatawan**
- Sukses: **200** Rekomendasi berhasil dihitung ulang.
- Kebutuhan: KF-26, KF-28, KF-31, KF-32

**Contoh respons positif**

```json
{
  "data": [
    {
      "recommendation_id": "91000000-0000-4000-8000-000000000001",
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "context_id": "a2000000-0000-4000-8000-000000000001",
      "ranking": 1,
      "total_estimated_cost": 28000,
      "total_estimated_duration": 55,
      "suitability_score": 0.94,
      "comfort_score": 0.89,
      "weather_impact_score": 0.92,
      "traffic_impact_score": 0.81,
      "catatan_konteks": "Rute ini memakai Angkot 02, TMB Koridor 3, dan shuttle tertutup. Hanya 1,5 km jalan kaki terbuka sehingga tetap aman saat hujan ringan.",
      "generated_at": "2026-10-30 14:12:00",
      "itinerary": {
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "judul_perjalanan": "Bandung Heritage & Kuliner Weekend"
      },
      "konteks": {
        "context_id": "a2000000-0000-4000-8000-000000000001",
        "kondisi_cuaca": "Hujan Ringan",
        "kondisi_lalu_lintas": "Padat",
        "tingkat_curah_hujan": 8.4
      }
    },
    {
      "recommendation_id": "91000000-0000-4000-8000-000000000002",
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "context_id": "a2000000-0000-4000-8000-000000000001",
      "ranking": 2,
      "total_estimated_cost": 122000,
      "total_estimated_duration": 47,
      "suitability_score": 0.86,
      "comfort_score": 0.94,
      "weather_impact_score": 0.84,
      "traffic_impact_score": 0.62,
      "catatan_konteks": "Taksi online memberi waktu tempuh lebih singkat dan terlindung dari hujan, tetapi biaya naik dan rawan tertahan kemacetan Jl. Asia Afrika.",
      "generated_at": "2026-10-30 14:12:00",
      "itinerary": {
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "judul_perjalanan": "Bandung Heritage & Kuliner Weekend"
      },
      "konteks": {
        "context_id": "a2000000-0000-4000-8000-000000000001",
        "kondisi_cuaca": "Hujan Ringan",
        "kondisi_lalu_lintas": "Padat",
        "tingkat_curah_hujan": 8.4
      }
    }
  ],
  "message": "Rekomendasi berhasil dihitung ulang.",
  "meta": {
    "context_id": "a2000000-0000-4000-8000-000000000001",
    "generated_at": "2026-10-30 15:58:00",
    "dipicu_oleh": "perubahan_urutan_destinasi"
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/itineraries/{id}/recommendations/calculate' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/itineraries/{id}/recommendations/calculate' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Itinerary ini bukan milik akun yang sedang masuk. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Itinerary ini bukan milik akun yang sedang masuk."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Itinerary tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Itinerary tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama. | `{   "error": {     "code": "CONFLICT",     "message": "Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Itinerary belum memiliki destinasi atau preferensi yang cukup. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Itinerary belum memiliki destinasi atau preferensi yang cukup.",     "details": [       {         "field": "destinasi",         "message": "Tambahkan minimal satu destinasi."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Perhitungan ulang terlalu sering. Tunggu beberapa saat. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Perhitungan ulang terlalu sering. Tunggu beberapa saat."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Mesin rekomendasi atau layanan cuaca sedang tidak tersedia. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Mesin rekomendasi atau layanan cuaca sedang tidak tersedia."   },   "request_id": "req_demo_0009" }` |

### GET /itineraries/{id}/recommendations

Menampilkan rekomendasi yang tersimpan untuk satu itinerary, diurutkan berdasarkan peringkat.

- Peran: **Wisatawan**
- Sukses: **200** Daftar rekomendasi berhasil diambil.
- Kebutuhan: KF-26, KF-27

**Contoh respons positif**

```json
{
  "data": [
    {
      "recommendation_id": "91000000-0000-4000-8000-000000000001",
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "context_id": "a2000000-0000-4000-8000-000000000001",
      "ranking": 1,
      "total_estimated_cost": 28000,
      "total_estimated_duration": 55,
      "suitability_score": 0.94,
      "comfort_score": 0.89,
      "weather_impact_score": 0.92,
      "traffic_impact_score": 0.81,
      "catatan_konteks": "Rute ini memakai Angkot 02, TMB Koridor 3, dan shuttle tertutup. Hanya 1,5 km jalan kaki terbuka sehingga tetap aman saat hujan ringan.",
      "generated_at": "2026-10-30 14:12:00",
      "itinerary": {
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "judul_perjalanan": "Bandung Heritage & Kuliner Weekend"
      },
      "konteks": {
        "context_id": "a2000000-0000-4000-8000-000000000001",
        "kondisi_cuaca": "Hujan Ringan",
        "kondisi_lalu_lintas": "Padat",
        "tingkat_curah_hujan": 8.4
      }
    },
    {
      "recommendation_id": "91000000-0000-4000-8000-000000000002",
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "context_id": "a2000000-0000-4000-8000-000000000001",
      "ranking": 2,
      "total_estimated_cost": 122000,
      "total_estimated_duration": 47,
      "suitability_score": 0.86,
      "comfort_score": 0.94,
      "weather_impact_score": 0.84,
      "traffic_impact_score": 0.62,
      "catatan_konteks": "Taksi online memberi waktu tempuh lebih singkat dan terlindung dari hujan, tetapi biaya naik dan rawan tertahan kemacetan Jl. Asia Afrika.",
      "generated_at": "2026-10-30 14:12:00",
      "itinerary": {
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "judul_perjalanan": "Bandung Heritage & Kuliner Weekend"
      },
      "konteks": {
        "context_id": "a2000000-0000-4000-8000-000000000001",
        "kondisi_cuaca": "Hujan Ringan",
        "kondisi_lalu_lintas": "Padat",
        "tingkat_curah_hujan": 8.4
      }
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/itineraries/{id}/recommendations' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/itineraries/{id}/recommendations' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Itinerary ini bukan milik akun yang sedang masuk. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Itinerary ini bukan milik akun yang sedang masuk."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Itinerary tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Itinerary tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama. | `{   "error": {     "code": "CONFLICT",     "message": "Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Mesin rekomendasi mobilitas (Mobility ML Recommendation Engine) sedang offline atau membutuhkan waktu respons lebih lama. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Mesin rekomendasi mobilitas (Mobility ML Recommendation Engine) sedang offline atau membutuhkan waktu respons lebih lama."   },   "request_id": "req_demo_0008" }` |

### GET /recommendations/{id}

Menampilkan rincian skor, biaya, durasi, dan penjelasan konteks untuk satu rekomendasi.

- Peran: **Wisatawan**
- Sukses: **200** Detail rekomendasi berhasil diambil.
- Kebutuhan: KF-27, KF-31, KF-32

**Contoh respons positif**

```json
{
  "data": {
    "recommendation_id": "91000000-0000-4000-8000-000000000001",
    "itinerary_id": "c1000000-0000-4000-8000-000000000001",
    "context_id": "a2000000-0000-4000-8000-000000000001",
    "ranking": 1,
    "total_estimated_cost": 28000,
    "total_estimated_duration": 55,
    "suitability_score": 0.94,
    "comfort_score": 0.89,
    "weather_impact_score": 0.92,
    "traffic_impact_score": 0.81,
    "catatan_konteks": "Rute ini memakai Angkot 02, TMB Koridor 3, dan shuttle tertutup. Hanya 1,5 km jalan kaki terbuka sehingga tetap aman saat hujan ringan.",
    "generated_at": "2026-10-30 14:12:00",
    "itinerary": {
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "judul_perjalanan": "Bandung Heritage & Kuliner Weekend"
    },
    "konteks": {
      "context_id": "a2000000-0000-4000-8000-000000000001",
      "kondisi_cuaca": "Hujan Ringan",
      "kondisi_lalu_lintas": "Padat",
      "tingkat_curah_hujan": 8.4
    }
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/recommendations/{id}' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/recommendations/{id}' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Rekomendasi ini bukan milik itinerary akun yang sedang masuk. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Rekomendasi ini bukan milik itinerary akun yang sedang masuk."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Rekomendasi tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Rekomendasi tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0005" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0006" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Mesin rekomendasi mobilitas (Mobility ML Recommendation Engine) sedang offline atau membutuhkan waktu respons lebih lama. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Mesin rekomendasi mobilitas (Mobility ML Recommendation Engine) sedang offline atau membutuhkan waktu respons lebih lama."   },   "request_id": "req_demo_0007" }` |

### POST /recommendations/{id}/feedback

Menyimpan sikap wisatawan terhadap rekomendasi. Endpoint dan struktur data ini adalah usulan perluasan karena tabel umpan balik belum ada pada SQL saat ini. Lihat dokumen pemetaan basis data untuk rancangan tabelnya.

- Peran: **Wisatawan**
- Sukses: **201** Umpan balik berhasil disimpan.
- Status: **usulan perluasan**
- Kebutuhan: KF-33

**Contoh respons positif**

```json
{
  "data": {
    "feedback_id": "fb100000-0000-4000-8000-000000000001",
    "recommendation_id": "91000000-0000-4000-8000-000000000001",
    "user_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01",
    "status_penerimaan": "diterima",
    "skor_kepuasan": 5,
    "catatan": "Rute nyaman dan sesuai kebutuhan rombongan.",
    "waktu_dibuat": "2026-10-30 16:02:00"
  },
  "message": "Umpan balik berhasil disimpan."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/recommendations/{id}/feedback' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/recommendations/{id}/feedback' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Rekomendasi ini bukan milik itinerary akun yang sedang masuk. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Rekomendasi ini bukan milik itinerary akun yang sedang masuk."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Rekomendasi tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Rekomendasi tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `FEEDBACK_ALREADY_EXISTS` | Umpan balik untuk rekomendasi ini sudah pernah dikirim. | `{   "error": {     "code": "FEEDBACK_ALREADY_EXISTS",     "message": "Umpan balik untuk rekomendasi ini sudah pernah dikirim."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Umpan balik belum lengkap atau skor di luar rentang 1 sampai 5. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Umpan balik belum lengkap atau skor di luar rentang 1 sampai 5.",     "details": [       {         "field": "skor_kepuasan",         "message": "Skor kepuasan harus antara 1 sampai 5."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Mesin rekomendasi mobilitas (Mobility ML Recommendation Engine) sedang offline atau membutuhkan waktu respons lebih lama. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Mesin rekomendasi mobilitas (Mobility ML Recommendation Engine) sedang offline atau membutuhkan waktu respons lebih lama."   },   "request_id": "req_demo_0009" }` |

### GET /user/recommendation-history

Menampilkan riwayat rekomendasi yang pernah dibuat untuk seluruh itinerary wisatawan, termasuk konteks cuaca dan waktu perhitungan.

- Peran: **Wisatawan**
- Sukses: **200** Riwayat rekomendasi berhasil diambil.
- Kebutuhan: KF-33

**Contoh respons positif**

```json
{
  "data": [
    {
      "recommendation_id": "91000000-0000-4000-8000-000000000001",
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "judul_perjalanan": "Bandung Heritage & Kuliner Weekend",
      "ranking": 1,
      "total_estimated_cost": 28000,
      "total_estimated_duration": 55,
      "suitability_score": 0.94,
      "kondisi_cuaca": "Hujan Ringan",
      "catatan_konteks": "Rute ini memakai Angkot 02, TMB Koridor 3, dan shuttle tertutup. Hanya 1,5 km jalan kaki terbuka sehingga tetap aman saat hujan ringan.",
      "generated_at": "2026-10-30 14:12:00"
    },
    {
      "recommendation_id": "91000000-0000-4000-8000-000000000002",
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "judul_perjalanan": "Bandung Heritage & Kuliner Weekend",
      "ranking": 2,
      "total_estimated_cost": 122000,
      "total_estimated_duration": 47,
      "suitability_score": 0.86,
      "kondisi_cuaca": "Hujan Ringan",
      "catatan_konteks": "Taksi online memberi waktu tempuh lebih singkat dan terlindung dari hujan, tetapi biaya naik dan rawan tertahan kemacetan Jl. Asia Afrika.",
      "generated_at": "2026-10-30 14:12:00"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Rentang tanggal riwayat tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Rentang tanggal riwayat tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Hanya wisatawan yang memiliki riwayat rekomendasi pribadi. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Hanya wisatawan yang memiliki riwayat rekomendasi pribadi."   },   "request_id": "req_demo_0003" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0004" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0005" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi."   },   "request_id": "req_demo_0006" }` |

## Notifikasi

### GET /itineraries/{id}/alerts

Menampilkan seluruh notifikasi perjalanan untuk satu itinerary. Endpoint ini cocok untuk memuat ulang daftar setelah koneksi aliran event terputus.

- Peran: **Wisatawan**
- Sukses: **200** Daftar peringatan berhasil diambil.
- Kebutuhan: KF-29

**Contoh respons positif**

```json
{
  "data": [
    {
      "notifikasi_id": "a3000000-0000-4000-8000-000000000001",
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "judul_peringatan": "Hujan lebat di sektor Dago",
      "pesan_kendala": "Curah hujan terpantau 14,5 mm per jam. Leg jalan kaki menuju Saung Angklung Udjo dialihkan ke shuttle tertutup.",
      "jenis_pemicu": "cuaca_hujan",
      "tingkat_urgensi": "peringatan",
      "waktu_dibuat": "2026-10-30 14:20:00",
      "is_dibaca": false,
      "itinerary": {
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "judul_perjalanan": "Bandung Heritage & Kuliner Weekend"
      }
    },
    {
      "notifikasi_id": "a3000000-0000-4000-8000-000000000002",
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "judul_peringatan": "Kepadatan meningkat di Jl. Asia Afrika",
      "pesan_kendala": "Kepadatan jalan tercatat 0,72. Perjalanan dengan taksi berpotensi terlambat 8 sampai 12 menit.",
      "jenis_pemicu": "lalu_lintas",
      "tingkat_urgensi": "info",
      "waktu_dibuat": "2026-10-30 13:45:00",
      "is_dibaca": true,
      "itinerary": {
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "judul_perjalanan": "Bandung Heritage & Kuliner Weekend"
      }
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/itineraries/{id}/alerts' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/itineraries/{id}/alerts' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Itinerary ini bukan milik akun yang sedang masuk. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Itinerary ini bukan milik akun yang sedang masuk."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Itinerary tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Itinerary tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama. | `{   "error": {     "code": "CONFLICT",     "message": "Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan pemantauan kondisi cuaca dan lalu lintas real-time (SSE Service) sedang terputus. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan pemantauan kondisi cuaca dan lalu lintas real-time (SSE Service) sedang terputus."   },   "request_id": "req_demo_0008" }` |

### GET /itineraries/{id}/alerts/stream

Membuka aliran Server-Sent Events untuk peringatan perjalanan. Endpoint ini tidak dapat dijalankan sepenuhnya dari Swagger UI karena koneksi perlu dibiarkan terbuka. Contoh event tetap ditampilkan pada dokumentasi.

- Peran: **Wisatawan**
- Sukses: **200** Aliran event dibuka. Koneksi tetap terbuka sampai klien memutuskan.
- Kebutuhan: KF-29

**Contoh respons positif**

```text
event: mobility_alert
data: {"notifikasi_id":"a3000000-0000-4000-8000-000000000001","judul_peringatan":"Hujan lebat di sektor Dago","pesan_kendala":"Curah hujan terpantau 14,5 mm per jam. Leg jalan kaki menuju Saung Angklung Udjo dialihkan ke shuttle tertutup.","tingkat_urgensi":"peringatan","waktu_dibuat":"2026-10-30 14:20:00"}

event: ping
data: {"waktu":"2026-10-30 15:58:30"}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/itineraries/{id}/alerts/stream' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/itineraries/{id}/alerts/stream' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Itinerary ini bukan milik akun yang sedang masuk. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Itinerary ini bukan milik akun yang sedang masuk."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Itinerary tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Itinerary tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama. | `{   "error": {     "code": "CONFLICT",     "message": "Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak koneksi aliran event untuk akun ini. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak koneksi aliran event untuk akun ini."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan pemantauan kondisi cuaca dan lalu lintas real-time (SSE Service) sedang terputus. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan pemantauan kondisi cuaca dan lalu lintas real-time (SSE Service) sedang terputus."   },   "request_id": "req_demo_0008" }` |

### GET /notifications

Menampilkan seluruh notifikasi perjalanan milik wisatawan, terbaru lebih dahulu. Admin memakai endpoint /admin/notifications untuk melihat seluruh data.

- Peran: **Wisatawan**
- Sukses: **200** Daftar notifikasi berhasil diambil.
- Kebutuhan: KF-29

**Contoh respons positif**

```json
{
  "data": [
    {
      "notifikasi_id": "a3000000-0000-4000-8000-000000000001",
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "judul_peringatan": "Hujan lebat di sektor Dago",
      "pesan_kendala": "Curah hujan terpantau 14,5 mm per jam. Leg jalan kaki menuju Saung Angklung Udjo dialihkan ke shuttle tertutup.",
      "jenis_pemicu": "cuaca_hujan",
      "tingkat_urgensi": "peringatan",
      "waktu_dibuat": "2026-10-30 14:20:00",
      "is_dibaca": false,
      "itinerary": {
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "judul_perjalanan": "Bandung Heritage & Kuliner Weekend"
      }
    },
    {
      "notifikasi_id": "a3000000-0000-4000-8000-000000000002",
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "judul_peringatan": "Kepadatan meningkat di Jl. Asia Afrika",
      "pesan_kendala": "Kepadatan jalan tercatat 0,72. Perjalanan dengan taksi berpotensi terlambat 8 sampai 12 menit.",
      "jenis_pemicu": "lalu_lintas",
      "tingkat_urgensi": "info",
      "waktu_dibuat": "2026-10-30 13:45:00",
      "is_dibaca": true,
      "itinerary": {
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "judul_perjalanan": "Bandung Heritage & Kuliner Weekend"
      }
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Format parameter pada permintaan daftar notifikasi pengguna tidak valid atau nilai query di luar batas yang diizinkan. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Format parameter pada permintaan daftar notifikasi pengguna tidak valid atau nilai query di luar batas yang diizinkan."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Hanya wisatawan yang memiliki daftar notifikasi pribadi. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Hanya wisatawan yang memiliki daftar notifikasi pribadi."   },   "request_id": "req_demo_0003" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0004" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0005" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi."   },   "request_id": "req_demo_0006" }` |

### PATCH /notifications/{id}/read

Mengubah is_dibaca menjadi true untuk satu notifikasi. Bila notifikasi sudah dibaca, operasi tetap berhasil dan data dikembalikan tanpa perubahan.

- Peran: **Wisatawan**
- Sukses: **200** Notifikasi ditandai sudah dibaca.
- Kebutuhan: KF-29

**Contoh respons positif**

```json
{
  "data": {
    "notifikasi_id": "a3000000-0000-4000-8000-000000000001",
    "itinerary_id": "c1000000-0000-4000-8000-000000000001",
    "judul_peringatan": "Hujan lebat di sektor Dago",
    "pesan_kendala": "Curah hujan terpantau 14,5 mm per jam. Leg jalan kaki menuju Saung Angklung Udjo dialihkan ke shuttle tertutup.",
    "jenis_pemicu": "cuaca_hujan",
    "tingkat_urgensi": "peringatan",
    "waktu_dibuat": "2026-10-30 14:20:00",
    "is_dibaca": true,
    "itinerary": {
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "judul_perjalanan": "Bandung Heritage & Kuliner Weekend"
    }
  },
  "message": "Notifikasi ditandai sudah dibaca."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/notifications/{id}/read' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/notifications/{id}/read' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Notifikasi ini bukan milik akun yang sedang masuk. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Notifikasi ini bukan milik akun yang sedang masuk."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Notifikasi tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Notifikasi tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas). | `{   "error": {     "code": "CONFLICT",     "message": "Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas)."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Data input untuk tandai notifikasi sudah dibaca tidak lolos validasi aturan bisnis atau format field. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data input untuk tandai notifikasi sudah dibaca tidak lolos validasi aturan bisnis atau format field.",     "details": [       {         "field": "payload",         "message": "Terdapat isian yang belum lengkap atau nilainya berada di luar batasan yang ditentukan."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi."   },   "request_id": "req_demo_0009" }` |

### PATCH /notifications/read-all

Menandai seluruh notifikasi milik wisatawan sebagai sudah dibaca. Jumlah data yang berubah dikembalikan pada respons.

- Peran: **Wisatawan**
- Sukses: **200** Semua notifikasi ditandai sudah dibaca.
- Kebutuhan: KF-29

**Contoh respons positif**

```json
{
  "data": {
    "jumlah_diperbarui": 2
  },
  "message": "Semua notifikasi ditandai sudah dibaca."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Format parameter pada permintaan tandai semua notifikasi sudah dibaca tidak valid atau nilai query di luar batas yang diizinkan. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Format parameter pada permintaan tandai semua notifikasi sudah dibaca tidak valid atau nilai query di luar batas yang diizinkan."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Hanya wisatawan yang memiliki daftar notifikasi pribadi. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Hanya wisatawan yang memiliki daftar notifikasi pribadi."   },   "request_id": "req_demo_0003" }` |
| 409 | `CONFLICT` | Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas). | `{   "error": {     "code": "CONFLICT",     "message": "Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas)."   },   "request_id": "req_demo_0004" }` |
| 422 | `VALIDATION_ERROR` | Data input untuk tandai semua notifikasi sudah dibaca tidak lolos validasi aturan bisnis atau format field. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data input untuk tandai semua notifikasi sudah dibaca tidak lolos validasi aturan bisnis atau format field.",     "details": [       {         "field": "payload",         "message": "Terdapat isian yang belum lengkap atau nilainya berada di luar batasan yang ditentukan."       }     ]   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi."   },   "request_id": "req_demo_0008" }` |

## Mitra

### GET /partner/fleets

Menampilkan seluruh armada milik mitra yang sedang masuk. Data mencakup jenis transportasi, kapasitas, tarif, dan status aktif.

- Peran: **Mitra**
- Sukses: **200** Daftar armada berhasil diambil.
- Kebutuhan: KF-14, KF-17

**Contoh respons positif**

```json
{
  "data": [
    {
      "transportasi_id": "f1000000-0000-4000-8000-000000000003",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
      "nama_moda": "GoCar Bandung",
      "jenis_transportasi": "ONLINE_TAXI",
      "kapasitas_penumpang": 4,
      "status_aktif": true,
      "sumber_data": "Mitra Portal",
      "terakhir_diperbarui": "2026-10-30 14:05:00",
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "mitra": {
        "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
        "nama_perusahaan": "PT Bandung Jaya Tour"
      },
      "detail": {
        "tarif_dasar": 10000,
        "tarif_per_km": 4500,
        "surge_multiplier": 1.2
      }
    },
    {
      "transportasi_id": "f1000000-0000-4000-8000-000000000005",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
      "nama_moda": "Sewa Avanza Bandung Jaya",
      "jenis_transportasi": "RENTAL",
      "kapasitas_penumpang": 7,
      "status_aktif": true,
      "sumber_data": "Mitra Portal",
      "terakhir_diperbarui": "2026-10-28 09:15:00",
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "mitra": {
        "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
        "nama_perusahaan": "PT Bandung Jaya Tour"
      },
      "detail": {
        "tarif_per_hari": 450000,
        "termasuk_driver": true,
        "jenis_bahan_bakar": "Bensin"
      }
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Filter armada tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Filter armada tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Hanya mitra yang dapat melihat daftar armada. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Hanya mitra yang dapat melihat daftar armada."   },   "request_id": "req_demo_0003" }` |
| 409 | `CONFLICT` | Plat nomor armada atau kode kendaraan sudah terdaftar oleh mitra lain. | `{   "error": {     "code": "CONFLICT",     "message": "Plat nomor armada atau kode kendaraan sudah terdaftar oleh mitra lain."   },   "request_id": "req_demo_0004" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0005" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0006" }` |

### POST /partner/fleets

Menambahkan moda transportasi baru milik mitra. Sistem mencatat aktivitas pembuatan ke data_log secara otomatis.

- Peran: **Mitra**
- Sukses: **201** Armada berhasil ditambahkan.
- Kebutuhan: KF-13, KF-17, KF-19

**Contoh respons positif**

```json
{
  "data": {
    "transportasi_id": "f1000000-0000-4000-8000-000000000099",
    "wilayah_id": "a1000000-0000-4000-8000-000000000001",
    "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
    "nama_moda": "GoCar Bandung",
    "jenis_transportasi": "ONLINE_TAXI",
    "kapasitas_penumpang": 4,
    "status_aktif": true,
    "sumber_data": "Mitra Portal",
    "terakhir_diperbarui": "2026-10-30 14:05:00",
    "wilayah": {
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_wilayah": "Kota Bandung",
      "provinsi": "Jawa Barat"
    },
    "mitra": {
      "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
      "nama_perusahaan": "PT Bandung Jaya Tour"
    },
    "detail": {
      "tarif_dasar": 10000,
      "tarif_per_km": 4500,
      "surge_multiplier": 1.2
    }
  },
  "message": "Armada berhasil ditambahkan."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Struktur tubuh permintaan (request body) tidak dapat diproses atau format JSON rusak. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Struktur tubuh permintaan (request body) tidak dapat diproses atau format JSON rusak."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Hanya mitra yang dapat menambah armada. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Hanya mitra yang dapat menambah armada."   },   "request_id": "req_demo_0003" }` |
| 409 | `FLEET_ALREADY_EXISTS` | Armada dengan nama dan jenis yang sama sudah terdaftar. | `{   "error": {     "code": "FLEET_ALREADY_EXISTS",     "message": "Armada dengan nama dan jenis yang sama sudah terdaftar."   },   "request_id": "req_demo_0004" }` |
| 422 | `VALIDATION_ERROR` | Data armada belum lengkap atau tarif tidak valid. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data armada belum lengkap atau tarif tidak valid.",     "details": [       {         "field": "nama_moda",         "message": "Nama armada wajib diisi."       },       {         "field": "kapasitas_penumpang",         "message": "Kapasitas minimal 1."       }     ]   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### GET /partner/fleets/{id}

Menampilkan detail satu armada beserta rincian tarif dan wilayah layanan.

- Peran: **Mitra**
- Sukses: **200** Detail armada berhasil diambil.
- Kebutuhan: KF-14, KF-17

**Contoh respons positif**

```json
{
  "data": {
    "transportasi_id": "f1000000-0000-4000-8000-000000000003",
    "wilayah_id": "a1000000-0000-4000-8000-000000000001",
    "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
    "nama_moda": "GoCar Bandung",
    "jenis_transportasi": "ONLINE_TAXI",
    "kapasitas_penumpang": 4,
    "status_aktif": true,
    "sumber_data": "Mitra Portal",
    "terakhir_diperbarui": "2026-10-30 14:05:00",
    "wilayah": {
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_wilayah": "Kota Bandung",
      "provinsi": "Jawa Barat"
    },
    "mitra": {
      "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
      "nama_perusahaan": "PT Bandung Jaya Tour"
    },
    "detail": {
      "tarif_dasar": 10000,
      "tarif_per_km": 4500,
      "surge_multiplier": 1.2
    }
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/partner/fleets/{id}' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/partner/fleets/{id}' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Armada ini bukan milik mitra yang sedang masuk. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Armada ini bukan milik mitra yang sedang masuk."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Armada tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Armada tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Plat nomor armada atau kode kendaraan sudah terdaftar oleh mitra lain. | `{   "error": {     "code": "CONFLICT",     "message": "Plat nomor armada atau kode kendaraan sudah terdaftar oleh mitra lain."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### PUT /partner/fleets/{id}

Memperbarui data armada dan tarif. Setiap perubahan dicatat pada data_log untuk kebutuhan audit.

- Peran: **Mitra**
- Sukses: **200** Armada berhasil diperbarui.
- Kebutuhan: KF-15, KF-19

**Contoh respons positif**

```json
{
  "data": {
    "transportasi_id": "f1000000-0000-4000-8000-000000000003",
    "wilayah_id": "a1000000-0000-4000-8000-000000000001",
    "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
    "nama_moda": "GoCar Bandung",
    "jenis_transportasi": "ONLINE_TAXI",
    "kapasitas_penumpang": 4,
    "status_aktif": true,
    "sumber_data": "Mitra Portal",
    "terakhir_diperbarui": "2026-10-30 14:05:00",
    "wilayah": {
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_wilayah": "Kota Bandung",
      "provinsi": "Jawa Barat"
    },
    "mitra": {
      "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
      "nama_perusahaan": "PT Bandung Jaya Tour"
    },
    "detail": {
      "tarif_dasar": 10000,
      "tarif_per_km": 5000,
      "surge_multiplier": 1.2
    }
  },
  "message": "Armada berhasil diperbarui."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/partner/fleets/{id}' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/partner/fleets/{id}' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Armada ini bukan milik mitra yang sedang masuk. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Armada ini bukan milik mitra yang sedang masuk."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Armada tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Armada tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `FLEET_IN_USE` | Armada sedang dipakai pada itinerary aktif sehingga tarif tidak dapat diubah. | `{   "error": {     "code": "FLEET_IN_USE",     "message": "Armada sedang dipakai pada itinerary aktif sehingga tarif tidak dapat diubah."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Data armada belum lengkap atau tarif tidak valid. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data armada belum lengkap atau tarif tidak valid.",     "details": [       {         "field": "tarif_per_km",         "message": "Tarif per kilometer tidak boleh negatif."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |

### DELETE /partner/fleets/{id}

Menghapus armada yang tidak lagi dipakai. Armada yang masih terhubung dengan segmen perjalanan aktif tidak dapat dihapus.

- Peran: **Mitra**
- Sukses: **204** Armada berhasil dihapus. Tidak ada isi respons.
- Kebutuhan: KF-16, KF-19

**Contoh respons positif**

Tidak ada isi respons. Server hanya mengembalikan kode 204.

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Identifier pada path URL '/partner/fleets/{id}' tidak berformat UUID atau integer yang valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Identifier pada path URL '/partner/fleets/{id}' tidak berformat UUID atau integer yang valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Armada ini bukan milik mitra yang sedang masuk. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Armada ini bukan milik mitra yang sedang masuk."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Armada tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Armada tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `FLEET_IN_USE` | Armada masih dipakai pada itinerary atau segmen perjalanan aktif. | `{   "error": {     "code": "FLEET_IN_USE",     "message": "Armada masih dipakai pada itinerary atau segmen perjalanan aktif."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### GET /partner/audit-logs

Menampilkan riwayat perubahan data yang dilakukan mitra, termasuk perubahan tarif, status armada, dan verifikasi.

- Peran: **Mitra**
- Sukses: **200** Jejak audit berhasil diambil.
- Kebutuhan: KF-19

**Contoh respons positif**

```json
{
  "data": [
    {
      "log_id": "a5000000-0000-4000-8000-000000000001",
      "entitas_terdampak": "transportasi",
      "id_referensi": "f1000000-0000-4000-8000-000000000003",
      "aksi": "UPDATE",
      "detail_perubahan": {
        "tarif_per_km": {
          "before": 4000,
          "after": 4500
        },
        "surge_multiplier": {
          "before": 1.1,
          "after": 1.2
        }
      },
      "aktor_pelaksana": "Dewi Lestari",
      "waktu_log": "2026-10-30 14:05:00"
    },
    {
      "log_id": "a5000000-0000-4000-8000-000000000002",
      "entitas_terdampak": "mitra_transportasi",
      "id_referensi": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
      "aksi": "UPDATE",
      "detail_perubahan": {
        "status_verifikasi": {
          "before": false,
          "after": true
        },
        "verified_by_admin_id": {
          "before": null,
          "after": "7d3c9b1a-4e2f-4c83-b015-3c4d5e6f7a21"
        }
      },
      "aktor_pelaksana": "Tantan Nugraha",
      "waktu_log": "2026-10-27 09:12:00"
    },
    {
      "log_id": "a5000000-0000-4000-8000-000000000003",
      "entitas_terdampak": "ulasan_tempat",
      "id_referensi": "a4000000-0000-4000-8000-000000000008",
      "aksi": "UPDATE",
      "detail_perubahan": {
        "status_publikasi": {
          "before": true,
          "after": false
        },
        "alasan": "Menunggu pemeriksaan moderator"
      },
      "aktor_pelaksana": "Johannes Putra",
      "waktu_log": "2026-10-29 19:02:00"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 3,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Filter audit tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Filter audit tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Hanya mitra yang dapat melihat jejak audit mitra. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Hanya mitra yang dapat melihat jejak audit mitra."   },   "request_id": "req_demo_0003" }` |
| 429 | `RATE_LIMITED` | Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali."   },   "request_id": "req_demo_0004" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0005" }` |

## Admin

### GET /admin/dashboard

Menampilkan ringkasan jumlah pengguna, mitra, wilayah, destinasi, itinerary, rekomendasi, notifikasi, dan aktivitas terbaru.

- Peran: **Admin**
- Sukses: **200** Ringkasan operasional berhasil diambil.
- Kebutuhan: KF-05, KF-14, KF-33

**Contoh respons positif**

```json
{
  "data": {
    "pengguna": {
      "total": 8,
      "wisatawan": 3,
      "mitra": 3,
      "admin": 2
    },
    "mitra": {
      "total": 3,
      "terverifikasi": 2,
      "menunggu_verifikasi": 1
    },
    "wilayah": {
      "total": 4,
      "cakupan_aktif": 3
    },
    "destinasi": {
      "total": 12,
      "populer": 10,
      "rata_rata_rating": 4.58
    },
    "itinerary": {
      "total": 5,
      "draft": 2,
      "aktif": 2,
      "selesai": 1,
      "dibatalkan": 0
    },
    "rekomendasi": {
      "total": 10,
      "dihitung_hari_ini": 6
    },
    "notifikasi": {
      "total": 5,
      "belum_dibaca": 3
    },
    "aktivitas_terbaru": [
      {
        "log_id": "a5000000-0000-4000-8000-000000000001",
        "entitas_terdampak": "transportasi",
        "id_referensi": "f1000000-0000-4000-8000-000000000003",
        "aksi": "UPDATE",
        "detail_perubahan": {
          "tarif_per_km": {
            "before": 4000,
            "after": 4500
          },
          "surge_multiplier": {
            "before": 1.1,
            "after": 1.2
          }
        },
        "aktor_pelaksana": "Dewi Lestari",
        "waktu_log": "2026-10-30 14:05:00"
      },
      {
        "log_id": "a5000000-0000-4000-8000-000000000002",
        "entitas_terdampak": "mitra_transportasi",
        "id_referensi": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
        "aksi": "UPDATE",
        "detail_perubahan": {
          "status_verifikasi": {
            "before": false,
            "after": true
          },
          "verified_by_admin_id": {
            "before": null,
            "after": "7d3c9b1a-4e2f-4c83-b015-3c4d5e6f7a21"
          }
        },
        "aktor_pelaksana": "Tantan Nugraha",
        "waktu_log": "2026-10-27 09:12:00"
      }
    ],
    "diperbarui_pada": "2026-10-30 15:45:00"
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0004" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0005" }` |

### GET /admin/users

Menampilkan seluruh pengguna dengan filter peran dan kata kunci. Data profil mengikuti peran masing-masing.

- Peran: **Admin**
- Sukses: **200** Daftar pengguna berhasil diambil.
- Kebutuhan: KF-02, KF-05

**Contoh respons positif**

```json
{
  "data": [
    {
      "user_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01",
      "nama": "Alfian Hanif",
      "email": "alfian.hanif@example.com",
      "nomor_telepon": "+6281321001001",
      "role": "tourist",
      "profil": {
        "preferensi_umum": "Wisata Budaya & Kuliner",
        "jumlah_itinerary": 2,
        "jumlah_notifikasi_belum_dibaca": 3
      }
    },
    {
      "user_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e02",
      "nama": "Salsabila Putri",
      "email": "salsabila.putri@example.com",
      "nomor_telepon": "+6281321001002",
      "role": "tourist",
      "profil": {
        "preferensi_umum": "Sejarah & Fotografi",
        "jumlah_itinerary": 2,
        "jumlah_notifikasi_belum_dibaca": 0
      }
    },
    {
      "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
      "nama": "Dewi Lestari",
      "email": "dewi.lestari@bandungjayatour.co.id",
      "nomor_telepon": "+622242020011",
      "role": "partner",
      "profil": {
        "nama_perusahaan": "PT Bandung Jaya Tour",
        "legalitas_doc_url": "/docs/legalitas-bandung-jaya.txt",
        "status_verifikasi": true,
        "verified_by_admin_id": "7d3c9b1a-4e2f-4c83-b015-3c4d5e6f7a21",
        "jumlah_armada": 3
      }
    },
    {
      "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f13",
      "nama": "Yusuf Maulana",
      "email": "yusuf@bandungecoride.id",
      "nomor_telepon": "+6281222003033",
      "role": "partner",
      "profil": {
        "nama_perusahaan": "Bandung Eco Ride",
        "legalitas_doc_url": "/docs/legalitas-bandung-eco-ride.txt",
        "status_verifikasi": false,
        "verified_by_admin_id": null,
        "jumlah_armada": 1
      }
    },
    {
      "user_id": "7d3c9b1a-4e2f-4c83-b015-3c4d5e6f7a21",
      "nama": "Tantan Nugraha",
      "email": "tantan.nugraha@findholiday.id",
      "nomor_telepon": "+6281122004001",
      "role": "admin",
      "profil": {
        "admin_level": "super_admin",
        "departemen": "Operasional",
        "terakhir_aktif": "2026-10-30 15:42:00"
      }
    },
    {
      "user_id": "7d3c9b1a-4e2f-4c83-b015-3c4d5e6f7a22",
      "nama": "Johannes Putra",
      "email": "johannes.putra@findholiday.id",
      "nomor_telepon": "+6281122004002",
      "role": "admin",
      "profil": {
        "admin_level": "moderator",
        "departemen": "Verifikasi Mitra",
        "terakhir_aktif": "2026-10-30 14:05:00"
      }
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 8,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 400 | `BAD_REQUEST` | Filter pengguna tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Filter pengguna tidak valid."   },   "request_id": "req_demo_0002" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0003" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0004" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0005" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0006" }` |

### GET /admin/users/{id}

Menampilkan detail pengguna beserta profil, jumlah itinerary, dan informasi mitra bila ada.

- Peran: **Admin**
- Sukses: **200** Detail pengguna berhasil diambil.
- Kebutuhan: KF-05

**Contoh respons positif**

```json
{
  "data": {
    "user_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01",
    "nama": "Alfian Hanif",
    "email": "alfian.hanif@example.com",
    "nomor_telepon": "+6281321001001",
    "role": "tourist",
    "profil": {
      "preferensi_umum": "Wisata Budaya & Kuliner",
      "jumlah_itinerary": 2,
      "jumlah_notifikasi_belum_dibaca": 3
    }
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Pengguna tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Pengguna tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0005" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0006" }` |

### PUT /admin/users/{id}

Mengubah nama, email, nomor telepon, atau peran pengguna. Perubahan peran terakhir admin dilindungi agar akses administrasi tetap tersedia.

- Peran: **Admin**
- Sukses: **200** Data pengguna berhasil diperbarui.
- Kebutuhan: KF-04, KF-02

**Contoh respons positif**

```json
{
  "data": {
    "user_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e02",
    "nama": "Salsabila Putri",
    "email": "salsabila.putri@example.com",
    "nomor_telepon": "+6281321001002",
    "role": "tourist",
    "profil": {
      "preferensi_umum": "Sejarah & Fotografi",
      "jumlah_itinerary": 2,
      "jumlah_notifikasi_belum_dibaca": 0
    }
  },
  "message": "Data pengguna berhasil diperbarui."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Pengguna tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Pengguna tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `EMAIL_ALREADY_USED` | Email sudah dipakai oleh pengguna lain. | `{   "error": {     "code": "EMAIL_ALREADY_USED",     "message": "Email sudah dipakai oleh pengguna lain."   },   "request_id": "req_demo_0005" }` |
| 409 | `LAST_ADMIN` | Peran admin terakhir tidak dapat diubah. | `{   "error": {     "code": "LAST_ADMIN",     "message": "Peran admin terakhir tidak dapat diubah."   },   "request_id": "req_demo_0006" }` |
| 422 | `VALIDATION_ERROR` | Data pengguna belum lengkap atau formatnya belum benar. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data pengguna belum lengkap atau formatnya belum benar.",     "details": [       {         "field": "email",         "message": "Format email belum benar."       }     ]   },   "request_id": "req_demo_0007" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0008" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0009" }` |

### DELETE /admin/users/{id}

Menghapus akun pengguna beserta data terkait. Akun admin terakhir tidak dapat dihapus.

- Peran: **Admin**
- Sukses: **204** Pengguna berhasil dihapus. Tidak ada isi respons.
- Kebutuhan: KF-02, KF-04

**Contoh respons positif**

Tidak ada isi respons. Server hanya mengembalikan kode 204.

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Pengguna tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Pengguna tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `LAST_ADMIN` | Akun admin terakhir tidak dapat dihapus. | `{   "error": {     "code": "LAST_ADMIN",     "message": "Akun admin terakhir tidak dapat dihapus."   },   "request_id": "req_demo_0005" }` |
| 409 | `USER_HAS_ACTIVE_DATA` | Pengguna masih memiliki itinerary aktif yang harus diselesaikan terlebih dahulu. | `{   "error": {     "code": "USER_HAS_ACTIVE_DATA",     "message": "Pengguna masih memiliki itinerary aktif yang harus diselesaikan terlebih dahulu."   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |

### GET /admin/partners

Menampilkan mitra transportasi beserta status verifikasi dan jumlah armada. Digunakan untuk proses verifikasi.

- Peran: **Admin**
- Sukses: **200** Daftar mitra berhasil diambil.
- Kebutuhan: KF-18, KF-19

**Contoh respons positif**

```json
{
  "data": [
    {
      "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
      "nama": "Dewi Lestari",
      "email": "dewi.lestari@bandungjayatour.co.id",
      "nomor_telepon": "+622242020011",
      "role": "partner",
      "profil": {
        "nama_perusahaan": "PT Bandung Jaya Tour",
        "legalitas_doc_url": "/docs/legalitas-bandung-jaya.txt",
        "status_verifikasi": true,
        "verified_by_admin_id": "7d3c9b1a-4e2f-4c83-b015-3c4d5e6f7a21",
        "jumlah_armada": 3
      }
    },
    {
      "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f13",
      "nama": "Yusuf Maulana",
      "email": "yusuf@bandungecoride.id",
      "nomor_telepon": "+6281222003033",
      "role": "partner",
      "profil": {
        "nama_perusahaan": "Bandung Eco Ride",
        "legalitas_doc_url": "/docs/legalitas-bandung-eco-ride.txt",
        "status_verifikasi": false,
        "verified_by_admin_id": null,
        "jumlah_armada": 1
      }
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 400 | `BAD_REQUEST` | Filter mitra tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Filter mitra tidak valid."   },   "request_id": "req_demo_0002" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0003" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0004" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0005" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0006" }` |

### PATCH /admin/partners/{id}/verify

Mengubah status verifikasi mitra. Sistem mencatat admin yang memverifikasi dan menulis aktivitas ke data_log.

- Peran: **Admin**
- Sukses: **200** Status verifikasi mitra berhasil diperbarui.
- Kebutuhan: KF-18, KF-19

**Contoh respons positif**

```json
{
  "data": {
    "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f13",
    "nama": "Yusuf Maulana",
    "email": "yusuf@bandungecoride.id",
    "nomor_telepon": "+6281222003033",
    "role": "partner",
    "profil": {
      "nama_perusahaan": "Bandung Eco Ride",
      "legalitas_doc_url": "/docs/legalitas-bandung-eco-ride.txt",
      "status_verifikasi": true,
      "verified_by_admin_id": "7d3c9b1a-4e2f-4c83-b015-3c4d5e6f7a21",
      "jumlah_armada": 1
    }
  },
  "message": "Mitra berhasil diverifikasi."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Mitra tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Mitra tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `ALREADY_VERIFIED` | Mitra ini sudah memiliki status verifikasi yang sama. | `{   "error": {     "code": "ALREADY_VERIFIED",     "message": "Mitra ini sudah memiliki status verifikasi yang sama."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Status verifikasi wajib berupa boolean. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Status verifikasi wajib berupa boolean.",     "details": [       {         "field": "email",         "message": "Format email belum benar."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |

### GET /admin/regions

Menampilkan seluruh wilayah untuk pengelolaan cakupan layanan.

- Peran: **Admin**
- Sukses: **200** Daftar wilayah berhasil diambil.
- Kebutuhan: KF-06, KF-07

**Contoh respons positif**

```json
{
  "data": [
    {
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_wilayah": "Kota Bandung",
      "provinsi": "Jawa Barat",
      "boundary_coordinates": [
        [
          106.947,
          -6.984
        ],
        [
          107.089,
          -6.984
        ],
        [
          107.089,
          -6.822
        ],
        [
          106.947,
          -6.822
        ]
      ],
      "status_cakupan_aktif": true,
      "jumlah_destinasi": 9
    },
    {
      "wilayah_id": "a1000000-0000-4000-8000-000000000002",
      "nama_wilayah": "Kabupaten Bandung Barat",
      "provinsi": "Jawa Barat",
      "boundary_coordinates": [
        [
          107.241,
          -7.047
        ],
        [
          107.515,
          -7.047
        ],
        [
          107.515,
          -6.731
        ],
        [
          107.241,
          -6.731
        ]
      ],
      "status_cakupan_aktif": true,
      "jumlah_destinasi": 2
    },
    {
      "wilayah_id": "a1000000-0000-4000-8000-000000000003",
      "nama_wilayah": "Kota Cimahi",
      "provinsi": "Jawa Barat",
      "boundary_coordinates": [
        [
          107.497,
          -6.941
        ],
        [
          107.594,
          -6.941
        ],
        [
          107.594,
          -6.833
        ],
        [
          107.497,
          -6.833
        ]
      ],
      "status_cakupan_aktif": true,
      "jumlah_destinasi": 0
    },
    {
      "wilayah_id": "a1000000-0000-4000-8000-000000000004",
      "nama_wilayah": "Kabupaten Bandung",
      "provinsi": "Jawa Barat",
      "boundary_coordinates": [
        [
          107.402,
          -7.286
        ],
        [
          107.768,
          -7.286
        ],
        [
          107.768,
          -6.874
        ],
        [
          107.402,
          -6.874
        ]
      ],
      "status_cakupan_aktif": false,
      "jumlah_destinasi": 1
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 4,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 400 | `BAD_REQUEST` | Filter wilayah tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Filter wilayah tidak valid."   },   "request_id": "req_demo_0002" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0003" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Kode wilayah atau nama wilayah sudah terdaftar dalam sistem. | `{   "error": {     "code": "CONFLICT",     "message": "Kode wilayah atau nama wilayah sudah terdaftar dalam sistem."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### POST /admin/regions

Menambahkan wilayah layanan baru beserta batas geografis dan status cakupan.

- Peran: **Admin**
- Sukses: **201** Wilayah berhasil ditambahkan.
- Kebutuhan: KF-07

**Contoh respons positif**

```json
{
  "data": {
    "wilayah_id": "a1000000-0000-4000-8000-000000000099",
    "nama_wilayah": "Kota Bogor",
    "provinsi": "Jawa Barat",
    "boundary_coordinates": [
      [
        106.72,
        -6.65
      ],
      [
        106.86,
        -6.65
      ],
      [
        106.86,
        -6.52
      ],
      [
        106.72,
        -6.52
      ]
    ],
    "status_cakupan_aktif": true,
    "jumlah_destinasi": 0
  },
  "message": "Wilayah berhasil ditambahkan."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 409 | `REGION_ALREADY_EXISTS` | Wilayah dengan nama yang sama sudah ada. | `{   "error": {     "code": "REGION_ALREADY_EXISTS",     "message": "Wilayah dengan nama yang sama sudah ada."   },   "request_id": "req_demo_0004" }` |
| 422 | `VALIDATION_ERROR` | Data wilayah belum lengkap atau batas koordinat tidak valid. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data wilayah belum lengkap atau batas koordinat tidak valid.",     "details": [       {         "field": "nama_wilayah",         "message": "Nama wilayah wajib diisi."       }     ]   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### PUT /admin/regions/{id}

Memperbarui nama, batas, atau status cakupan wilayah.

- Peran: **Admin**
- Sukses: **200** Wilayah berhasil diperbarui.
- Kebutuhan: KF-07

**Contoh respons positif**

```json
{
  "data": {
    "wilayah_id": "a1000000-0000-4000-8000-000000000001",
    "nama_wilayah": "Kota Bandung",
    "provinsi": "Jawa Barat",
    "boundary_coordinates": [
      [
        106.947,
        -6.984
      ],
      [
        107.089,
        -6.984
      ],
      [
        107.089,
        -6.822
      ],
      [
        106.947,
        -6.822
      ]
    ],
    "status_cakupan_aktif": false,
    "jumlah_destinasi": 9
  },
  "message": "Wilayah berhasil diperbarui."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Wilayah tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Wilayah tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `REGION_ALREADY_EXISTS` | Nama wilayah sudah dipakai. | `{   "error": {     "code": "REGION_ALREADY_EXISTS",     "message": "Nama wilayah sudah dipakai."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Data wilayah belum lengkap atau batas koordinat tidak valid. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data wilayah belum lengkap atau batas koordinat tidak valid.",     "details": [       {         "field": "email",         "message": "Format email belum benar."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |

### DELETE /admin/regions/{id}

Menghapus wilayah yang tidak lagi dilayani. Wilayah yang masih memiliki destinasi atau moda transportasi tidak dapat dihapus.

- Peran: **Admin**
- Sukses: **204** Wilayah berhasil dihapus. Tidak ada isi respons.
- Kebutuhan: KF-07

**Contoh respons positif**

Tidak ada isi respons. Server hanya mengembalikan kode 204.

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Wilayah tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Wilayah tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `REGION_IN_USE` | Wilayah masih memiliki destinasi atau moda transportasi terkait. | `{   "error": {     "code": "REGION_IN_USE",     "message": "Wilayah masih memiliki destinasi atau moda transportasi terkait."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### GET /admin/places

Menampilkan seluruh tempat kunjungan dan destinasi untuk pengelolaan data.

- Peran: **Admin**
- Sukses: **200** Daftar destinasi berhasil diambil.
- Kebutuhan: KF-06, KF-07

**Contoh respons positif**

```json
{
  "data": [
    {
      "place_id": "b1000000-0000-4000-8000-000000000001",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_tempat": "Gedung Sate",
      "alamat_lengkap": "Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan",
      "latitude": -6.902484,
      "longitude": 107.618765,
      "rating_rata_rata": 4.7,
      "jumlah_review": 3210,
      "jam_buka": "08:00",
      "jam_tutup": "16:00",
      "daftar_foto_url": [
        "/media/gedung-sate-1.jpg",
        "/media/gedung-sate-2.jpg"
      ],
      "kategori_wisata": "sejarah",
      "estimasi_durasi_kunjungan": 90,
      "harga_tiket_masuk": 5000,
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "fasilitas": [
        {
          "fasilitas_id": "fa1000000-0000-4000-8000-000000000001",
          "place_id": "b1000000-0000-4000-8000-000000000001",
          "jenis": "ATM",
          "is_gratis": true,
          "fasilitas_tersedia": [
            "ATM BCA",
            "ATM Mandiri",
            "Area parkir"
          ]
        },
        {
          "fasilitas_id": "fa1000000-0000-4000-8000-000000000002",
          "place_id": "b1000000-0000-4000-8000-000000000001",
          "jenis": "TOILET_UMUM",
          "is_gratis": true,
          "fasilitas_tersedia": [
            "Toilet pria",
            "Toilet wanita",
            "Mushola"
          ]
        }
      ]
    },
    {
      "place_id": "b1000000-0000-4000-8000-000000000002",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_tempat": "Braga Heritage Walk",
      "alamat_lengkap": "Jl. Braga, Kec. Sumur Bandung",
      "latitude": -6.917464,
      "longitude": 107.60981,
      "rating_rata_rata": 4.6,
      "jumlah_review": 2890,
      "jam_buka": "00:00",
      "jam_tutup": "24:00",
      "daftar_foto_url": [
        "/media/braga-1.jpg"
      ],
      "kategori_wisata": "budaya",
      "estimasi_durasi_kunjungan": 75,
      "harga_tiket_masuk": 0,
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "fasilitas": [
        {
          "fasilitas_id": "fa1000000-0000-4000-8000-000000000003",
          "place_id": "b1000000-0000-4000-8000-000000000002",
          "jenis": "RESTORAN_KULINER",
          "is_gratis": false,
          "fasilitas_tersedia": [
            "Kafe",
            "Restoran sunda",
            "Food court"
          ]
        }
      ]
    },
    {
      "place_id": "b1000000-0000-4000-8000-000000000003",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_tempat": "Saung Angklung Udjo",
      "alamat_lengkap": "Jl. Padasuka No.118, Cibeunying Kidul",
      "latitude": -6.89753,
      "longitude": 107.63551,
      "rating_rata_rata": 4.8,
      "jumlah_review": 4100,
      "jam_buka": "09:00",
      "jam_tutup": "17:00",
      "daftar_foto_url": [
        "/media/saung-angklung-1.jpg"
      ],
      "kategori_wisata": "budaya",
      "estimasi_durasi_kunjungan": 120,
      "harga_tiket_masuk": 85000,
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "fasilitas": [
        {
          "fasilitas_id": "fa1000000-0000-4000-8000-000000000004",
          "place_id": "b1000000-0000-4000-8000-000000000003",
          "jenis": "TOILET_UMUM",
          "is_gratis": true,
          "fasilitas_tersedia": [
            "Toilet",
            "Mushola",
            "Area tunggu"
          ]
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 12,
    "total_pages": 2
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 400 | `BAD_REQUEST` | Filter destinasi tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Filter destinasi tidak valid."   },   "request_id": "req_demo_0002" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0003" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Nama tempat wisata sudah ada di wilayah ini atau kode destinasi duplikat. | `{   "error": {     "code": "CONFLICT",     "message": "Nama tempat wisata sudah ada di wilayah ini atau kode destinasi duplikat."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### POST /admin/places

Menambahkan tempat kunjungan sekaligus detail destinasi wisata. Fasilitas dapat ditambahkan melalui endpoint fasilitas.

- Peran: **Admin**
- Sukses: **201** Destinasi berhasil ditambahkan.
- Kebutuhan: KF-06, KF-07

**Contoh respons positif**

```json
{
  "data": {
    "place_id": "b1000000-0000-4000-8000-000000000099",
    "wilayah_id": "a1000000-0000-4000-8000-000000000001",
    "nama_tempat": "Museum Kota Bandung",
    "alamat_lengkap": "Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan",
    "latitude": -6.902484,
    "longitude": 107.618765,
    "rating_rata_rata": 4.7,
    "jumlah_review": 3210,
    "jam_buka": "08:00",
    "jam_tutup": "16:00",
    "daftar_foto_url": [
      "/media/gedung-sate-1.jpg",
      "/media/gedung-sate-2.jpg"
    ],
    "kategori_wisata": "sejarah",
    "estimasi_durasi_kunjungan": 90,
    "harga_tiket_masuk": 5000,
    "wilayah": {
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_wilayah": "Kota Bandung",
      "provinsi": "Jawa Barat"
    },
    "fasilitas": [
      {
        "fasilitas_id": "fa1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000001",
        "jenis": "ATM",
        "is_gratis": true,
        "fasilitas_tersedia": [
          "ATM BCA",
          "ATM Mandiri",
          "Area parkir"
        ]
      },
      {
        "fasilitas_id": "fa1000000-0000-4000-8000-000000000002",
        "place_id": "b1000000-0000-4000-8000-000000000001",
        "jenis": "TOILET_UMUM",
        "is_gratis": true,
        "fasilitas_tersedia": [
          "Toilet pria",
          "Toilet wanita",
          "Mushola"
        ]
      }
    ]
  },
  "message": "Destinasi berhasil ditambahkan."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Wilayah tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Wilayah tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `PLACE_ALREADY_EXISTS` | Destinasi dengan nama dan alamat yang sama sudah ada. | `{   "error": {     "code": "PLACE_ALREADY_EXISTS",     "message": "Destinasi dengan nama dan alamat yang sama sudah ada."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Data destinasi belum lengkap atau koordinat tidak valid. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data destinasi belum lengkap atau koordinat tidak valid.",     "details": [       {         "field": "latitude",         "message": "Latitude harus antara -90 sampai 90."       },       {         "field": "longitude",         "message": "Longitude harus antara -180 sampai 180."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |

### GET /admin/places/{id}

Menampilkan detail destinasi beserta seluruh fasilitas dan ulasan terbaru.

- Peran: **Admin**
- Sukses: **200** Detail destinasi berhasil diambil.
- Kebutuhan: KF-06, KF-07

**Contoh respons positif**

```json
{
  "data": {
    "place_id": "b1000000-0000-4000-8000-000000000001",
    "wilayah_id": "a1000000-0000-4000-8000-000000000001",
    "nama_tempat": "Gedung Sate",
    "alamat_lengkap": "Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan",
    "latitude": -6.902484,
    "longitude": 107.618765,
    "rating_rata_rata": 4.7,
    "jumlah_review": 3210,
    "jam_buka": "08:00",
    "jam_tutup": "16:00",
    "daftar_foto_url": [
      "/media/gedung-sate-1.jpg",
      "/media/gedung-sate-2.jpg"
    ],
    "kategori_wisata": "sejarah",
    "estimasi_durasi_kunjungan": 90,
    "harga_tiket_masuk": 5000,
    "wilayah": {
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_wilayah": "Kota Bandung",
      "provinsi": "Jawa Barat"
    },
    "fasilitas": [
      {
        "fasilitas_id": "fa1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000001",
        "jenis": "ATM",
        "is_gratis": true,
        "fasilitas_tersedia": [
          "ATM BCA",
          "ATM Mandiri",
          "Area parkir"
        ]
      },
      {
        "fasilitas_id": "fa1000000-0000-4000-8000-000000000002",
        "place_id": "b1000000-0000-4000-8000-000000000001",
        "jenis": "TOILET_UMUM",
        "is_gratis": true,
        "fasilitas_tersedia": [
          "Toilet pria",
          "Toilet wanita",
          "Mushola"
        ]
      }
    ]
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Destinasi tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Destinasi tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Nama tempat wisata sudah ada di wilayah ini atau kode destinasi duplikat. | `{   "error": {     "code": "CONFLICT",     "message": "Nama tempat wisata sudah ada di wilayah ini atau kode destinasi duplikat."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### PUT /admin/places/{id}

Memperbarui data tempat kunjungan dan detail destinasi, termasuk harga tiket dan durasi kunjungan.

- Peran: **Admin**
- Sukses: **200** Destinasi berhasil diperbarui.
- Kebutuhan: KF-06, KF-07

**Contoh respons positif**

```json
{
  "data": {
    "place_id": "b1000000-0000-4000-8000-000000000001",
    "wilayah_id": "a1000000-0000-4000-8000-000000000001",
    "nama_tempat": "Gedung Sate",
    "alamat_lengkap": "Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan",
    "latitude": -6.902484,
    "longitude": 107.618765,
    "rating_rata_rata": 4.7,
    "jumlah_review": 3210,
    "jam_buka": "08:00",
    "jam_tutup": "16:00",
    "daftar_foto_url": [
      "/media/gedung-sate-1.jpg",
      "/media/gedung-sate-2.jpg"
    ],
    "kategori_wisata": "sejarah",
    "estimasi_durasi_kunjungan": 90,
    "harga_tiket_masuk": 7500,
    "wilayah": {
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_wilayah": "Kota Bandung",
      "provinsi": "Jawa Barat"
    },
    "fasilitas": [
      {
        "fasilitas_id": "fa1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000001",
        "jenis": "ATM",
        "is_gratis": true,
        "fasilitas_tersedia": [
          "ATM BCA",
          "ATM Mandiri",
          "Area parkir"
        ]
      },
      {
        "fasilitas_id": "fa1000000-0000-4000-8000-000000000002",
        "place_id": "b1000000-0000-4000-8000-000000000001",
        "jenis": "TOILET_UMUM",
        "is_gratis": true,
        "fasilitas_tersedia": [
          "Toilet pria",
          "Toilet wanita",
          "Mushola"
        ]
      }
    ]
  },
  "message": "Destinasi berhasil diperbarui."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Destinasi atau wilayah tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Destinasi atau wilayah tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `PLACE_ALREADY_EXISTS` | Nama dan alamat destinasi sudah dipakai. | `{   "error": {     "code": "PLACE_ALREADY_EXISTS",     "message": "Nama dan alamat destinasi sudah dipakai."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Data destinasi belum lengkap atau koordinat tidak valid. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data destinasi belum lengkap atau koordinat tidak valid.",     "details": [       {         "field": "email",         "message": "Format email belum benar."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |

### DELETE /admin/places/{id}

Menghapus destinasi yang tidak lagi dipakai. Destinasi yang masih menjadi perhentian itinerary aktif tidak dapat dihapus.

- Peran: **Admin**
- Sukses: **204** Destinasi berhasil dihapus. Tidak ada isi respons.
- Kebutuhan: KF-06, KF-07

**Contoh respons positif**

Tidak ada isi respons. Server hanya mengembalikan kode 204.

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Destinasi tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Destinasi tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `PLACE_IN_USE` | Destinasi masih dipakai pada itinerary atau memiliki data terkait. | `{   "error": {     "code": "PLACE_IN_USE",     "message": "Destinasi masih dipakai pada itinerary atau memiliki data terkait."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### GET /admin/places/{id}/facilities

Menampilkan fasilitas utilitas pada satu destinasi. Kontrak memakai fasilitas_id karena satu tempat dapat memiliki beberapa fasilitas.

- Peran: **Admin**
- Sukses: **200** Daftar fasilitas berhasil diambil.
- Kebutuhan: KF-07

**Contoh respons positif**

```json
{
  "data": [
    {
      "fasilitas_id": "fa1000000-0000-4000-8000-000000000001",
      "place_id": "b1000000-0000-4000-8000-000000000001",
      "jenis": "ATM",
      "is_gratis": true,
      "fasilitas_tersedia": [
        "ATM BCA",
        "ATM Mandiri",
        "Area parkir"
      ]
    },
    {
      "fasilitas_id": "fa1000000-0000-4000-8000-000000000002",
      "place_id": "b1000000-0000-4000-8000-000000000001",
      "jenis": "TOILET_UMUM",
      "is_gratis": true,
      "fasilitas_tersedia": [
        "Toilet pria",
        "Toilet wanita",
        "Mushola"
      ]
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Destinasi tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Destinasi tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Nama tempat wisata sudah ada di wilayah ini atau kode destinasi duplikat. | `{   "error": {     "code": "CONFLICT",     "message": "Nama tempat wisata sudah ada di wilayah ini atau kode destinasi duplikat."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### POST /admin/places/{id}/facilities

Menambahkan fasilitas baru pada destinasi. Endpoint ini memerlukan kolom fasilitas_id pada tabel fasilitas_utilitas.

- Peran: **Admin**
- Sukses: **201** Fasilitas berhasil ditambahkan.
- Kebutuhan: KF-07

**Contoh respons positif**

```json
{
  "data": {
    "fasilitas_id": "fa1000000-0000-4000-8000-000000000099",
    "place_id": "b1000000-0000-4000-8000-000000000001",
    "jenis": "SPBU",
    "is_gratis": false,
    "fasilitas_tersedia": [
      "SPBU 24 jam",
      "Minimarket"
    ]
  },
  "message": "Fasilitas berhasil ditambahkan."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Destinasi tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Destinasi tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `FACILITY_ALREADY_EXISTS` | Fasilitas dengan jenis yang sama sudah ada. | `{   "error": {     "code": "FACILITY_ALREADY_EXISTS",     "message": "Fasilitas dengan jenis yang sama sudah ada."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Data fasilitas belum lengkap atau jenis tidak valid. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data fasilitas belum lengkap atau jenis tidak valid.",     "details": [       {         "field": "jenis",         "message": "Jenis fasilitas harus salah satu nilai yang tersedia."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |

### PUT /admin/places/{id}/facilities/{facilityId}

Memperbarui jenis, status gratis, atau daftar fasilitas yang tersedia.

- Peran: **Admin**
- Sukses: **200** Fasilitas berhasil diperbarui.
- Kebutuhan: KF-07

**Contoh respons positif**

```json
{
  "data": {
    "fasilitas_id": "fa1000000-0000-4000-8000-000000000001",
    "place_id": "b1000000-0000-4000-8000-000000000001",
    "jenis": "ATM",
    "is_gratis": false,
    "fasilitas_tersedia": [
      "ATM BCA",
      "ATM Mandiri",
      "Area parkir"
    ]
  },
  "message": "Fasilitas berhasil diperbarui."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Destinasi atau fasilitas tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Destinasi atau fasilitas tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Nama tempat wisata sudah ada di wilayah ini atau kode destinasi duplikat. | `{   "error": {     "code": "CONFLICT",     "message": "Nama tempat wisata sudah ada di wilayah ini atau kode destinasi duplikat."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Data fasilitas belum lengkap atau jenis tidak valid. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data fasilitas belum lengkap atau jenis tidak valid.",     "details": [       {         "field": "email",         "message": "Format email belum benar."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |

### DELETE /admin/places/{id}/facilities/{facilityId}

Menghapus satu fasilitas dari destinasi tanpa menghapus destinasi induk.

- Peran: **Admin**
- Sukses: **204** Fasilitas berhasil dihapus. Tidak ada isi respons.
- Kebutuhan: KF-07

**Contoh respons positif**

Tidak ada isi respons. Server hanya mengembalikan kode 204.

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Destinasi atau fasilitas tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Destinasi atau fasilitas tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Nama tempat wisata sudah ada di wilayah ini atau kode destinasi duplikat. | `{   "error": {     "code": "CONFLICT",     "message": "Nama tempat wisata sudah ada di wilayah ini atau kode destinasi duplikat."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### GET /admin/transport-modes

Menampilkan seluruh moda transportasi, termasuk yang tidak aktif, untuk pengelolaan data transportasi.

- Peran: **Admin**
- Sukses: **200** Daftar moda transportasi berhasil diambil.
- Kebutuhan: KF-13, KF-14, KF-20

**Contoh respons positif**

```json
{
  "data": [
    {
      "transportasi_id": "f1000000-0000-4000-8000-000000000001",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f12",
      "nama_moda": "Trans Metro Bandung Koridor 3",
      "jenis_transportasi": "BUS",
      "kapasitas_penumpang": 60,
      "status_aktif": true,
      "sumber_data": "GTFS Feed",
      "terakhir_diperbarui": "2026-10-30 06:00:00",
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "mitra": {
        "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f12",
        "nama_perusahaan": "CV Cimahi Trans"
      },
      "detail": {
        "nomor_trayek": "Koridor 3",
        "rute_halte": [
          "Halte Gasibu",
          "Halte Alun-Alun",
          "Halte Cicaheum",
          "Halte Riung Bandung"
        ],
        "tarif_tetap": 4900,
        "interval_menit": 15
      }
    },
    {
      "transportasi_id": "f1000000-0000-4000-8000-000000000002",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "mitra_id": null,
      "nama_moda": "Angkot Kalapa Dago 02",
      "jenis_transportasi": "ANGKOT",
      "kapasitas_penumpang": 14,
      "status_aktif": true,
      "sumber_data": "Dishub Bandung",
      "terakhir_diperbarui": "2026-10-29 18:20:00",
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "mitra": null,
      "detail": {
        "nomor_trayek": "02",
        "rute_halte": [
          "Halte Savoy Homann",
          "Halte Braga",
          "Halte Dago",
          "Halte Kalapa"
        ],
        "tarif_tetap": 8000,
        "interval_menit": 10
      }
    },
    {
      "transportasi_id": "f1000000-0000-4000-8000-000000000003",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
      "nama_moda": "GoCar Bandung",
      "jenis_transportasi": "ONLINE_TAXI",
      "kapasitas_penumpang": 4,
      "status_aktif": true,
      "sumber_data": "Mitra Portal",
      "terakhir_diperbarui": "2026-10-30 14:05:00",
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "mitra": {
        "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
        "nama_perusahaan": "PT Bandung Jaya Tour"
      },
      "detail": {
        "tarif_dasar": 10000,
        "tarif_per_km": 4500,
        "surge_multiplier": 1.2
      }
    },
    {
      "transportasi_id": "f1000000-0000-4000-8000-000000000004",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f12",
      "nama_moda": "GrabBike Bandung",
      "jenis_transportasi": "ONLINE_MOTOR",
      "kapasitas_penumpang": 1,
      "status_aktif": true,
      "sumber_data": "Mitra Portal",
      "terakhir_diperbarui": "2026-10-30 13:50:00",
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "mitra": {
        "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f12",
        "nama_perusahaan": "CV Cimahi Trans"
      },
      "detail": {
        "tarif_dasar": 8000,
        "tarif_per_km": 2500,
        "surge_multiplier": 1
      }
    },
    {
      "transportasi_id": "f1000000-0000-4000-8000-000000000005",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
      "nama_moda": "Sewa Avanza Bandung Jaya",
      "jenis_transportasi": "RENTAL",
      "kapasitas_penumpang": 7,
      "status_aktif": true,
      "sumber_data": "Mitra Portal",
      "terakhir_diperbarui": "2026-10-28 09:15:00",
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "mitra": {
        "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
        "nama_perusahaan": "PT Bandung Jaya Tour"
      },
      "detail": {
        "tarif_per_hari": 450000,
        "termasuk_driver": true,
        "jenis_bahan_bakar": "Bensin"
      }
    },
    {
      "transportasi_id": "f1000000-0000-4000-8000-000000000006",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "mitra_id": null,
      "nama_moda": "Trotoar Dago Heritage",
      "jenis_transportasi": "PEDESTRIAN",
      "kapasitas_penumpang": 1,
      "status_aktif": true,
      "sumber_data": "OpenStreetMap",
      "terakhir_diperbarui": "2026-10-20 08:00:00",
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "mitra": null,
      "detail": {
        "kecepatan_rata_rata_km_jam": 4.5,
        "is_jalur_pedestrian_tersedia": true
      }
    },
    {
      "transportasi_id": "f1000000-0000-4000-8000-000000000007",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f13",
      "nama_moda": "Tourist Shuttle Bandung",
      "jenis_transportasi": "SHUTTLE",
      "kapasitas_penumpang": 20,
      "status_aktif": false,
      "sumber_data": "Mitra Portal",
      "terakhir_diperbarui": "2026-10-26 11:30:00",
      "wilayah": {
        "wilayah_id": "a1000000-0000-4000-8000-000000000001",
        "nama_wilayah": "Kota Bandung",
        "provinsi": "Jawa Barat"
      },
      "mitra": {
        "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f13",
        "nama_perusahaan": "Bandung Eco Ride"
      },
      "detail": {
        "nomor_trayek": "Shuttle 04",
        "rute_halte": [
          "Savoy Homann",
          "Gedung Sate",
          "Saung Angklung Udjo",
          "Dago"
        ],
        "tarif_tetap": 15000,
        "interval_menit": 30
      }
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 7,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 400 | `BAD_REQUEST` | Filter moda transportasi tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Filter moda transportasi tidak valid."   },   "request_id": "req_demo_0002" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0003" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas). | `{   "error": {     "code": "CONFLICT",     "message": "Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas)."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### POST /admin/transport-modes

Menambahkan moda transportasi baru dan rincian tarifnya. Admin dapat menetapkan mitra pemilik armada.

- Peran: **Admin**
- Sukses: **201** Moda transportasi berhasil ditambahkan.
- Kebutuhan: KF-13, KF-17

**Contoh respons positif**

```json
{
  "data": {
    "transportasi_id": "f1000000-0000-4000-8000-000000000099",
    "wilayah_id": "a1000000-0000-4000-8000-000000000001",
    "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
    "nama_moda": "GoCar Bandung Baru",
    "jenis_transportasi": "ONLINE_TAXI",
    "kapasitas_penumpang": 4,
    "status_aktif": true,
    "sumber_data": "Mitra Portal",
    "terakhir_diperbarui": "2026-10-30 14:05:00",
    "wilayah": {
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_wilayah": "Kota Bandung",
      "provinsi": "Jawa Barat"
    },
    "mitra": {
      "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
      "nama_perusahaan": "PT Bandung Jaya Tour"
    },
    "detail": {
      "tarif_dasar": 10000,
      "tarif_per_km": 4500,
      "surge_multiplier": 1.2
    }
  },
  "message": "Moda transportasi berhasil ditambahkan."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Wilayah atau mitra tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Wilayah atau mitra tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `TRANSPORT_ALREADY_EXISTS` | Nama moda sudah dipakai. | `{   "error": {     "code": "TRANSPORT_ALREADY_EXISTS",     "message": "Nama moda sudah dipakai."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Data moda transportasi belum lengkap atau tarif tidak valid. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data moda transportasi belum lengkap atau tarif tidak valid.",     "details": [       {         "field": "email",         "message": "Format email belum benar."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |

### PUT /admin/transport-modes/{id}

Memperbarui data moda, kapasitas, status aktif, dan rincian tarif.

- Peran: **Admin**
- Sukses: **200** Moda transportasi berhasil diperbarui.
- Kebutuhan: KF-15, KF-17

**Contoh respons positif**

```json
{
  "data": {
    "transportasi_id": "f1000000-0000-4000-8000-000000000003",
    "wilayah_id": "a1000000-0000-4000-8000-000000000001",
    "mitra_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
    "nama_moda": "GoCar Bandung",
    "jenis_transportasi": "ONLINE_TAXI",
    "kapasitas_penumpang": 6,
    "status_aktif": true,
    "sumber_data": "Mitra Portal",
    "terakhir_diperbarui": "2026-10-30 14:05:00",
    "wilayah": {
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_wilayah": "Kota Bandung",
      "provinsi": "Jawa Barat"
    },
    "mitra": {
      "user_id": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
      "nama_perusahaan": "PT Bandung Jaya Tour"
    },
    "detail": {
      "tarif_dasar": 10000,
      "tarif_per_km": 4500,
      "surge_multiplier": 1.2
    }
  },
  "message": "Moda transportasi berhasil diperbarui."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Moda transportasi, wilayah, atau mitra tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Moda transportasi, wilayah, atau mitra tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `TRANSPORT_IN_USE` | Moda transportasi sedang dipakai pada itinerary aktif. | `{   "error": {     "code": "TRANSPORT_IN_USE",     "message": "Moda transportasi sedang dipakai pada itinerary aktif."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Data moda transportasi belum lengkap atau tarif tidak valid. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data moda transportasi belum lengkap atau tarif tidak valid.",     "details": [       {         "field": "email",         "message": "Format email belum benar."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |

### DELETE /admin/transport-modes/{id}

Menghapus moda transportasi yang tidak lagi dipakai. Moda yang masih dipakai pada segmen perjalanan tidak dapat dihapus.

- Peran: **Admin**
- Sukses: **204** Moda transportasi berhasil dihapus. Tidak ada isi respons.
- Kebutuhan: KF-16, KF-17

**Contoh respons positif**

Tidak ada isi respons. Server hanya mengembalikan kode 204.

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Moda transportasi tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Moda transportasi tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `TRANSPORT_IN_USE` | Moda transportasi masih dipakai pada itinerary atau segmen perjalanan. | `{   "error": {     "code": "TRANSPORT_IN_USE",     "message": "Moda transportasi masih dipakai pada itinerary atau segmen perjalanan."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### GET /admin/context

Menampilkan data cuaca dan lalu lintas yang tersimpan untuk setiap wilayah.

- Peran: **Admin**
- Sukses: **200** Daftar konteks lingkungan berhasil diambil.
- Kebutuhan: KF-30

**Contoh respons positif**

```json
{
  "data": [
    {
      "context_id": "a2000000-0000-4000-8000-000000000001",
      "wilayah_id": "a1000000-0000-4000-8000-000000000001",
      "nama_wilayah": "Kota Bandung",
      "kondisi_cuaca": "Hujan Ringan",
      "suhu_celsius": 24.5,
      "tingkat_curah_hujan": 8.4,
      "kondisi_lalu_lintas": "Padat",
      "ada_insiden_kecelakaan": false,
      "rata_rata_kepadatan_jalan": 0.72,
      "terakhir_diperbarui": "2026-10-30 14:10:00"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 1,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 400 | `BAD_REQUEST` | Filter konteks tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Filter konteks tidak valid."   },   "request_id": "req_demo_0002" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0003" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0004" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0005" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0006" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan penyedia data cuaca (BMKG / Weather Service) sedang mengalami gangguan atau batas kuota habis. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan penyedia data cuaca (BMKG / Weather Service) sedang mengalami gangguan atau batas kuota habis."   },   "request_id": "req_demo_0007" }` |

### POST /admin/context

Menambahkan data konteks cuaca dan lalu lintas untuk satu wilayah. Data ini dipakai pada perhitungan rekomendasi berikutnya.

- Peran: **Admin**
- Sukses: **201** Konteks lingkungan berhasil ditambahkan.
- Kebutuhan: KF-30

**Contoh respons positif**

```json
{
  "data": {
    "context_id": "a2000000-0000-4000-8000-000000000099",
    "wilayah_id": "a1000000-0000-4000-8000-000000000001",
    "nama_wilayah": "Kota Bandung",
    "kondisi_cuaca": "Cerah Berawan",
    "suhu_celsius": 24.5,
    "tingkat_curah_hujan": 0,
    "kondisi_lalu_lintas": "Padat",
    "ada_insiden_kecelakaan": false,
    "rata_rata_kepadatan_jalan": 0.72,
    "terakhir_diperbarui": "2026-10-30 14:10:00"
  },
  "message": "Konteks lingkungan berhasil ditambahkan."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Wilayah tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Wilayah tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas). | `{   "error": {     "code": "CONFLICT",     "message": "Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas)."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Data konteks belum lengkap atau nilai di luar rentang. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data konteks belum lengkap atau nilai di luar rentang.",     "details": [       {         "field": "rata_rata_kepadatan_jalan",         "message": "Nilai harus antara 0 sampai 1."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan penyedia data cuaca (BMKG / Weather Service) sedang mengalami gangguan atau batas kuota habis. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan penyedia data cuaca (BMKG / Weather Service) sedang mengalami gangguan atau batas kuota habis."   },   "request_id": "req_demo_0009" }` |

### PUT /admin/context/{id}

Memperbarui data cuaca, lalu lintas, atau insiden pada satu konteks lingkungan.

- Peran: **Admin**
- Sukses: **200** Konteks lingkungan berhasil diperbarui.
- Kebutuhan: KF-30

**Contoh respons positif**

```json
{
  "data": {
    "context_id": "a2000000-0000-4000-8000-000000000001",
    "wilayah_id": "a1000000-0000-4000-8000-000000000001",
    "nama_wilayah": "Kota Bandung",
    "kondisi_cuaca": "Hujan Ringan",
    "suhu_celsius": 24.5,
    "tingkat_curah_hujan": 8.4,
    "kondisi_lalu_lintas": "Lancar",
    "ada_insiden_kecelakaan": false,
    "rata_rata_kepadatan_jalan": 0.42,
    "terakhir_diperbarui": "2026-10-30 14:10:00"
  },
  "message": "Konteks lingkungan berhasil diperbarui."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Konteks lingkungan atau wilayah tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Konteks lingkungan atau wilayah tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas). | `{   "error": {     "code": "CONFLICT",     "message": "Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas)."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Data konteks belum lengkap atau nilai di luar rentang. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data konteks belum lengkap atau nilai di luar rentang.",     "details": [       {         "field": "email",         "message": "Format email belum benar."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan penyedia data cuaca (BMKG / Weather Service) sedang mengalami gangguan atau batas kuota habis. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan penyedia data cuaca (BMKG / Weather Service) sedang mengalami gangguan atau batas kuota habis."   },   "request_id": "req_demo_0009" }` |

### DELETE /admin/context/{id}

Menghapus data konteks yang tidak lagi dipakai. Konteks yang masih dirujuk rekomendasi tidak dapat dihapus.

- Peran: **Admin**
- Sukses: **204** Konteks lingkungan berhasil dihapus. Tidak ada isi respons.
- Kebutuhan: KF-30

**Contoh respons positif**

Tidak ada isi respons. Server hanya mengembalikan kode 204.

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Konteks lingkungan tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Konteks lingkungan tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONTEXT_IN_USE` | Konteks lingkungan masih dirujuk oleh rekomendasi yang tersimpan. | `{   "error": {     "code": "CONTEXT_IN_USE",     "message": "Konteks lingkungan masih dirujuk oleh rekomendasi yang tersimpan."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Layanan penyedia data cuaca (BMKG / Weather Service) sedang mengalami gangguan atau batas kuota habis. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Layanan penyedia data cuaca (BMKG / Weather Service) sedang mengalami gangguan atau batas kuota habis."   },   "request_id": "req_demo_0008" }` |

### GET /admin/itineraries

Menampilkan itinerary seluruh wisatawan dengan filter status, pemilik, dan kata kunci.

- Peran: **Admin**
- Sukses: **200** Daftar itinerary berhasil diambil.
- Kebutuhan: KF-10

**Contoh respons positif**

```json
{
  "data": [
    {
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "wisatawan_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01",
      "start_place_id": "b1000000-0000-4000-8000-000000000011",
      "judul_perjalanan": "Bandung Heritage & Kuliner Weekend",
      "tanggal_mulai": "2026-11-14",
      "tanggal_selesai": "2026-11-15",
      "jumlah_wisatawan": 2,
      "total_anggaran": 1500000,
      "status_rencana": "aktif",
      "jumlah_destinasi": 3,
      "total_estimasi_biaya": 28000,
      "preferensi": {
        "preferensi_id": 1,
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "prioritas_utama": "kenyamanan",
        "hindari_jalan_kaki_jauh": true,
        "maksimal_transit": 2,
        "preferensi_biaya": "standar"
      }
    },
    {
      "itinerary_id": "c1000000-0000-4000-8000-000000000002",
      "wisatawan_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01",
      "start_place_id": "b1000000-0000-4000-8000-000000000011",
      "judul_perjalanan": "Lembang Highland Escape",
      "tanggal_mulai": "2026-11-22",
      "tanggal_selesai": "2026-11-23",
      "jumlah_wisatawan": 4,
      "total_anggaran": 2000000,
      "status_rencana": "draft",
      "jumlah_destinasi": 3,
      "total_estimasi_biaya": 95000,
      "preferensi": {
        "preferensi_id": 2,
        "itinerary_id": "c1000000-0000-4000-8000-000000000002",
        "prioritas_utama": "kecepatan",
        "hindari_jalan_kaki_jauh": false,
        "maksimal_transit": 1,
        "preferensi_biaya": "premium"
      }
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 400 | `BAD_REQUEST` | Filter itinerary tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Filter itinerary tidak valid."   },   "request_id": "req_demo_0002" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0003" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama. | `{   "error": {     "code": "CONFLICT",     "message": "Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### GET /admin/itineraries/{id}

Menampilkan detail itinerary beserta preferensi, perhentian, dan rekomendasi teratas.

- Peran: **Admin**
- Sukses: **200** Detail itinerary berhasil diambil.
- Kebutuhan: KF-10, KF-28

**Contoh respons positif**

```json
{
  "data": {
    "itinerary_id": "c1000000-0000-4000-8000-000000000001",
    "wisatawan_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01",
    "start_place_id": "b1000000-0000-4000-8000-000000000011",
    "judul_perjalanan": "Bandung Heritage & Kuliner Weekend",
    "tanggal_mulai": "2026-11-14",
    "tanggal_selesai": "2026-11-15",
    "jumlah_wisatawan": 2,
    "total_anggaran": 1500000,
    "status_rencana": "aktif",
    "jumlah_destinasi": 3,
    "total_estimasi_biaya": 28000,
    "preferensi": {
      "preferensi_id": 1,
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "prioritas_utama": "kenyamanan",
      "hindari_jalan_kaki_jauh": true,
      "maksimal_transit": 2,
      "preferensi_biaya": "standar"
    },
    "destinasi": [
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000001",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000001",
        "urutan": 1,
        "waktu_mulai_rencana": "2026-11-14 09:00:00",
        "waktu_selesai_rencana": "2026-11-14 11:00:00",
        "total_jarak_segment_km": 2.4,
        "total_durasi_segment_menit": 15,
        "total_biaya_segment": 8000,
        "is_manual_selected": false,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000001",
          "nama_tempat": "Gedung Sate",
          "kategori_wisata": "sejarah",
          "latitude": -6.902484,
          "longitude": 107.618765,
          "alamat_lengkap": "Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000001",
            "plan_item_id": "d1000000-0000-4000-8000-000000000001",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 600 m dari Hotel Savoy Homann ke Halte Savoy.",
            "jarak_leg_km": 0.6,
            "estimasi_durasi_menit": 7,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000002",
            "plan_item_id": "d1000000-0000-4000-8000-000000000001",
            "transportasi_id": "f1000000-0000-4000-8000-000000000002",
            "urutan_leg": 2,
            "instruksi_rute": "Naik Angkot 02 dan turun di depan Gedung Sate.",
            "jarak_leg_km": 1.8,
            "estimasi_durasi_menit": 8,
            "biaya_leg": 8000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000002",
              "nama_moda": "Angkot Kalapa Dago 02",
              "jenis_transportasi": "ANGKOT"
            }
          }
        ]
      },
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000002",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000002",
        "urutan": 2,
        "waktu_mulai_rencana": "2026-11-14 12:30:00",
        "waktu_selesai_rencana": "2026-11-14 14:00:00",
        "total_jarak_segment_km": 3.1,
        "total_durasi_segment_menit": 18,
        "total_biaya_segment": 12000,
        "is_manual_selected": false,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000002",
          "nama_tempat": "Braga Heritage Walk",
          "kategori_wisata": "budaya",
          "latitude": -6.917464,
          "longitude": 107.60981,
          "alamat_lengkap": "Jl. Braga, Kec. Sumur Bandung"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000003",
            "plan_item_id": "d1000000-0000-4000-8000-000000000002",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 400 m menyusuri Jl. Diponegoro ke titik jemput.",
            "jarak_leg_km": 0.4,
            "estimasi_durasi_menit": 6,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000004",
            "plan_item_id": "d1000000-0000-4000-8000-000000000002",
            "transportasi_id": "f1000000-0000-4000-8000-000000000003",
            "urutan_leg": 2,
            "instruksi_rute": "GoCar dari Gedung Sate ke Braga Heritage Walk.",
            "jarak_leg_km": 2.7,
            "estimasi_durasi_menit": 12,
            "biaya_leg": 12000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000003",
              "nama_moda": "GoCar Bandung",
              "jenis_transportasi": "ONLINE_TAXI"
            }
          }
        ]
      },
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000003",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000003",
        "urutan": 3,
        "waktu_mulai_rencana": "2026-11-14 15:30:00",
        "waktu_selesai_rencana": "2026-11-14 17:00:00",
        "total_jarak_segment_km": 4.2,
        "total_durasi_segment_menit": 22,
        "total_biaya_segment": 8000,
        "is_manual_selected": true,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000003",
          "nama_tempat": "Saung Angklung Udjo",
          "kategori_wisata": "budaya",
          "latitude": -6.89753,
          "longitude": 107.63551,
          "alamat_lengkap": "Jl. Padasukah No.118, Cibeunying Kidul"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000005",
            "plan_item_id": "d1000000-0000-4000-8000-000000000003",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 500 m ke Halte Alun-Alun.",
            "jarak_leg_km": 0.5,
            "estimasi_durasi_menit": 6,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000006",
            "plan_item_id": "d1000000-0000-4000-8000-000000000003",
            "transportasi_id": "f1000000-0000-4000-8000-000000000007",
            "urutan_leg": 2,
            "instruksi_rute": "Tourist Shuttle 04 dari Halte Alun-Alun ke gerbang Saung Angklung Udjo.",
            "jarak_leg_km": 3.7,
            "estimasi_durasi_menit": 16,
            "biaya_leg": 8000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000007",
              "nama_moda": "Tourist Shuttle Bandung",
              "jenis_transportasi": "SHUTTLE"
            }
          }
        ]
      }
    ],
    "rekomendasi_teratas": {
      "recommendation_id": "91000000-0000-4000-8000-000000000001",
      "ranking": 1,
      "total_estimated_cost": 28000,
      "total_estimated_duration": 55,
      "suitability_score": 0.94
    }
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Itinerary tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Itinerary tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama. | `{   "error": {     "code": "CONFLICT",     "message": "Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### PUT /admin/itineraries/{id}

Memperbarui data utama itinerary dan status rencana. Perubahan memicu perhitungan ulang rekomendasi bila data perjalanan berubah.

- Peran: **Admin**
- Sukses: **200** Itinerary berhasil diperbarui oleh admin.
- Kebutuhan: KF-09, KF-28

**Contoh respons positif**

```json
{
  "data": {
    "itinerary_id": "c1000000-0000-4000-8000-000000000001",
    "wisatawan_id": "8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01",
    "start_place_id": "b1000000-0000-4000-8000-000000000011",
    "judul_perjalanan": "Bandung Heritage & Kuliner Weekend",
    "tanggal_mulai": "2026-11-14",
    "tanggal_selesai": "2026-11-15",
    "jumlah_wisatawan": 2,
    "total_anggaran": 1500000,
    "status_rencana": "selesai",
    "jumlah_destinasi": 3,
    "total_estimasi_biaya": 28000,
    "preferensi": {
      "preferensi_id": 1,
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "prioritas_utama": "kenyamanan",
      "hindari_jalan_kaki_jauh": true,
      "maksimal_transit": 2,
      "preferensi_biaya": "standar"
    },
    "destinasi": [
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000001",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000001",
        "urutan": 1,
        "waktu_mulai_rencana": "2026-11-14 09:00:00",
        "waktu_selesai_rencana": "2026-11-14 11:00:00",
        "total_jarak_segment_km": 2.4,
        "total_durasi_segment_menit": 15,
        "total_biaya_segment": 8000,
        "is_manual_selected": false,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000001",
          "nama_tempat": "Gedung Sate",
          "kategori_wisata": "sejarah",
          "latitude": -6.902484,
          "longitude": 107.618765,
          "alamat_lengkap": "Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000001",
            "plan_item_id": "d1000000-0000-4000-8000-000000000001",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 600 m dari Hotel Savoy Homann ke Halte Savoy.",
            "jarak_leg_km": 0.6,
            "estimasi_durasi_menit": 7,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000002",
            "plan_item_id": "d1000000-0000-4000-8000-000000000001",
            "transportasi_id": "f1000000-0000-4000-8000-000000000002",
            "urutan_leg": 2,
            "instruksi_rute": "Naik Angkot 02 dan turun di depan Gedung Sate.",
            "jarak_leg_km": 1.8,
            "estimasi_durasi_menit": 8,
            "biaya_leg": 8000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000002",
              "nama_moda": "Angkot Kalapa Dago 02",
              "jenis_transportasi": "ANGKOT"
            }
          }
        ]
      },
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000002",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000002",
        "urutan": 2,
        "waktu_mulai_rencana": "2026-11-14 12:30:00",
        "waktu_selesai_rencana": "2026-11-14 14:00:00",
        "total_jarak_segment_km": 3.1,
        "total_durasi_segment_menit": 18,
        "total_biaya_segment": 12000,
        "is_manual_selected": false,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000002",
          "nama_tempat": "Braga Heritage Walk",
          "kategori_wisata": "budaya",
          "latitude": -6.917464,
          "longitude": 107.60981,
          "alamat_lengkap": "Jl. Braga, Kec. Sumur Bandung"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000003",
            "plan_item_id": "d1000000-0000-4000-8000-000000000002",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 400 m menyusuri Jl. Diponegoro ke titik jemput.",
            "jarak_leg_km": 0.4,
            "estimasi_durasi_menit": 6,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000004",
            "plan_item_id": "d1000000-0000-4000-8000-000000000002",
            "transportasi_id": "f1000000-0000-4000-8000-000000000003",
            "urutan_leg": 2,
            "instruksi_rute": "GoCar dari Gedung Sate ke Braga Heritage Walk.",
            "jarak_leg_km": 2.7,
            "estimasi_durasi_menit": 12,
            "biaya_leg": 12000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000003",
              "nama_moda": "GoCar Bandung",
              "jenis_transportasi": "ONLINE_TAXI"
            }
          }
        ]
      },
      {
        "plan_item_id": "d1000000-0000-4000-8000-000000000003",
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "place_id": "b1000000-0000-4000-8000-000000000003",
        "urutan": 3,
        "waktu_mulai_rencana": "2026-11-14 15:30:00",
        "waktu_selesai_rencana": "2026-11-14 17:00:00",
        "total_jarak_segment_km": 4.2,
        "total_durasi_segment_menit": 22,
        "total_biaya_segment": 8000,
        "is_manual_selected": true,
        "tempat": {
          "place_id": "b1000000-0000-4000-8000-000000000003",
          "nama_tempat": "Saung Angklung Udjo",
          "kategori_wisata": "budaya",
          "latitude": -6.89753,
          "longitude": 107.63551,
          "alamat_lengkap": "Jl. Padasukah No.118, Cibeunying Kidul"
        },
        "legs": [
          {
            "leg_id": "e1000000-0000-4000-8000-000000000005",
            "plan_item_id": "d1000000-0000-4000-8000-000000000003",
            "transportasi_id": "f1000000-0000-4000-8000-000000000006",
            "urutan_leg": 1,
            "instruksi_rute": "Jalan kaki 500 m ke Halte Alun-Alun.",
            "jarak_leg_km": 0.5,
            "estimasi_durasi_menit": 6,
            "biaya_leg": 0,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000006",
              "nama_moda": "Trotoar Dago Heritage",
              "jenis_transportasi": "PEDESTRIAN"
            }
          },
          {
            "leg_id": "e1000000-0000-4000-8000-000000000006",
            "plan_item_id": "d1000000-0000-4000-8000-000000000003",
            "transportasi_id": "f1000000-0000-4000-8000-000000000007",
            "urutan_leg": 2,
            "instruksi_rute": "Tourist Shuttle 04 dari Halte Alun-Alun ke gerbang Saung Angklung Udjo.",
            "jarak_leg_km": 3.7,
            "estimasi_durasi_menit": 16,
            "biaya_leg": 8000,
            "transportasi": {
              "transportasi_id": "f1000000-0000-4000-8000-000000000007",
              "nama_moda": "Tourist Shuttle Bandung",
              "jenis_transportasi": "SHUTTLE"
            }
          }
        ]
      }
    ],
    "rekomendasi_teratas": {
      "recommendation_id": "91000000-0000-4000-8000-000000000001",
      "ranking": 1,
      "total_estimated_cost": 28000,
      "total_estimated_duration": 55,
      "suitability_score": 0.94
    }
  },
  "message": "Itinerary berhasil diperbarui oleh admin."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Itinerary tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Itinerary tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama. | `{   "error": {     "code": "CONFLICT",     "message": "Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Data itinerary belum lengkap atau status tidak valid. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Data itinerary belum lengkap atau status tidak valid.",     "details": [       {         "field": "email",         "message": "Format email belum benar."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |

### DELETE /admin/itineraries/{id}

Menghapus itinerary beserta seluruh data turunannya. Tindakan ini berlaku untuk semua status.

- Peran: **Admin**
- Sukses: **204** Itinerary berhasil dihapus. Tidak ada isi respons.
- Kebutuhan: KF-12

**Contoh respons positif**

Tidak ada isi respons. Server hanya mengembalikan kode 204.

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Itinerary tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Itinerary tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama. | `{   "error": {     "code": "CONFLICT",     "message": "Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### GET /admin/recommendations

Menampilkan rekomendasi seluruh itinerary untuk pemantauan kualitas dan audit hasil perhitungan.

- Peran: **Admin**
- Sukses: **200** Daftar rekomendasi berhasil diambil.
- Kebutuhan: KF-26, KF-27, KF-33

**Contoh respons positif**

```json
{
  "data": [
    {
      "recommendation_id": "91000000-0000-4000-8000-000000000001",
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "context_id": "a2000000-0000-4000-8000-000000000001",
      "ranking": 1,
      "total_estimated_cost": 28000,
      "total_estimated_duration": 55,
      "suitability_score": 0.94,
      "comfort_score": 0.89,
      "weather_impact_score": 0.92,
      "traffic_impact_score": 0.81,
      "catatan_konteks": "Rute ini memakai Angkot 02, TMB Koridor 3, dan shuttle tertutup. Hanya 1,5 km jalan kaki terbuka sehingga tetap aman saat hujan ringan.",
      "generated_at": "2026-10-30 14:12:00",
      "itinerary": {
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "judul_perjalanan": "Bandung Heritage & Kuliner Weekend"
      },
      "konteks": {
        "context_id": "a2000000-0000-4000-8000-000000000001",
        "kondisi_cuaca": "Hujan Ringan",
        "kondisi_lalu_lintas": "Padat",
        "tingkat_curah_hujan": 8.4
      }
    },
    {
      "recommendation_id": "91000000-0000-4000-8000-000000000002",
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "context_id": "a2000000-0000-4000-8000-000000000001",
      "ranking": 2,
      "total_estimated_cost": 122000,
      "total_estimated_duration": 47,
      "suitability_score": 0.86,
      "comfort_score": 0.94,
      "weather_impact_score": 0.84,
      "traffic_impact_score": 0.62,
      "catatan_konteks": "Taksi online memberi waktu tempuh lebih singkat dan terlindung dari hujan, tetapi biaya naik dan rawan tertahan kemacetan Jl. Asia Afrika.",
      "generated_at": "2026-10-30 14:12:00",
      "itinerary": {
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "judul_perjalanan": "Bandung Heritage & Kuliner Weekend"
      },
      "konteks": {
        "context_id": "a2000000-0000-4000-8000-000000000001",
        "kondisi_cuaca": "Hujan Ringan",
        "kondisi_lalu_lintas": "Padat",
        "tingkat_curah_hujan": 8.4
      }
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 400 | `BAD_REQUEST` | Filter rekomendasi tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Filter rekomendasi tidak valid."   },   "request_id": "req_demo_0002" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0003" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0004" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0005" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0006" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Mesin rekomendasi mobilitas (Mobility ML Recommendation Engine) sedang offline atau membutuhkan waktu respons lebih lama. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Mesin rekomendasi mobilitas (Mobility ML Recommendation Engine) sedang offline atau membutuhkan waktu respons lebih lama."   },   "request_id": "req_demo_0007" }` |

### GET /admin/recommendations/{id}

Menampilkan rincian skor dan penjelasan konteks satu rekomendasi untuk keperluan audit.

- Peran: **Admin**
- Sukses: **200** Detail rekomendasi berhasil diambil.
- Kebutuhan: KF-27, KF-31, KF-33

**Contoh respons positif**

```json
{
  "data": {
    "recommendation_id": "91000000-0000-4000-8000-000000000001",
    "itinerary_id": "c1000000-0000-4000-8000-000000000001",
    "context_id": "a2000000-0000-4000-8000-000000000001",
    "ranking": 1,
    "total_estimated_cost": 28000,
    "total_estimated_duration": 55,
    "suitability_score": 0.94,
    "comfort_score": 0.89,
    "weather_impact_score": 0.92,
    "traffic_impact_score": 0.81,
    "catatan_konteks": "Rute ini memakai Angkot 02, TMB Koridor 3, dan shuttle tertutup. Hanya 1,5 km jalan kaki terbuka sehingga tetap aman saat hujan ringan.",
    "generated_at": "2026-10-30 14:12:00",
    "itinerary": {
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "judul_perjalanan": "Bandung Heritage & Kuliner Weekend"
    },
    "konteks": {
      "context_id": "a2000000-0000-4000-8000-000000000001",
      "kondisi_cuaca": "Hujan Ringan",
      "kondisi_lalu_lintas": "Padat",
      "tingkat_curah_hujan": 8.4
    }
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Rekomendasi tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Rekomendasi tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0005" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0006" }` |
| 503 | `UPSTREAM_UNAVAILABLE` | Mesin rekomendasi mobilitas (Mobility ML Recommendation Engine) sedang offline atau membutuhkan waktu respons lebih lama. | `{   "error": {     "code": "UPSTREAM_UNAVAILABLE",     "message": "Mesin rekomendasi mobilitas (Mobility ML Recommendation Engine) sedang offline atau membutuhkan waktu respons lebih lama."   },   "request_id": "req_demo_0007" }` |

### GET /admin/notifications

Menampilkan notifikasi perjalanan dari seluruh wisatawan untuk pemantauan kendala.

- Peran: **Admin**
- Sukses: **200** Daftar notifikasi berhasil diambil.
- Kebutuhan: KF-29

**Contoh respons positif**

```json
{
  "data": [
    {
      "notifikasi_id": "a3000000-0000-4000-8000-000000000001",
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "judul_peringatan": "Hujan lebat di sektor Dago",
      "pesan_kendala": "Curah hujan terpantau 14,5 mm per jam. Leg jalan kaki menuju Saung Angklung Udjo dialihkan ke shuttle tertutup.",
      "jenis_pemicu": "cuaca_hujan",
      "tingkat_urgensi": "peringatan",
      "waktu_dibuat": "2026-10-30 14:20:00",
      "is_dibaca": false,
      "itinerary": {
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "judul_perjalanan": "Bandung Heritage & Kuliner Weekend"
      }
    },
    {
      "notifikasi_id": "a3000000-0000-4000-8000-000000000002",
      "itinerary_id": "c1000000-0000-4000-8000-000000000001",
      "judul_peringatan": "Kepadatan meningkat di Jl. Asia Afrika",
      "pesan_kendala": "Kepadatan jalan tercatat 0,72. Perjalanan dengan taksi berpotensi terlambat 8 sampai 12 menit.",
      "jenis_pemicu": "lalu_lintas",
      "tingkat_urgensi": "info",
      "waktu_dibuat": "2026-10-30 13:45:00",
      "is_dibaca": true,
      "itinerary": {
        "itinerary_id": "c1000000-0000-4000-8000-000000000001",
        "judul_perjalanan": "Bandung Heritage & Kuliner Weekend"
      }
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 400 | `BAD_REQUEST` | Filter notifikasi tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Filter notifikasi tidak valid."   },   "request_id": "req_demo_0002" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0003" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0004" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0005" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0006" }` |

### GET /admin/reviews

Menampilkan seluruh ulasan, termasuk yang belum dipublikasikan, untuk proses moderasi.

- Peran: **Admin**
- Sukses: **200** Daftar ulasan berhasil diambil.
- Kebutuhan: KF-06

**Contoh respons positif**

```json
{
  "data": [
    {
      "ulasan_id": "a4000000-0000-4000-8000-000000000001",
      "place_id": "b1000000-0000-4000-8000-000000000001",
      "nama_penulis": "Rina Kartika",
      "skor_rating": 5,
      "isi_komentar": "Bangunan ikonik dengan taman yang tertata. Tur museum informatif dan petugas ramah.",
      "waktu_ulasan": "2026-10-28 10:15:00",
      "status_publikasi": true
    },
    {
      "ulasan_id": "a4000000-0000-4000-8000-000000000002",
      "place_id": "b1000000-0000-4000-8000-000000000001",
      "nama_penulis": "Dimas Prakoso",
      "skor_rating": 4,
      "isi_komentar": "Antrean tiket cukup panjang saat akhir pekan. Datang pagi agar lebih nyaman.",
      "waktu_ulasan": "2026-10-26 09:40:00",
      "status_publikasi": true
    },
    {
      "ulasan_id": "a4000000-0000-4000-8000-000000000008",
      "place_id": "b1000000-0000-4000-8000-000000000009",
      "nama_penulis": "Pengunjung Anonim",
      "skor_rating": 2,
      "isi_komentar": "Parkir sulit dan area cukup ramai. Konten ulasan menunggu pemeriksaan moderator.",
      "waktu_ulasan": "2026-10-29 18:40:00",
      "status_publikasi": false
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 3,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 400 | `BAD_REQUEST` | Filter ulasan tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Filter ulasan tidak valid."   },   "request_id": "req_demo_0002" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0003" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Anda sudah mengirimkan ulasan untuk destinasi ini pada periode kunjungan yang sama. | `{   "error": {     "code": "CONFLICT",     "message": "Anda sudah mengirimkan ulasan untuk destinasi ini pada periode kunjungan yang sama."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### PATCH /admin/reviews/{id}

Mengubah status publikasi ulasan. Bila disetujui, ulasan langsung tampil pada endpoint publik.

- Peran: **Admin**
- Sukses: **200** Status publikasi ulasan berhasil diperbarui.
- Kebutuhan: KF-06

**Contoh respons positif**

```json
{
  "data": {
    "ulasan_id": "a4000000-0000-4000-8000-000000000008",
    "place_id": "b1000000-0000-4000-8000-000000000009",
    "nama_penulis": "Pengunjung Anonim",
    "skor_rating": 2,
    "isi_komentar": "Parkir sulit dan area cukup ramai. Konten ulasan menunggu pemeriksaan moderator.",
    "waktu_ulasan": "2026-10-29 18:40:00",
    "status_publikasi": true
  },
  "message": "Ulasan berhasil dipublikasikan."
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Ulasan tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Ulasan tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Anda sudah mengirimkan ulasan untuk destinasi ini pada periode kunjungan yang sama. | `{   "error": {     "code": "CONFLICT",     "message": "Anda sudah mengirimkan ulasan untuk destinasi ini pada periode kunjungan yang sama."   },   "request_id": "req_demo_0005" }` |
| 422 | `VALIDATION_ERROR` | Status publikasi wajib berupa boolean. | `{   "error": {     "code": "VALIDATION_ERROR",     "message": "Status publikasi wajib berupa boolean.",     "details": [       {         "field": "email",         "message": "Format email belum benar."       }     ]   },   "request_id": "req_demo_0006" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0007" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0008" }` |

### DELETE /admin/reviews/{id}

Menghapus ulasan yang melanggar aturan. Tindakan ini tidak dapat dibatalkan.

- Peran: **Admin**
- Sukses: **204** Ulasan berhasil dihapus. Tidak ada isi respons.
- Kebutuhan: KF-06

**Contoh respons positif**

Tidak ada isi respons. Server hanya mengembalikan kode 204.

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0002" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0003" }` |
| 404 | `NOT_FOUND` | Ulasan tidak ditemukan. | `{   "error": {     "code": "NOT_FOUND",     "message": "Ulasan tidak ditemukan."   },   "request_id": "req_demo_0004" }` |
| 409 | `CONFLICT` | Anda sudah mengirimkan ulasan untuk destinasi ini pada periode kunjungan yang sama. | `{   "error": {     "code": "CONFLICT",     "message": "Anda sudah mengirimkan ulasan untuk destinasi ini pada periode kunjungan yang sama."   },   "request_id": "req_demo_0005" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0006" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0007" }` |

### GET /admin/audit-logs

Menampilkan seluruh aktivitas perubahan data dari admin, mitra, dan layanan otomatis.

- Peran: **Admin**
- Sukses: **200** Jejak audit berhasil diambil.
- Kebutuhan: KF-19, KF-33

**Contoh respons positif**

```json
{
  "data": [
    {
      "log_id": "a5000000-0000-4000-8000-000000000001",
      "entitas_terdampak": "transportasi",
      "id_referensi": "f1000000-0000-4000-8000-000000000003",
      "aksi": "UPDATE",
      "detail_perubahan": {
        "tarif_per_km": {
          "before": 4000,
          "after": 4500
        },
        "surge_multiplier": {
          "before": 1.1,
          "after": 1.2
        }
      },
      "aktor_pelaksana": "Dewi Lestari",
      "waktu_log": "2026-10-30 14:05:00"
    },
    {
      "log_id": "a5000000-0000-4000-8000-000000000002",
      "entitas_terdampak": "mitra_transportasi",
      "id_referensi": "9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11",
      "aksi": "UPDATE",
      "detail_perubahan": {
        "status_verifikasi": {
          "before": false,
          "after": true
        },
        "verified_by_admin_id": {
          "before": null,
          "after": "7d3c9b1a-4e2f-4c83-b015-3c4d5e6f7a21"
        }
      },
      "aktor_pelaksana": "Tantan Nugraha",
      "waktu_log": "2026-10-27 09:12:00"
    },
    {
      "log_id": "a5000000-0000-4000-8000-000000000003",
      "entitas_terdampak": "ulasan_tempat",
      "id_referensi": "a4000000-0000-4000-8000-000000000008",
      "aksi": "UPDATE",
      "detail_perubahan": {
        "status_publikasi": {
          "before": true,
          "after": false
        },
        "alasan": "Menunggu pemeriksaan moderator"
      },
      "aktor_pelaksana": "Johannes Putra",
      "waktu_log": "2026-10-29 19:02:00"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 3,
    "total_pages": 1
  }
}
```

**Kasus negatif**

| Status | Kode | Pesan | Contoh respons |
| ---: | --- | --- | --- |
| 400 | `BAD_REQUEST` | Parameter permintaan tidak dapat diproses atau format data tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Parameter permintaan tidak dapat diproses atau format data tidak valid."   },   "request_id": "req_demo_0001" }` |
| 400 | `BAD_REQUEST` | Filter audit tidak valid. | `{   "error": {     "code": "BAD_REQUEST",     "message": "Filter audit tidak valid."   },   "request_id": "req_demo_0002" }` |
| 401 | `UNAUTHENTICATED` | Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim. | `{   "error": {     "code": "UNAUTHENTICATED",     "message": "Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim."   },   "request_id": "req_demo_0003" }` |
| 403 | `FORBIDDEN_ROLE` | Peran aktif tidak memiliki izin untuk mengakses sumber daya ini. | `{   "error": {     "code": "FORBIDDEN_ROLE",     "message": "Peran aktif tidak memiliki izin untuk mengakses sumber daya ini."   },   "request_id": "req_demo_0004" }` |
| 429 | `RATE_LIMITED` | Terlalu banyak permintaan. Coba lagi beberapa saat lagi. | `{   "error": {     "code": "RATE_LIMITED",     "message": "Terlalu banyak permintaan. Coba lagi beberapa saat lagi."   },   "request_id": "req_demo_0005" }` |
| 500 | `INTERNAL_ERROR` | Terjadi kesalahan pada server saat memproses permintaan. | `{   "error": {     "code": "INTERNAL_ERROR",     "message": "Terjadi kesalahan pada server saat memproses permintaan."   },   "request_id": "req_demo_0006" }` |

