# Traceability Kebutuhan

Dokumen ini menghubungkan kebutuhan fungsional KF-01 sampai KF-33 dan kebutuhan nonfungsional KNF pada `MAIN-REQUIREMENTS.md` dengan endpoint pada kontrak. Tujuannya agar penguji dapat memeriksa cakupan tanpa menelusuri seluruh kontrak.

## Ringkasan cakupan

| Butir | Jumlah |
| --- | --- |
| Kebutuhan fungsional | 33 |
| Kebutuhan fungsional yang memiliki endpoint | 33 |
| Kebutuhan fungsional terpenuhi penuh | 29 |
| Kebutuhan fungsional terpenuhi sebagian | 4 |
| Kebutuhan nonfungsional yang dapat dipetakan | 3 |
| Endpoint usulan perluasan | 1 |

Kebutuhan yang terpenuhi sebagian adalah KF-26, KF-29, KF-32, dan KF-33. Alasannya dijelaskan pada tabel di bawah dan pada bagian catatan.

## Kebutuhan fungsional

| Kode | Kebutuhan | Endpoint utama | Status |
| --- | --- | --- | --- |
| KF-01 | Autentikasi pengguna | `POST /auth/login`, `POST /auth/logout` | Terpenuhi |
| KF-02 | Otorisasi sesuai peran | `POST /auth/login`, `GET /admin/users`, `PUT /admin/users/{id}`, `DELETE /admin/users/{id}` | Terpenuhi |
| KF-03 | Registrasi pengguna | `POST /auth/register` | Terpenuhi |
| KF-04 | Perubahan data pengguna | `PUT /user/profile`, `PUT /user/password`, `DELETE /user/account`, `PUT /admin/users/{id}` | Terpenuhi |
| KF-05 | Menampilkan data pengguna | `GET /user/profile`, `GET /admin/users`, `GET /admin/users/{id}`, `GET /admin/dashboard` | Terpenuhi |
| KF-06 | Destinasi populer | `GET /destinations`, `GET /destinations/popular`, `GET /destinations/{id}` | Terpenuhi |
| KF-07 | Peta lokasi destinasi | `GET /destinations`, `GET /destinations/{id}`, `GET /regions/{id}` | Terpenuhi |
| KF-08 | Menerima input rencana perjalanan | `POST /itineraries` | Terpenuhi |
| KF-09 | Perubahan rencana perjalanan | `PUT /itineraries/{id}`, `PUT /itineraries/{id}/stops`, `PUT /admin/itineraries/{id}` | Terpenuhi |
| KF-10 | Menampilkan rencana perjalanan | `GET /itineraries`, `GET /itineraries/{id}`, `GET /admin/itineraries` | Terpenuhi |
| KF-11 | Visualisasi rencana pada peta | `GET /itineraries/{id}/route-geometry`, `GET /itineraries/{id}` | Terpenuhi |
| KF-12 | Menghapus rencana perjalanan | `DELETE /itineraries/{id}`, `DELETE /admin/itineraries/{id}` | Terpenuhi |
| KF-13 | Menambah moda dan penyedia transportasi | `POST /partner/fleets`, `POST /admin/transport-modes` | Terpenuhi |
| KF-14 | Menampilkan ketersediaan transportasi | `GET /transport-modes`, `GET /partner/fleets`, `GET /admin/transport-modes` | Terpenuhi |
| KF-15 | Mengubah informasi transportasi | `PUT /partner/fleets/{id}`, `PUT /admin/transport-modes/{id}` | Terpenuhi |
| KF-16 | Menghapus data transportasi | `DELETE /partner/fleets/{id}`, `DELETE /admin/transport-modes/{id}` | Terpenuhi |
| KF-17 | Menyimpan data ketersediaan transportasi | `POST /partner/fleets`, `POST /admin/transport-modes` | Terpenuhi |
| KF-18 | Mencatat sumber dan waktu pembaruan | `POST /partner/fleets`, `PUT /partner/fleets/{id}`, `POST /admin/transport-modes` | Terpenuhi |
| KF-19 | Menampilkan sumber dan waktu pembaruan | `GET /transport-modes`, `GET /transport-modes/{id}`, `GET /partner/audit-logs`, `GET /admin/audit-logs` | Terpenuhi |
| KF-20 | Moda untuk setiap rencana perjalanan | `GET /itineraries/{id}/available-modes`, `GET /transport-modes` | Terpenuhi |
| KF-21 | Filter moda sesuai preferensi | `GET /itineraries/{id}/available-modes` | Terpenuhi |
| KF-22 | Menyusun alternatif strategi mobilitas | `GET /itineraries/{id}/strategies/compare` | Terpenuhi |
| KF-23 | Membandingkan total waktu tempuh | `GET /itineraries/{id}/strategies/compare` | Terpenuhi |
| KF-24 | Membandingkan total jarak tempuh | `GET /itineraries/{id}/strategies/compare` | Terpenuhi |
| KF-25 | Membandingkan total biaya | `GET /itineraries/{id}/strategies/compare` | Terpenuhi |
| KF-26 | Rekomendasi berbasis faktor eksternal | `POST /itineraries/{id}/recommendations/calculate`, `GET /itineraries/{id}/recommendations`, `GET /recommendations/{id}`, `GET /context/environment` | Terpenuhi sebagian |
| KF-27 | Ringkasan faktor yang memengaruhi rekomendasi | `GET /recommendations/{id}`, `GET /itineraries/{id}/recommendations`, `GET /itineraries/{id}/strategies/compare` | Terpenuhi |
| KF-28 | Perhitungan ulang saat rencana berubah | `POST /itineraries`, `PUT /itineraries/{id}`, `PUT /itineraries/{id}/stops`, `POST /itineraries/{id}/recommendations/calculate` | Terpenuhi |
| KF-29 | Peringatan perubahan kondisi perjalanan | `GET /itineraries/{id}/alerts`, `GET /itineraries/{id}/alerts/stream`, `GET /notifications`, `PATCH /notifications/{id}/read` | Terpenuhi sebagian |
| KF-30 | Informasi cuaca | `GET /context/weather`, `GET /context/environment`, `GET /admin/context` | Terpenuhi |
| KF-31 | Alasan pemberian rekomendasi | `GET /recommendations/{id}`, `POST /itineraries/{id}/recommendations/calculate`, `GET /admin/recommendations/{id}` | Terpenuhi |
| KF-32 | Tingkat keandalan data transportasi | `GET /transport-modes/{id}`, `GET /recommendations/{id}` | Terpenuhi sebagian |
| KF-33 | Riwayat rekomendasi | `GET /user/recommendation-history`, `GET /admin/recommendations`, `POST /recommendations/{id}/feedback` | Terpenuhi sebagian |

## Kebutuhan nonfungsional

| Kode | Kebutuhan | Dukungan pada kontrak | Status |
| --- | --- | --- | --- |
| KNF-01 | Rekomendasi selesai kurang dari 5 detik | Tidak dapat dibuktikan dari kontrak. Perlu uji beban pada implementasi | Di luar cakupan kontrak |
| KNF-02 | Ketersediaan 99,9 persen | `GET /health` untuk pemantauan | Terpenuhi sebagian |
| KNF-03 | Keamanan data pengguna | Bearer token, pembatasan peran, kepemilikan data, `DELETE /user/account` | Terpenuhi |
| KNF-04 | Tampilan responsif | Diuji pada halaman simulasi dan dokumentasi, bukan pada kontrak API | Di luar cakupan kontrak |
| KNF-05 | Skalabilitas | Penomoran halaman, filter, dan pemisahan endpoint admin | Terpenuhi sebagian |
| KNF-06 | Tetap berjalan saat layanan pihak ketiga terganggu | `503 UPSTREAM_UNAVAILABLE` pada cuaca dan mesin rekomendasi | Terpenuhi |

KNF-01, KNF-04, dan KNF-05 tidak dapat dibuktikan hanya dari bentuk kontrak. Ketiganya memerlukan pengujian implementasi, misalnya uji beban, uji aksesibilitas, dan uji pertumbuhan data.

## Pemetaan dokumen DFD

| Dokumen | Cakupan | Kelompok endpoint |
| --- | --- | --- |
| DFD-01 | Pengelolaan akun pengguna | Autentikasi dan Akun, Admin |
| DFD-02 | Pengelolaan itinerary | Itinerary, Admin |
| DFD-03 | Visualisasi peta interaktif | Destinasi dan Ulasan, Itinerary |
| DFD-04 | Mesin rekomendasi mobilitas | Rekomendasi dan Riwayat |
| DFD-05 | Analisis strategi mobilitas | Rekomendasi dan Riwayat |
| DFD-06 | Integrasi cuaca | Wilayah dan Konteks |
| DFD-07 | Eksplorasi moda transportasi | Transportasi |
| DFD-08 | Pemantauan kondisi mobilitas | Notifikasi, Wilayah dan Konteks |
| DFD-09 | Data transportasi dan mitra | Mitra, Admin |
| DFD-10 | Riwayat rekomendasi | Rekomendasi dan Riwayat |

## Catatan kebutuhan yang terpenuhi sebagian

### KF-26 Rekomendasi berbasis faktor eksternal

Kontrak menetapkan bentuk permintaan perhitungan ulang, masukan konteks cuaca dan lalu lintas, serta bentuk hasil rekomendasi. Kontrak tidak memuat algoritma, bobot, atau model pembelajaran mesin karena hal tersebut berada pada implementasi backend.

Yang perlu dipastikan pada implementasi:

- Perhitungan memakai `context_environment` terbaru.
- Hasil menyimpan seluruh skor, yaitu `suitability_score`, `comfort_score`, `weather_impact_score`, dan `traffic_impact_score`.
- Perhitungan ulang mengganti rekomendasi lama atau menandainya tidak berlaku, bukan menambah baris tanpa batas.
- Waktu proses dijaga di bawah lima detik sesuai KNF-01.

### KF-29 Peringatan perubahan kondisi

Kontrak menyediakan daftar peringatan, penandaan sudah dibaca, dan aliran Server-Sent Events. Aliran event tidak dapat dijalankan penuh dari Swagger UI karena koneksi harus dibiarkan terbuka. Pengujian aliran event memerlukan klien HTTP yang mendukung `text/event-stream`.

Yang perlu dipastikan pada implementasi:

- Peringatan dibuat otomatis saat harga, jadwal, ketersediaan, cuaca, atau keterlambatan berubah.
- Setiap peringatan memiliki `tingkat_urgensi` yang sesuai.
- Koneksi aliran event ditutup dengan rapi saat klien memutuskan.
- Ada batas jumlah koneksi per pengguna.

### KF-32 Tingkat keandalan data transportasi

Kontrak menampilkan `sumber_data` dan `terakhir_diperbarui` pada setiap moda, serta skor dampak cuaca dan lalu lintas pada rekomendasi. Kontrak belum memiliki field khusus berupa skor keandalan data.

Bila skor tersebut diperlukan, tambahkan field berikut pada `TransportMode` dan `Recommendation`:

| Usulan field | Tipe | Arti |
| --- | --- | --- |
| `skor_keandalan_data` | number 0 sampai 1 | Tingkat kepercayaan terhadap data moda |
| `umur_data_menit` | integer | Selisih waktu pembaruan terhadap waktu permintaan |
| `status_keandalan` | string | `tinggi`, `sedang`, atau `rendah` |

Penambahan ini bersifat opsional dan tidak merusak kontrak yang sudah ada.

### KF-33 Riwayat rekomendasi

Riwayat rekomendasi sudah tersedia melalui `GET /user/recommendation-history` dan `GET /admin/recommendations`. Endpoint umpan balik `POST /recommendations/{id}/feedback` ditandai sebagai usulan perluasan karena tabel `recommendation_feedback` belum ada pada SQL.

Agar KF-33 terpenuhi penuh:

1. Terapkan tabel `recommendation_feedback` seperti pada dokumen pemetaan basis data.
2. Ubah status endpoint dari usulan menjadi bagian kontrak tetap.
3. Tambahkan pengujian untuk kode `FEEDBACK_ALREADY_EXISTS`.
4. Putuskan apakah umpan balik boleh diubah setelah dikirim.

## Kebutuhan yang tidak memiliki endpoint khusus

Beberapa kebutuhan dipenuhi melalui gabungan endpoint, bukan satu endpoint tunggal.

| Kebutuhan | Cara dipenuhi |
| --- | --- |
| KF-06 dan KF-07 | Daftar dan detail destinasi memuat koordinat, kategori, foto, dan wilayah |
| KF-11 | Detail itinerary memuat perhentian dan segmen, sedangkan `route-geometry` memuat bentuk peta |
| KF-18 dan KF-19 | Setiap moda memuat `sumber_data` dan `terakhir_diperbarui`, ditambah jejak audit perubahan |
| KF-22 sampai KF-25 | Satu endpoint perbandingan mengembalikan seluruh alternatif beserta biaya, durasi, dan jarak |
| KF-27 dan KF-31 | Detail rekomendasi memuat skor dan `catatan_konteks` sebagai alasan |
| KF-32 | Keterbaruan data ditampilkan melalui waktu pembaruan dan sumber data |

## Kebutuhan yang belum masuk kontrak

| Hal | Alasan | Tindakan bila diperlukan |
| --- | --- | --- |
| Lupa kata sandi dan atur ulang kata sandi | Tidak termasuk ruang lingkup versi ini | Tambahkan endpoint dan tabel `password_reset_tokens` |
| Unggah dokumen legalitas mitra | Kontrak memakai `legalitas_doc_url` | Tambahkan endpoint unggah berkas bila diperlukan |
| Pembayaran atau pemesanan tiket | Tidak termasuk ruang lingkup | Buat kontrak terpisah |
| Pelacakan posisi kendaraan secara langsung | Tidak termasuk ruang lingkup | Tambahkan aliran event atau polling tersendiri |
| Verifikasi email | Belum diminta pada dokumen kebutuhan | Tambahkan bila kebijakan keamanan mengharuskan |

## Cara memeriksa cakupan

1. Buka `openapi.json` dan cari nilai `x-kf` pada setiap operasi.
2. Bandingkan dengan tabel pada dokumen ini.
3. Jalankan `npm run validate` untuk memastikan kontrak tetap valid.
4. Untuk setiap KF, jalankan endpoint utama pada halaman simulasi dengan peran yang sesuai.
5. Catat hasil pengujian pada dokumen pengujian terpisah bila diperlukan.

Setiap operasi pada kontrak memuat `x-kf` berisi daftar kode kebutuhan. Nilai ini dapat dipakai untuk membuat laporan cakupan otomatis.
