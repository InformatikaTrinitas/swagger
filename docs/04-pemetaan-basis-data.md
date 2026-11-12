# Pemetaan Basis Data

Dokumen ini menghubungkan setiap resource pada kontrak API dengan tabel dan kolom pada `sql/db_ppl.sql`. Dokumen ini juga mencatat kolom turunan, perbedaan tipe data, dan usulan perubahan skema yang diperlukan agar kontrak dapat diterapkan.

## Ringkasan tabel ke resource

| Tabel | Resource API | Keterangan |
| --- | --- | --- |
| `user` | `User` | Data dasar seluruh pengguna |
| `wisatawan` | `User.profil` untuk peran `tourist` | Profil tambahan wisatawan |
| `mitra_transportasi` | `User.profil` untuk peran `partner`, `PartnerSummary` | Profil mitra dan status verifikasi |
| `admin` | `User.profil` untuk peran `admin` | Profil administrator |
| `wilayah` | `Region`, `RegionSummary` | Wilayah layanan dan batas geografis |
| `lokasi_kunjungan` | `PlaceSummary`, dasar `Destination` | Tempat kunjungan dan koordinat |
| `destinasi_wisata` | `Destination` | Detail destinasi, tiket, dan durasi |
| `fasilitas_utilitas` | `Facility` | Fasilitas pada tempat |
| `ulasan_tempat` | `Review` | Ulasan pengunjung dan status publikasi |
| `itinerary` | `ItinerarySummary`, dasar `ItineraryDetail` | Rencana perjalanan |
| `preferensi_wisata` | `Preferences` | Preferensi perjalanan pada itinerary |
| `plan_item` | `Stop` | Perhentian berurutan pada itinerary |
| `leg_perjalanan` | `Leg` | Segmen perjalanan pada perhentian |
| `recommendation` | `Recommendation`, `RecommendationSummary`, `RecommendationHistoryItem` | Hasil perhitungan rekomendasi |
| `notifikasi_perjalanan` | `Notification` | Peringatan perjalanan |
| `context_environment` | `EnvironmentContext`, dasar `Weather` | Cuaca dan lalu lintas per wilayah |
| `data_log` | `AuditLog`, `Dashboard.aktivitas_terbaru` | Jejak perubahan data |
| `transportasi` | `TransportMode`, `TransportSummary` | Moda transportasi |
| `transport_umum` | `TransportDetail` | Rincian bus, angkot, dan shuttle |
| `transport_online` | `TransportDetail` | Rincian taksi dan ojek online |
| `rental_kendaraan` | `TransportDetail` | Rincian sewa kendaraan |
| `jalan_kaki` | `TransportDetail` | Rincian jalur pejalan kaki |
| `map_service_adapter` | Tidak diekspos | Konfigurasi adaptor peta, hanya dipakai internal |
| `weather_service_adapter` | Tidak diekspos | Konfigurasi adaptor cuaca, hanya dipakai internal |

Tabel `map_service_adapter` dan `weather_service_adapter` sengaja tidak memiliki endpoint. Keduanya berisi konfigurasi teknis, bukan data yang ditampilkan kepada pengguna.

## Pemetaan per resource

### User dan profil peran

`User` dibentuk dari `user` yang digabung dengan salah satu tabel profil sesuai nilai `user.role`.

| Field API | Sumber | Catatan |
| --- | --- | --- |
| `user_id` | `user.user_id` | UUID 36 karakter |
| `nama` | `user.nama` | |
| `email` | `user.email` | Unik melalui `uq_user_email` |
| `nomor_telepon` | `user.nomor_telepon` | Boleh `null` |
| `role` | `user.role` | Kontrak membatasi pada `tourist`, `partner`, `admin` |
| `profil.preferensi_umum` | `wisatawan.preferensi_umum` | Hanya untuk wisatawan |
| `profil.jumlah_itinerary` | Turunan dari `itinerary` | Lihat bagian kolom turunan |
| `profil.jumlah_notifikasi_belum_dibaca` | Turunan dari `notifikasi_perjalanan` | Lihat bagian kolom turunan |
| `profil.nama_perusahaan` | `mitra_transportasi.nama_perusahaan` | Hanya untuk mitra |
| `profil.legalitas_doc_url` | `mitra_transportasi.legalitas_doc_url` | Hanya untuk mitra |
| `profil.status_verifikasi` | `mitra_transportasi.status_verifikasi` | `0` atau `1` menjadi boolean |
| `profil.verified_by_admin_id` | `mitra_transportasi.verified_by_admin_id` | Boleh `null` |
| `profil.jumlah_armada` | Turunan dari `transportasi` | Hanya untuk mitra |
| `profil.admin_level` | `admin.admin_level` | Hanya untuk admin |
| `profil.departemen` | `admin.departemen` | Hanya untuk admin |
| `profil.terakhir_aktif` | `admin.terakhir_aktif` | Hanya untuk admin |

Field `user.password_hash` tidak pernah dikirim pada respons. Nilainya hanya dipakai saat login dan perubahan kata sandi.

### Region

| Field API | Sumber | Catatan |
| --- | --- | --- |
| `wilayah_id` | `wilayah.wilayah_id` | |
| `nama_wilayah` | `wilayah.nama_wilayah` | |
| `provinsi` | `wilayah.provinsi` | |
| `boundary_coordinates` | `wilayah.boundary_coordinates` | Teks berisi JSON, diubah menjadi array |
| `status_cakupan_aktif` | `wilayah.status_cakupan_aktif` | Boolean |
| `jumlah_destinasi` | Turunan dari `lokasi_kunjungan` | Lihat bagian kolom turunan |

`RegionSummary` hanya memuat `wilayah_id`, `nama_wilayah`, dan `provinsi`.

### Destination, PlaceSummary, dan Facility

`PlaceSummary` berasal dari `lokasi_kunjungan`. `Destination` menambahkan kolom dari `destinasi_wisata` dan daftar fasilitas.

| Field API | Sumber | Catatan |
| --- | --- | --- |
| `place_id` | `lokasi_kunjungan.place_id` | |
| `wilayah_id` | `lokasi_kunjungan.wilayah_id` | Boleh `null` |
| `nama_tempat` | `lokasi_kunjungan.nama_tempat` | |
| `alamat_lengkap` | `lokasi_kunjungan.alamat_lengkap` | |
| `latitude` | `lokasi_kunjungan.latitude` | |
| `longitude` | `lokasi_kunjungan.longitude` | |
| `rating_rata_rata` | `lokasi_kunjungan.rating_rata_rata` | |
| `jumlah_review` | `lokasi_kunjungan.jumlah_review` | |
| `jam_buka` | `lokasi_kunjungan.jam_buka` | Teks `HH:MM` |
| `jam_tutup` | `lokasi_kunjungan.jam_tutup` | Teks `HH:MM`, `24:00` diperbolehkan |
| `daftar_foto_url` | `lokasi_kunjungan.daftar_foto_url` | Teks JSON, diubah menjadi array |
| `kategori_wisata` | `destinasi_wisata.kategori_wisata` | |
| `estimasi_durasi_kunjungan` | `destinasi_wisata.estimasi_durasi_kunjungan` | Satuan menit |
| `harga_tiket_masuk` | `destinasi_wisata.harga_tiket_masuk` | Rupiah |
| `wilayah` | Gabungan `wilayah` | Bentuk `RegionSummary` |
| `fasilitas` | Gabungan `fasilitas_utilitas` | Bentuk array `Facility` |

`Facility`:

| Field API | Sumber | Catatan |
| --- | --- | --- |
| `fasilitas_id` | Belum ada pada SQL | Diusulkan pada bagian perubahan skema |
| `place_id` | `fasilitas_utilitas.place_id` | |
| `jenis` | `fasilitas_utilitas.jenis` | Enum SQL, nilainya sama dengan enum kontrak |
| `is_gratis` | `fasilitas_utilitas.is_gratis` | Boolean |
| `fasilitas_tersedia` | `fasilitas_utilitas.fasilitas_tersedia` | Teks JSON, diubah menjadi array |

### Review

| Field API | Sumber | Catatan |
| --- | --- | --- |
| `ulasan_id` | `ulasan_tempat.ulasan_id` | |
| `place_id` | `ulasan_tempat.place_id` | |
| `nama_penulis` | `ulasan_tempat.nama_penulis` | |
| `skor_rating` | `ulasan_tempat.skor_rating` | Float, kontrak membatasi 1 sampai 5 |
| `isi_komentar` | `ulasan_tempat.isi_komentar` | |
| `waktu_ulasan` | `ulasan_tempat.waktu_ulasan` | |
| `status_publikasi` | `ulasan_tempat.status_publikasi` | Boolean |

### Itinerary, Preferences, Stop, dan Leg

`ItinerarySummary` berasal dari `itinerary`.

| Field API | Sumber | Catatan |
| --- | --- | --- |
| `itinerary_id` | `itinerary.itinerary_id` | |
| `wisatawan_id` | `itinerary.wisatawan_id` | |
| `start_place_id` | `itinerary.start_place_id` | Boleh `null` |
| `judul_perjalanan` | `itinerary.judul_perjalanan` | |
| `tanggal_mulai` | `itinerary.tanggal_mulai` | |
| `tanggal_selesai` | `itinerary.tanggal_selesai` | |
| `jumlah_wisatawan` | `itinerary.jumlah_wisatawan` | |
| `total_anggaran` | `itinerary.total_anggaran` | |
| `status_rencana` | `itinerary.status_rencana` | Enum kontrak: `draft`, `aktif`, `selesai`, `dibatalkan` |
| `jumlah_destinasi` | Turunan dari `plan_item` | |
| `total_estimasi_biaya` | Turunan dari `recommendation` | |
| `preferensi` | `preferensi_wisata` | Satu baris per itinerary melalui `uq_preferensi_itinerary` |

`Preferences`:

| Field API | Sumber |
| --- | --- |
| `preferensi_id` | `preferensi_wisata.preferensi_id` |
| `itinerary_id` | `preferensi_wisata.itinerary_id` |
| `prioritas_utama` | `preferensi_wisata.prioritas_utama` |
| `hindari_jalan_kaki_jauh` | `preferensi_wisata.hindari_jalan_kaki_jauh` |
| `maksimal_transit` | `preferensi_wisata.maksimal_transit` |
| `preferensi_biaya` | `preferensi_wisata.preferensi_biaya` |

`Stop` berasal dari `plan_item`, ditambah objek `tempat` dan `legs`:

| Field API | Sumber |
| --- | --- |
| `plan_item_id` | `plan_item.plan_item_id` |
| `itinerary_id` | `plan_item.itinerary_id` |
| `place_id` | `plan_item.place_id` |
| `urutan` | `plan_item.urutan` |
| `waktu_mulai_rencana` | `plan_item.waktu_mulai_rencana` |
| `waktu_selesai_rencana` | `plan_item.waktu_selesai_rencana` |
| `total_jarak_segment_km` | `plan_item.total_jarak_segment_km` |
| `total_durasi_segment_menit` | `plan_item.total_durasi_segment_menit` |
| `total_biaya_segment` | `plan_item.total_biaya_segment` |
| `is_manual_selected` | `plan_item.is_manual_selected` |
| `tempat` | Gabungan `lokasi_kunjungan` |
| `legs` | Gabungan `leg_perjalanan` dan `transportasi` |

`Leg`:

| Field API | Sumber |
| --- | --- |
| `leg_id` | `leg_perjalanan.leg_id` |
| `plan_item_id` | `leg_perjalanan.plan_item_id` |
| `transportasi_id` | `leg_perjalanan.transportasi_id` |
| `urutan_leg` | `leg_perjalanan.urutan_leg` |
| `instruksi_rute` | `leg_perjalanan.instruksi_rute` |
| `jarak_leg_km` | `leg_perjalanan.jarak_leg_km` |
| `estimasi_durasi_menit` | `leg_perjalanan.estimasi_durasi_menit` |
| `biaya_leg` | `leg_perjalanan.biaya_leg` |
| `transportasi` | Gabungan `transportasi` dalam bentuk `TransportSummary` |

`ItineraryDetail` menambahkan `destinasi` berisi array `Stop` yang diurutkan berdasarkan `urutan`, dan `rekomendasi_teratas` berisi ringkasan `recommendation` dengan `ranking` terkecil.

### Recommendation

| Field API | Sumber |
| --- | --- |
| `recommendation_id` | `recommendation.recommendation_id` |
| `itinerary_id` | `recommendation.itinerary_id` |
| `context_id` | `recommendation.context_id` |
| `ranking` | `recommendation.ranking` |
| `total_estimated_cost` | `recommendation.total_estimated_cost` |
| `total_estimated_duration` | `recommendation.total_estimated_duration` |
| `suitability_score` | `recommendation.suitability_score` |
| `comfort_score` | `recommendation.comfort_score` |
| `weather_impact_score` | `recommendation.weather_impact_score` |
| `traffic_impact_score` | `recommendation.traffic_impact_score` |
| `catatan_konteks` | `recommendation.catatan_konteks` |
| `generated_at` | `recommendation.generated_at` |
| `itinerary` | Gabungan `itinerary` |
| `konteks` | Gabungan `context_environment` |

`RecommendationHistoryItem` memakai kolom yang sama, ditambah `judul_perjalanan` dari `itinerary` dan `kondisi_cuaca` dari `context_environment`.

### Notification

| Field API | Sumber |
| --- | --- |
| `notifikasi_id` | `notifikasi_perjalanan.notifikasi_id` |
| `itinerary_id` | `notifikasi_perjalanan.itinerary_id` |
| `judul_peringatan` | `notifikasi_perjalanan.judul_peringatan` |
| `pesan_kendala` | `notifikasi_perjalanan.pesan_kendala` |
| `jenis_pemicu` | `notifikasi_perjalanan.jenis_pemicu` |
| `tingkat_urgensi` | `notifikasi_perjalanan.tingkat_urgensi` |
| `waktu_dibuat` | `notifikasi_perjalanan.waktu_dibuat` |
| `is_dibaca` | `notifikasi_perjalanan.is_dibaca` |
| `itinerary` | Gabungan `itinerary` |

Enum kontrak untuk `tingkat_urgensi` adalah `info`, `peringatan`, dan `kritis`. Kolom SQL bertipe `varchar(50)` sehingga nilai di luar enum masih dapat tersimpan bila tidak ada pemeriksaan di aplikasi.

### Weather dan EnvironmentContext

`Weather` memakai sebagian kolom `context_environment`, ditambah `nama_wilayah` dari `wilayah`.

| Field API | Sumber |
| --- | --- |
| `context_id` | `context_environment.context_id` |
| `wilayah_id` | `context_environment.wilayah_id` |
| `nama_wilayah` | Gabungan `wilayah.nama_wilayah` |
| `kondisi_cuaca` | `context_environment.kondisi_cuaca` |
| `suhu_celsius` | `context_environment.suhu_celsius` |
| `tingkat_curah_hujan` | `context_environment.tingkat_curah_hujan` |
| `terakhir_diperbarui` | `context_environment.terakhir_diperbarui` |
| `status_data` | Turunan dari selisih waktu pembaruan, `segar` atau `tertunda` |

`EnvironmentContext` memakai seluruh kolom `context_environment`. Nilai `status_data` tidak disimpan di basis data dan dihitung dari selisih `terakhir_diperbarui` terhadap waktu sekarang. Ambang yang disarankan adalah 30 menit; di atas ambang tersebut nilai menjadi `tertunda`.

### TransportMode dan TransportDetail

| Field API | Sumber |
| --- | --- |
| `transportasi_id` | `transportasi.transportasi_id` |
| `wilayah_id` | `transportasi.wilayah_id` |
| `mitra_id` | `transportasi.mitra_id` |
| `nama_moda` | `transportasi.nama_moda` |
| `jenis_transportasi` | `transportasi.jenis_transportasi` |
| `kapasitas_penumpang` | `transportasi.kapasitas_penumpang` |
| `status_aktif` | `transportasi.status_aktif` |
| `sumber_data` | `transportasi.sumber_data` |
| `terakhir_diperbarui` | `transportasi.terakhir_diperbarui` |
| `wilayah` | Gabungan `wilayah` |
| `mitra` | Gabungan `mitra_transportasi` |
| `detail` | Gabungan tabel rincian sesuai `jenis_transportasi` |

Pemilihan tabel rincian:

| `jenis_transportasi` | Tabel rincian |
| --- | --- |
| `BUS`, `ANGKOT`, `SHUTTLE` | `transport_umum` |
| `ONLINE_TAXI`, `ONLINE_MOTOR` | `transport_online` |
| `RENTAL` | `rental_kendaraan` |
| `PEDESTRIAN` | `jalan_kaki` |

Kolom `sumber_data` dan `terakhir_diperbarui` memenuhi KF-18 dan KF-19. Keduanya dikirim pada setiap moda sehingga aplikasi dapat menilai keterbaruan data.

### AuditLog

| Field API | Sumber |
| --- | --- |
| `log_id` | `data_log.log_id` |
| `entitas_terdampak` | `data_log.entitas_terdampak` |
| `id_referensi` | `data_log.id_referensi` |
| `aksi` | `data_log.aksi` |
| `detail_perubahan` | `data_log.detail_perubahan` |
| `aktor_pelaksana` | `data_log.aktor_pelaksana` |
| `waktu_log` | `data_log.waktu_log` |

`data_log` tidak memiliki foreign key. Tujuannya agar jejak audit tetap tersimpan setelah data sumber dihapus. Kolom `detail_perubahan` bertipe `text` dan pada praktiknya berisi JSON, sehingga kontrak mengirimnya sebagai objek.

## Kolom turunan

Kolom berikut tidak disimpan pada tabel sumber dan harus dihitung saat permintaan.

| Field API | Rumus yang disarankan |
| --- | --- |
| `Region.jumlah_destinasi` | `COUNT(lokasi_kunjungan)` dengan `wilayah_id` sama dan `place_id` ada pada `destinasi_wisata` |
| `User.profil.jumlah_itinerary` | `COUNT(itinerary)` dengan `wisatawan_id` sama |
| `User.profil.jumlah_notifikasi_belum_dibaca` | `COUNT(notifikasi_perjalanan)` melalui itinerary milik pengguna dengan `is_dibaca = 0` |
| `User.profil.jumlah_armada` | `COUNT(transportasi)` dengan `mitra_id` sama |
| `ItinerarySummary.jumlah_destinasi` | `COUNT(plan_item)` dengan `itinerary_id` sama |
| `ItinerarySummary.total_estimasi_biaya` | `recommendation.total_estimated_cost` dengan `ranking = 1`; bila belum ada, jumlah `plan_item.total_biaya_segment` |
| `ItineraryDetail.rekomendasi_teratas` | `recommendation` dengan `ranking` terkecil untuk itinerary tersebut |
| `Weather.status_data` | `segar` bila `terakhir_diperbarui` tidak lebih dari 30 menit lalu, selain itu `tertunda` |
| `Dashboard.pengguna` | Hitung baris `user` per `role` |
| `Dashboard.mitra` | Hitung `mitra_transportasi` dan status `status_verifikasi` |
| `Dashboard.wilayah` | Hitung `wilayah` dan `status_cakupan_aktif` |
| `Dashboard.destinasi` | Hitung `destinasi_wisata`, jumlah populer, dan rata-rata `rating_rata_rata` |
| `Dashboard.itinerary` | Hitung `itinerary` per `status_rencana` |
| `Dashboard.rekomendasi` | Hitung `recommendation`, termasuk yang `generated_at` pada hari berjalan |
| `Dashboard.notifikasi` | Hitung `notifikasi_perjalanan`, termasuk yang `is_dibaca = 0` |
| `Dashboard.aktivitas_terbaru` | `data_log` terbaru, biasanya dua sampai lima baris |
| `Dashboard.diperbarui_pada` | Waktu ringkasan dihitung |

Aturan `total_estimasi_biaya` perlu disepakati bersama tim backend. Kontrak memilih nilai rekomendasi peringkat satu karena angka tersebut sudah memperhitungkan seluruh segmen perjalanan.

## Field yang hanya ada pada API

Field berikut tidak berasal dari tabel mana pun:

| Field | Letak | Alasan |
| --- | --- | --- |
| `token`, `token_type`, `abilities` | `AuthSession` | Dibuat oleh lapisan autentikasi |
| `message` | Amplop respons | Pesan untuk pengguna |
| `meta` | Respons daftar | Informasi halaman |
| `error`, `request_id` | Amplop kesalahan | Kesalahan dan penelusuran log |
| `status_data` | `Weather` | Dihitung dari waktu pembaruan |
| `cocok_dengan_preferensi`, `alasan` | `AvailableMode` | Hasil filter preferensi |
| `catatan` | Beberapa respons | Penjelasan hasil proses |

## Perubahan skema yang diusulkan

Sebagian endpoint memerlukan penyesuaian skema. Usulan berikut bersifat tambahan dan tidak menghapus data yang sudah ada.

### 1. Kolom `fasilitas_id` pada `fasilitas_utilitas`

Masalah: tabel `fasilitas_utilitas` memakai `place_id` sebagai primary key. Akibatnya satu tempat hanya dapat memiliki satu fasilitas. Data contoh justru memuat dua fasilitas untuk tempat yang sama, misalnya ATM dan toilet pada Gedung Sate.

Kontrak memakai `fasilitas_id` agar setiap fasilitas dapat ditunjuk secara unik pada endpoint admin.

```sql
ALTER TABLE `fasilitas_utilitas`
  ADD COLUMN `fasilitas_id` varchar(36) NULL AFTER `place_id`,
  ADD KEY `idx_fasilitas_place` (`place_id`);

UPDATE `fasilitas_utilitas`
SET `fasilitas_id` = UUID()
WHERE `fasilitas_id` IS NULL;

ALTER TABLE `fasilitas_utilitas`
  MODIFY `fasilitas_id` varchar(36) NOT NULL,
  DROP PRIMARY KEY,
  ADD PRIMARY KEY (`fasilitas_id`),
  ADD UNIQUE KEY `uq_fasilitas_place_jenis` (`place_id`, `jenis`);
```

Catatan penerapan:

- Jalankan pada salinan basis data terlebih dahulu.
- Foreign key `fk_fasilitas_lokasi` tetap berlaku karena `place_id` kini memiliki indeks sendiri.
- Unique key `uq_fasilitas_place_jenis` mencegah jenis fasilitas yang sama muncul dua kali pada satu tempat. Kode `FACILITY_ALREADY_EXISTS` mengikuti aturan ini.
- Bila aplikasi Laravel memakai UUID, isi `fasilitas_id` dari aplikasi, bukan dari `UUID()` SQL, agar formatnya konsisten.

### 2. Tabel `recommendation_feedback`

Masalah: kontrak memiliki `POST /recommendations/{id}/feedback` untuk memenuhi KF-33, tetapi SQL belum memiliki tabel umpan balik. Endpoint ini ditandai sebagai usulan perluasan pada kontrak.

```sql
CREATE TABLE `recommendation_feedback` (
  `feedback_id` varchar(36) NOT NULL,
  `recommendation_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `status_penerimaan` enum('diterima','ditolak','netral') NOT NULL DEFAULT 'netral',
  `skor_kepuasan` tinyint(1) DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  `waktu_dibuat` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`feedback_id`),
  UNIQUE KEY `uq_feedback_recommendation_user` (`recommendation_id`,`user_id`),
  KEY `idx_feedback_user` (`user_id`),
  CONSTRAINT `fk_feedback_recommendation` FOREIGN KEY (`recommendation_id`)
    REFERENCES `recommendation` (`recommendation_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_feedback_user` FOREIGN KEY (`user_id`)
    REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `chk_feedback_skor` CHECK (`skor_kepuasan` IS NULL OR `skor_kepuasan` BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

Unique key `uq_feedback_recommendation_user` sesuai dengan kode `FEEDBACK_ALREADY_EXISTS`. Satu wisatawan hanya dapat mengirim satu umpan balik untuk satu rekomendasi. Bila umpan balik perlu diubah, gunakan `PUT` pada endpoint tersendiri, bukan menambah baris baru.

### 3. Tabel `personal_access_tokens`

Masalah: SQL belum memiliki tabel penyimpanan token. Login mengembalikan token Bearer, sehingga token perlu tempat penyimpanan yang aman dan dapat dicabut saat logout.

```sql
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index`
    (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

Catatan penerapan:

- `tokenable_id` dibuat `varchar(36)` karena `user.user_id` berupa UUID, bukan bilangan bulat.
- Pada Laravel, atur tipe kunci morph menjadi string agar Sanctum menulis UUID dengan benar.
- `abilities` menyimpan `role:tourist`, `role:partner`, atau `role:admin`.
- Logout menghapus baris token yang sedang dipakai.

### 4. Token atur ulang kata sandi

SQL juga belum memiliki tabel `password_reset_tokens`. Kontrak versi ini belum memuat endpoint lupa kata sandi, sehingga tabel tersebut belum diperlukan. Bila fitur tersebut ditambahkan, sediakan endpoint `POST /auth/forgot-password` dan `POST /auth/reset-password` beserta tabel `password_reset_tokens`.

### 5. Kolom JSON

Kolom berikut berisi JSON di dalam tipe `longtext` atau `text`. Kontrak mengirimnya sebagai array atau objek.

| Kolom | Tipe saat ini | Usulan |
| --- | --- | --- |
| `wilayah.boundary_coordinates` | `longtext` tanpa pemeriksaan | Ubah ke `JSON` atau tambahkan `CHECK (json_valid(...))` |
| `data_log.detail_perubahan` | `text` | Ubah ke `JSON` agar dapat dicari dan divalidasi |
| `fasilitas_utilitas.fasilitas_tersedia` | `longtext` dengan `json_valid` | Sudah baik, pertahankan |
| `lokasi_kunjungan.daftar_foto_url` | `longtext` dengan `json_valid` | Sudah baik, pertahankan |
| `transport_umum.rute_halte` | `longtext` dengan `json_valid` | Sudah baik, pertahankan |

### 6. Nilai enum pada kolom `varchar`

Beberapa kolom menyimpan nilai terbatas, tetapi bertipe `varchar`. Kontrak sudah menetapkan enum. Agar data sesuai, tambahkan pemeriksaan di aplikasi atau ubah kolom menjadi `enum`.

| Kolom | Nilai yang diizinkan kontrak |
| --- | --- |
| `user.role` | `tourist`, `partner`, `admin` |
| `itinerary.status_rencana` | `draft`, `aktif`, `selesai`, `dibatalkan` |
| `notifikasi_perjalanan.tingkat_urgensi` | `info`, `peringatan`, `kritis` |
| `transportasi.jenis_transportasi` | `BUS`, `ANGKOT`, `ONLINE_TAXI`, `ONLINE_MOTOR`, `RENTAL`, `PEDESTRIAN`, `SHUTTLE` |
| `data_log.aksi` | `CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `VERIFY` |
| `preferensi_wisata.prioritas_utama` | `kecepatan`, `biaya`, `kenyamanan` |
| `preferensi_wisata.preferensi_biaya` | `hemat`, `standar`, `premium` |

Mengubah kolom menjadi `enum` perlu kehati-hatian karena nilai lama di luar daftar akan gagal. Langkah yang lebih aman adalah memeriksa nilai lama terlebih dahulu:

```sql
SELECT DISTINCT `status_rencana` FROM `itinerary`;
SELECT DISTINCT `tingkat_urgensi` FROM `notifikasi_perjalanan`;
SELECT DISTINCT `jenis_transportasi` FROM `transportasi`;
```

### 7. Batas nilai dan pemeriksaan tambahan

| Aturan | Usulan |
| --- | --- |
| `jumlah_wisatawan` minimal 1 | `CHECK (jumlah_wisatawan >= 1)` |
| `total_anggaran` tidak negatif | `CHECK (total_anggaran >= 0)` |
| `harga_tiket_masuk` tidak negatif | `CHECK (harga_tiket_masuk >= 0)` |
| `skor_rating` antara 1 dan 5 | `CHECK (skor_rating BETWEEN 1 AND 5)` |
| `rata_rata_kepadatan_jalan` antara 0 dan 1 | `CHECK (rata_rata_kepadatan_jalan BETWEEN 0 AND 1)` |
| `maksimal_transit` antara 0 dan 5 | `CHECK (maksimal_transit BETWEEN 0 AND 5)` |
| `tanggal_selesai` tidak sebelum `tanggal_mulai` | Diperiksa di aplikasi karena melibatkan dua kolom |
| `waktu_selesai_rencana` setelah `waktu_mulai_rencana` | Diperiksa di aplikasi |

## Indeks yang disarankan

Indeks berikut membantu endpoint daftar dan pencarian yang paling sering dipakai.

```sql
CREATE INDEX `idx_itinerary_owner_status` ON `itinerary` (`wisatawan_id`, `status_rencana`);
CREATE UNIQUE INDEX `uq_plan_item_urutan` ON `plan_item` (`itinerary_id`, `urutan`);
CREATE UNIQUE INDEX `uq_leg_urutan` ON `leg_perjalanan` (`plan_item_id`, `urutan_leg`);
CREATE INDEX `idx_rekom_itinerary_ranking` ON `recommendation` (`itinerary_id`, `ranking`);
CREATE INDEX `idx_notif_itinerary_baca` ON `notifikasi_perjalanan` (`itinerary_id`, `is_dibaca`, `waktu_dibuat`);
CREATE INDEX `idx_ulasan_place_publikasi` ON `ulasan_tempat` (`place_id`, `status_publikasi`, `waktu_ulasan`);
CREATE INDEX `idx_context_wilayah_waktu` ON `context_environment` (`wilayah_id`, `terakhir_diperbarui`);
CREATE INDEX `idx_log_waktu` ON `data_log` (`waktu_log`);
CREATE INDEX `idx_transportasi_filter` ON `transportasi` (`wilayah_id`, `jenis_transportasi`, `status_aktif`);
CREATE INDEX `idx_lokasi_wilayah` ON `lokasi_kunjungan` (`wilayah_id`);
```

Indeks unik `uq_plan_item_urutan` dan `uq_leg_urutan` menjaga agar urutan perhentian dan segmen tidak kembar. Sebelum membuatnya, periksa data lama:

```sql
SELECT `itinerary_id`, `urutan`, COUNT(*) AS jumlah
FROM `plan_item`
GROUP BY `itinerary_id`, `urutan`
HAVING jumlah > 1;
```

## Aturan hapus dan cascade

Perilaku hapus pada SQL perlu dipahami karena memengaruhi kode kesalahan pada kontrak.

| Tindakan | Perilaku basis data | Respons kontrak |
| --- | --- | --- |
| Hapus pengguna | `wisatawan`, `mitra_transportasi`, `admin` ikut terhapus | `204`, kecuali admin terakhir |
| Hapus wisatawan | `itinerary` ikut terhapus, lalu `plan_item`, `leg_perjalanan`, `preferensi_wisata`, `recommendation`, `notifikasi_perjalanan` | `204` |
| Hapus itinerary | `plan_item`, `preferensi_wisata`, `recommendation`, `notifikasi_perjalanan` ikut terhapus | `204`, kecuali itinerary aktif |
| Hapus tempat | `destinasi_wisata`, `fasilitas_utilitas`, `ulasan_tempat` ikut terhapus | `409 PLACE_IN_USE` bila masih dipakai `plan_item` |
| Hapus wilayah | `context_environment` ikut terhapus, `lokasi_kunjungan` dan `transportasi` menjadi `null` | `409 REGION_IN_USE` bila masih memiliki destinasi atau transportasi |
| Hapus mitra | `transportasi.mitra_id` menjadi `null` | Tidak ada endpoint hapus mitra tersendiri, gunakan hapus pengguna |
| Hapus moda transportasi | Tabel rincian ikut terhapus, `leg_perjalanan.transportasi_id` menjadi `null` | `409 TRANSPORT_IN_USE` bila masih dipakai segmen |
| Hapus konteks | `recommendation.context_id` menjadi `null` | `409 CONTEXT_IN_USE` bila masih dirujuk rekomendasi |

Catatan:

- `fk_planitem_lokasi` tidak memiliki `ON DELETE`, sehingga penghapusan tempat yang masih dipakai perhentian ditolak basis data. Aplikasi harus menangkapnya dan mengembalikan `409 PLACE_IN_USE`.
- `data_log` tidak memiliki foreign key, sehingga catatan audit tetap ada setelah data sumber dihapus.
- Aturan `REGION_IN_USE` adalah aturan aplikasi, bukan aturan basis data, karena foreign key wilayah memakai `ON DELETE SET NULL` dan `ON DELETE CASCADE`. Tanpa pemeriksaan di aplikasi, penghapusan wilayah akan berhasil dan menghapus konteks terkait.

## Catatan tentang data contoh

Data simulasi memakai ID yang sama dengan data contoh pada aplikasi Vue, sehingga hasil percobaan mudah dibandingkan dengan tampilan aplikasi.

| Data | ID contoh |
| --- | --- |
| Wisatawan | `8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01` |
| Mitra | `9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11` |
| Admin | `7d3c9b1a-4e2f-4c83-b015-3c4d5e6f7a21` |
| Destinasi | `b1000000-0000-4000-8000-000000000001` |
| Itinerary | `c1000000-0000-4000-8000-000000000001` |
| Rekomendasi | `91000000-0000-4000-8000-000000000001` |
| Moda GoCar | `f1000000-0000-4000-8000-000000000003` |
| Konteks Bandung | `a2000000-0000-4000-8000-000000000001` |

Semua ID contoh berbentuk UUID dan dapat dipakai langsung pada kolom `varchar(36)`.

## Urutan penerapan yang disarankan

1. Terapkan perubahan `fasilitas_utilitas` pada salinan basis data.
2. Buat tabel `personal_access_tokens` sebelum mengaktifkan login berbasis token.
3. Buat tabel `recommendation_feedback` bila endpoint umpan balik akan diimplementasikan.
4. Tambahkan indeks setelah data lama diperiksa.
5. Tambahkan pemeriksaan enum dan batas nilai di lapisan aplikasi sebelum mengubah tipe kolom.
6. Sesuaikan model, relasi, dan penyaring pada backend dengan nama field kontrak.
7. Jalankan kembali `npm run validate` setelah kontrak diperbarui.
