export const IDS = {
  tourist: '8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01',
  tourist2: '8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e02',
  partner: '9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f11',
  partner2: '9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f12',
  partner3: '9f2b7a3d-6c8e-4b02-8a14-2b3c4d5e6f13',
  admin: '7d3c9b1a-4e2f-4c83-b015-3c4d5e6f7a21',
  admin2: '7d3c9b1a-4e2f-4c83-b015-3c4d5e6f7a22',
  regionBandung: 'a1000000-0000-4000-8000-000000000001',
  regionBarat: 'a1000000-0000-4000-8000-000000000002',
  regionCimahi: 'a1000000-0000-4000-8000-000000000003',
  regionKabBandung: 'a1000000-0000-4000-8000-000000000004',
  gedungSate: 'b1000000-0000-4000-8000-000000000001',
  braga: 'b1000000-0000-4000-8000-000000000002',
  saung: 'b1000000-0000-4000-8000-000000000003',
  farmhouse: 'b1000000-0000-4000-8000-000000000004',
  kawahPutih: 'b1000000-0000-4000-8000-000000000005',
  museumKaa: 'b1000000-0000-4000-8000-000000000007',
  cihampelas: 'b1000000-0000-4000-8000-000000000009',
  masjidRaya: 'b1000000-0000-4000-8000-000000000010',
  hotelSavoy: 'b1000000-0000-4000-8000-000000000011',
  stasiun: 'b1000000-0000-4000-8000-000000000012',
  itinerary: 'c1000000-0000-4000-8000-000000000001',
  itinerary2: 'c1000000-0000-4000-8000-000000000002',
  itinerary3: 'c1000000-0000-4000-8000-000000000003',
  stop1: 'd1000000-0000-4000-8000-000000000001',
  stop2: 'd1000000-0000-4000-8000-000000000002',
  stop3: 'd1000000-0000-4000-8000-000000000003',
  leg1: 'e1000000-0000-4000-8000-000000000001',
  leg2: 'e1000000-0000-4000-8000-000000000002',
  bus: 'f1000000-0000-4000-8000-000000000001',
  angkot: 'f1000000-0000-4000-8000-000000000002',
  gocar: 'f1000000-0000-4000-8000-000000000003',
  grabbike: 'f1000000-0000-4000-8000-000000000004',
  rental: 'f1000000-0000-4000-8000-000000000005',
  pedestrian: 'f1000000-0000-4000-8000-000000000006',
  shuttle: 'f1000000-0000-4000-8000-000000000007',
  contextBandung: 'a2000000-0000-4000-8000-000000000001',
  contextBarat: 'a2000000-0000-4000-8000-000000000002',
  recommendation: '91000000-0000-4000-8000-000000000001',
  recommendation2: '91000000-0000-4000-8000-000000000002',
  notification: 'a3000000-0000-4000-8000-000000000001',
  notification2: 'a3000000-0000-4000-8000-000000000002',
  review: 'a4000000-0000-4000-8000-000000000001',
  log: 'a5000000-0000-4000-8000-000000000001',
  facilityAtm: 'fa1000000-0000-4000-8000-000000000001',
  facilityToilet: 'fa1000000-0000-4000-8000-000000000002',
}

export const TOKENS = {
  tourist: '1|fh_demo_tourist_9f8e7d6c5b4a39281706',
  partner: '2|fh_demo_partner_4c3b2a1908f7e6d5c4b3',
  admin: '3|fh_demo_admin_7a6b5c4d3e2f1908a7b6',
}

export const regionBandung = {
  wilayah_id: IDS.regionBandung,
  nama_wilayah: 'Kota Bandung',
  provinsi: 'Jawa Barat',
  boundary_coordinates: [
    [106.947, -6.984],
    [107.089, -6.984],
    [107.089, -6.822],
    [106.947, -6.822],
  ],
  status_cakupan_aktif: true,
  jumlah_destinasi: 9,
}

export const regionBarat = {
  wilayah_id: IDS.regionBarat,
  nama_wilayah: 'Kabupaten Bandung Barat',
  provinsi: 'Jawa Barat',
  boundary_coordinates: [
    [107.241, -7.047],
    [107.515, -7.047],
    [107.515, -6.731],
    [107.241, -6.731],
  ],
  status_cakupan_aktif: true,
  jumlah_destinasi: 2,
}

export const regionCimahi = {
  wilayah_id: IDS.regionCimahi,
  nama_wilayah: 'Kota Cimahi',
  provinsi: 'Jawa Barat',
  boundary_coordinates: [
    [107.497, -6.941],
    [107.594, -6.941],
    [107.594, -6.833],
    [107.497, -6.833],
  ],
  status_cakupan_aktif: true,
  jumlah_destinasi: 0,
}

export const regionKabBandung = {
  wilayah_id: IDS.regionKabBandung,
  nama_wilayah: 'Kabupaten Bandung',
  provinsi: 'Jawa Barat',
  boundary_coordinates: [
    [107.402, -7.286],
    [107.768, -7.286],
    [107.768, -6.874],
    [107.402, -6.874],
  ],
  status_cakupan_aktif: false,
  jumlah_destinasi: 1,
}

export const regions = [regionBandung, regionBarat, regionCimahi, regionKabBandung]

export const destinations = [
  {
    place_id: IDS.gedungSate,
    wilayah_id: IDS.regionBandung,
    nama_tempat: 'Gedung Sate',
    alamat_lengkap: 'Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan',
    latitude: -6.902484,
    longitude: 107.618765,
    rating_rata_rata: 4.7,
    jumlah_review: 3210,
    jam_buka: '08:00',
    jam_tutup: '16:00',
    daftar_foto_url: ['/media/gedung-sate-1.jpg', '/media/gedung-sate-2.jpg'],
    kategori_wisata: 'sejarah',
    estimasi_durasi_kunjungan: 90,
    harga_tiket_masuk: 5000,
    wilayah: {
      wilayah_id: IDS.regionBandung,
      nama_wilayah: 'Kota Bandung',
      provinsi: 'Jawa Barat',
    },
    fasilitas: [
      {
        fasilitas_id: IDS.facilityAtm,
        place_id: IDS.gedungSate,
        jenis: 'ATM',
        is_gratis: true,
        fasilitas_tersedia: ['ATM BCA', 'ATM Mandiri', 'Area parkir'],
      },
      {
        fasilitas_id: IDS.facilityToilet,
        place_id: IDS.gedungSate,
        jenis: 'TOILET_UMUM',
        is_gratis: true,
        fasilitas_tersedia: ['Toilet pria', 'Toilet wanita', 'Mushola'],
      },
    ],
  },
  {
    place_id: IDS.braga,
    wilayah_id: IDS.regionBandung,
    nama_tempat: 'Braga Heritage Walk',
    alamat_lengkap: 'Jl. Braga, Kec. Sumur Bandung',
    latitude: -6.917464,
    longitude: 107.60981,
    rating_rata_rata: 4.6,
    jumlah_review: 2890,
    jam_buka: '00:00',
    jam_tutup: '24:00',
    daftar_foto_url: ['/media/braga-1.jpg'],
    kategori_wisata: 'budaya',
    estimasi_durasi_kunjungan: 75,
    harga_tiket_masuk: 0,
    wilayah: {
      wilayah_id: IDS.regionBandung,
      nama_wilayah: 'Kota Bandung',
      provinsi: 'Jawa Barat',
    },
    fasilitas: [
      {
        fasilitas_id: 'fa1000000-0000-4000-8000-000000000003',
        place_id: IDS.braga,
        jenis: 'RESTORAN_KULINER',
        is_gratis: false,
        fasilitas_tersedia: ['Kafe', 'Restoran sunda', 'Food court'],
      },
    ],
  },
  {
    place_id: IDS.saung,
    wilayah_id: IDS.regionBandung,
    nama_tempat: 'Saung Angklung Udjo',
    alamat_lengkap: 'Jl. Padasuka No.118, Cibeunying Kidul',
    latitude: -6.89753,
    longitude: 107.63551,
    rating_rata_rata: 4.8,
    jumlah_review: 4100,
    jam_buka: '09:00',
    jam_tutup: '17:00',
    daftar_foto_url: ['/media/saung-angklung-1.jpg'],
    kategori_wisata: 'budaya',
    estimasi_durasi_kunjungan: 120,
    harga_tiket_masuk: 85000,
    wilayah: {
      wilayah_id: IDS.regionBandung,
      nama_wilayah: 'Kota Bandung',
      provinsi: 'Jawa Barat',
    },
    fasilitas: [
      {
        fasilitas_id: 'fa1000000-0000-4000-8000-000000000004',
        place_id: IDS.saung,
        jenis: 'TOILET_UMUM',
        is_gratis: true,
        fasilitas_tersedia: ['Toilet', 'Mushola', 'Area tunggu'],
      },
    ],
  },
  {
    place_id: IDS.farmhouse,
    wilayah_id: IDS.regionBarat,
    nama_tempat: 'Farmhouse Lembang',
    alamat_lengkap: 'Jl. Raya Lembang No.108, Gudangkahuripan',
    latitude: -6.83332,
    longitude: 107.6167,
    rating_rata_rata: 4.5,
    jumlah_review: 7800,
    jam_buka: '09:00',
    jam_tutup: '20:00',
    daftar_foto_url: ['/media/farmhouse-1.jpg'],
    kategori_wisata: 'alam',
    estimasi_durasi_kunjungan: 120,
    harga_tiket_masuk: 35000,
    wilayah: {
      wilayah_id: IDS.regionBarat,
      nama_wilayah: 'Kabupaten Bandung Barat',
      provinsi: 'Jawa Barat',
    },
    fasilitas: [
      {
        fasilitas_id: 'fa1000000-0000-4000-8000-000000000005',
        place_id: IDS.farmhouse,
        jenis: 'RESTORAN_KULINER',
        is_gratis: false,
        fasilitas_tersedia: ['Restoran', 'Kafe susu', 'Toko suvenir'],
      },
    ],
  },
  {
    place_id: IDS.kawahPutih,
    wilayah_id: IDS.regionKabBandung,
    nama_tempat: 'Kawah Putih Ciwidey',
    alamat_lengkap: 'Jl. Raya Soreang Ciwidey, Patengan, Rancabali',
    latitude: -7.16624,
    longitude: 107.40218,
    rating_rata_rata: 4.7,
    jumlah_review: 6200,
    jam_buka: '07:00',
    jam_tutup: '17:00',
    daftar_foto_url: ['/media/kawah-putih-1.jpg'],
    kategori_wisata: 'alam',
    estimasi_durasi_kunjungan: 180,
    harga_tiket_masuk: 150000,
    wilayah: {
      wilayah_id: IDS.regionKabBandung,
      nama_wilayah: 'Kabupaten Bandung',
      provinsi: 'Jawa Barat',
    },
    fasilitas: [],
  },
]

export const touristUser = {
  user_id: IDS.tourist,
  nama: 'Alfian Hanif',
  email: 'alfian.hanif@example.com',
  nomor_telepon: '+6281321001001',
  role: 'tourist',
  profil: {
    preferensi_umum: 'Wisata Budaya & Kuliner',
    jumlah_itinerary: 2,
    jumlah_notifikasi_belum_dibaca: 3,
  },
}

export const partnerUser = {
  user_id: IDS.partner,
  nama: 'Dewi Lestari',
  email: 'dewi.lestari@bandungjayatour.co.id',
  nomor_telepon: '+622242020011',
  role: 'partner',
  profil: {
    nama_perusahaan: 'PT Bandung Jaya Tour',
    legalitas_doc_url: '/docs/legalitas-bandung-jaya.txt',
    status_verifikasi: true,
    verified_by_admin_id: IDS.admin,
    jumlah_armada: 3,
  },
}

export const adminUser = {
  user_id: IDS.admin,
  nama: 'Tantan Nugraha',
  email: 'tantan.nugraha@findholiday.id',
  nomor_telepon: '+6281122004001',
  role: 'admin',
  profil: {
    admin_level: 'super_admin',
    departemen: 'Operasional',
    terakhir_aktif: '2026-10-30 15:42:00',
  },
}

export const users = [
  touristUser,
  {
    user_id: IDS.tourist2,
    nama: 'Salsabila Putri',
    email: 'salsabila.putri@example.com',
    nomor_telepon: '+6281321001002',
    role: 'tourist',
    profil: {
      preferensi_umum: 'Sejarah & Fotografi',
      jumlah_itinerary: 2,
      jumlah_notifikasi_belum_dibaca: 0,
    },
  },
  partnerUser,
  {
    user_id: IDS.partner3,
    nama: 'Yusuf Maulana',
    email: 'yusuf@bandungecoride.id',
    nomor_telepon: '+6281222003033',
    role: 'partner',
    profil: {
      nama_perusahaan: 'Bandung Eco Ride',
      legalitas_doc_url: '/docs/legalitas-bandung-eco-ride.txt',
      status_verifikasi: false,
      verified_by_admin_id: null,
      jumlah_armada: 1,
    },
  },
  adminUser,
  {
    user_id: IDS.admin2,
    nama: 'Johannes Putra',
    email: 'johannes.putra@findholiday.id',
    nomor_telepon: '+6281122004002',
    role: 'admin',
    profil: {
      admin_level: 'moderator',
      departemen: 'Verifikasi Mitra',
      terakhir_aktif: '2026-10-30 14:05:00',
    },
  },
]

export const facilities = destinations[0].fasilitas

export const reviews = [
  {
    ulasan_id: IDS.review,
    place_id: IDS.gedungSate,
    nama_penulis: 'Rina Kartika',
    skor_rating: 5,
    isi_komentar:
      'Bangunan ikonik dengan taman yang tertata. Tur museum informatif dan petugas ramah.',
    waktu_ulasan: '2026-10-28 10:15:00',
    status_publikasi: true,
  },
  {
    ulasan_id: 'a4000000-0000-4000-8000-000000000002',
    place_id: IDS.gedungSate,
    nama_penulis: 'Dimas Prakoso',
    skor_rating: 4,
    isi_komentar:
      'Antrean tiket cukup panjang saat akhir pekan. Datang pagi agar lebih nyaman.',
    waktu_ulasan: '2026-10-26 09:40:00',
    status_publikasi: true,
  },
  {
    ulasan_id: 'a4000000-0000-4000-8000-000000000008',
    place_id: IDS.cihampelas,
    nama_penulis: 'Pengunjung Anonim',
    skor_rating: 2,
    isi_komentar:
      'Parkir sulit dan area cukup ramai. Konten ulasan menunggu pemeriksaan moderator.',
    waktu_ulasan: '2026-10-29 18:40:00',
    status_publikasi: false,
  },
]

export const weather = {
  context_id: IDS.contextBandung,
  wilayah_id: IDS.regionBandung,
  nama_wilayah: 'Kota Bandung',
  kondisi_cuaca: 'Hujan Ringan',
  suhu_celsius: 24.5,
  tingkat_curah_hujan: 8.4,
  terakhir_diperbarui: '2026-10-30 14:10:00',
  status_data: 'segar',
}

export const environment = {
  context_id: IDS.contextBandung,
  wilayah_id: IDS.regionBandung,
  nama_wilayah: 'Kota Bandung',
  kondisi_cuaca: 'Hujan Ringan',
  suhu_celsius: 24.5,
  tingkat_curah_hujan: 8.4,
  kondisi_lalu_lintas: 'Padat',
  ada_insiden_kecelakaan: false,
  rata_rata_kepadatan_jalan: 0.72,
  terakhir_diperbarui: '2026-10-30 14:10:00',
}

export const transportModes = [
  {
    transportasi_id: IDS.bus,
    wilayah_id: IDS.regionBandung,
    mitra_id: IDS.partner2,
    nama_moda: 'Trans Metro Bandung Koridor 3',
    jenis_transportasi: 'BUS',
    kapasitas_penumpang: 60,
    status_aktif: true,
    sumber_data: 'GTFS Feed',
    terakhir_diperbarui: '2026-10-30 06:00:00',
    wilayah: {
      wilayah_id: IDS.regionBandung,
      nama_wilayah: 'Kota Bandung',
      provinsi: 'Jawa Barat',
    },
    mitra: {
      user_id: IDS.partner2,
      nama_perusahaan: 'CV Cimahi Trans',
    },
    detail: {
      nomor_trayek: 'Koridor 3',
      rute_halte: [
        'Halte Gasibu',
        'Halte Alun-Alun',
        'Halte Cicaheum',
        'Halte Riung Bandung',
      ],
      tarif_tetap: 4900,
      interval_menit: 15,
    },
  },
  {
    transportasi_id: IDS.angkot,
    wilayah_id: IDS.regionBandung,
    mitra_id: null,
    nama_moda: 'Angkot Kalapa Dago 02',
    jenis_transportasi: 'ANGKOT',
    kapasitas_penumpang: 14,
    status_aktif: true,
    sumber_data: 'Dishub Bandung',
    terakhir_diperbarui: '2026-10-29 18:20:00',
    wilayah: {
      wilayah_id: IDS.regionBandung,
      nama_wilayah: 'Kota Bandung',
      provinsi: 'Jawa Barat',
    },
    mitra: null,
    detail: {
      nomor_trayek: '02',
      rute_halte: ['Halte Savoy Homann', 'Halte Braga', 'Halte Dago', 'Halte Kalapa'],
      tarif_tetap: 8000,
      interval_menit: 10,
    },
  },
  {
    transportasi_id: IDS.gocar,
    wilayah_id: IDS.regionBandung,
    mitra_id: IDS.partner,
    nama_moda: 'GoCar Bandung',
    jenis_transportasi: 'ONLINE_TAXI',
    kapasitas_penumpang: 4,
    status_aktif: true,
    sumber_data: 'Mitra Portal',
    terakhir_diperbarui: '2026-10-30 14:05:00',
    wilayah: {
      wilayah_id: IDS.regionBandung,
      nama_wilayah: 'Kota Bandung',
      provinsi: 'Jawa Barat',
    },
    mitra: {
      user_id: IDS.partner,
      nama_perusahaan: 'PT Bandung Jaya Tour',
    },
    detail: {
      tarif_dasar: 10000,
      tarif_per_km: 4500,
      surge_multiplier: 1.2,
    },
  },
  {
    transportasi_id: IDS.grabbike,
    wilayah_id: IDS.regionBandung,
    mitra_id: IDS.partner2,
    nama_moda: 'GrabBike Bandung',
    jenis_transportasi: 'ONLINE_MOTOR',
    kapasitas_penumpang: 1,
    status_aktif: true,
    sumber_data: 'Mitra Portal',
    terakhir_diperbarui: '2026-10-30 13:50:00',
    wilayah: {
      wilayah_id: IDS.regionBandung,
      nama_wilayah: 'Kota Bandung',
      provinsi: 'Jawa Barat',
    },
    mitra: {
      user_id: IDS.partner2,
      nama_perusahaan: 'CV Cimahi Trans',
    },
    detail: {
      tarif_dasar: 8000,
      tarif_per_km: 2500,
      surge_multiplier: 1,
    },
  },
  {
    transportasi_id: IDS.rental,
    wilayah_id: IDS.regionBandung,
    mitra_id: IDS.partner,
    nama_moda: 'Sewa Avanza Bandung Jaya',
    jenis_transportasi: 'RENTAL',
    kapasitas_penumpang: 7,
    status_aktif: true,
    sumber_data: 'Mitra Portal',
    terakhir_diperbarui: '2026-10-28 09:15:00',
    wilayah: {
      wilayah_id: IDS.regionBandung,
      nama_wilayah: 'Kota Bandung',
      provinsi: 'Jawa Barat',
    },
    mitra: {
      user_id: IDS.partner,
      nama_perusahaan: 'PT Bandung Jaya Tour',
    },
    detail: {
      tarif_per_hari: 450000,
      termasuk_driver: true,
      jenis_bahan_bakar: 'Bensin',
    },
  },
  {
    transportasi_id: IDS.pedestrian,
    wilayah_id: IDS.regionBandung,
    mitra_id: null,
    nama_moda: 'Trotoar Dago Heritage',
    jenis_transportasi: 'PEDESTRIAN',
    kapasitas_penumpang: 1,
    status_aktif: true,
    sumber_data: 'OpenStreetMap',
    terakhir_diperbarui: '2026-10-20 08:00:00',
    wilayah: {
      wilayah_id: IDS.regionBandung,
      nama_wilayah: 'Kota Bandung',
      provinsi: 'Jawa Barat',
    },
    mitra: null,
    detail: {
      kecepatan_rata_rata_km_jam: 4.5,
      is_jalur_pedestrian_tersedia: true,
    },
  },
  {
    transportasi_id: IDS.shuttle,
    wilayah_id: IDS.regionBandung,
    mitra_id: IDS.partner3,
    nama_moda: 'Tourist Shuttle Bandung',
    jenis_transportasi: 'SHUTTLE',
    kapasitas_penumpang: 20,
    status_aktif: false,
    sumber_data: 'Mitra Portal',
    terakhir_diperbarui: '2026-10-26 11:30:00',
    wilayah: {
      wilayah_id: IDS.regionBandung,
      nama_wilayah: 'Kota Bandung',
      provinsi: 'Jawa Barat',
    },
    mitra: {
      user_id: IDS.partner3,
      nama_perusahaan: 'Bandung Eco Ride',
    },
    detail: {
      nomor_trayek: 'Shuttle 04',
      rute_halte: ['Savoy Homann', 'Gedung Sate', 'Saung Angklung Udjo', 'Dago'],
      tarif_tetap: 15000,
      interval_menit: 30,
    },
  },
]

export const preference = {
  preferensi_id: 1,
  itinerary_id: IDS.itinerary,
  prioritas_utama: 'kenyamanan',
  hindari_jalan_kaki_jauh: true,
  maksimal_transit: 2,
  preferensi_biaya: 'standar',
}

export const itinerarySummary = {
  itinerary_id: IDS.itinerary,
  wisatawan_id: IDS.tourist,
  start_place_id: IDS.hotelSavoy,
  judul_perjalanan: 'Bandung Heritage & Kuliner Weekend',
  tanggal_mulai: '2026-11-14',
  tanggal_selesai: '2026-11-15',
  jumlah_wisatawan: 2,
  total_anggaran: 1500000,
  status_rencana: 'aktif',
  jumlah_destinasi: 3,
  total_estimasi_biaya: 28000,
  preferensi: preference,
}

export const itinerarySummary2 = {
  itinerary_id: IDS.itinerary2,
  wisatawan_id: IDS.tourist,
  start_place_id: IDS.hotelSavoy,
  judul_perjalanan: 'Lembang Highland Escape',
  tanggal_mulai: '2026-11-22',
  tanggal_selesai: '2026-11-23',
  jumlah_wisatawan: 4,
  total_anggaran: 2000000,
  status_rencana: 'draft',
  jumlah_destinasi: 3,
  total_estimasi_biaya: 95000,
  preferensi: {
    preferensi_id: 2,
    itinerary_id: IDS.itinerary2,
    prioritas_utama: 'kecepatan',
    hindari_jalan_kaki_jauh: false,
    maksimal_transit: 1,
    preferensi_biaya: 'premium',
  },
}

export const itineraries = [itinerarySummary, itinerarySummary2]

export const legs = [
  {
    leg_id: IDS.leg1,
    plan_item_id: IDS.stop1,
    transportasi_id: IDS.pedestrian,
    urutan_leg: 1,
    instruksi_rute: 'Jalan kaki 600 m dari Hotel Savoy Homann ke Halte Savoy.',
    jarak_leg_km: 0.6,
    estimasi_durasi_menit: 7,
    biaya_leg: 0,
    transportasi: {
      transportasi_id: IDS.pedestrian,
      nama_moda: 'Trotoar Dago Heritage',
      jenis_transportasi: 'PEDESTRIAN',
    },
  },
  {
    leg_id: IDS.leg2,
    plan_item_id: IDS.stop1,
    transportasi_id: IDS.angkot,
    urutan_leg: 2,
    instruksi_rute: 'Naik Angkot 02 dan turun di depan Gedung Sate.',
    jarak_leg_km: 1.8,
    estimasi_durasi_menit: 8,
    biaya_leg: 8000,
    transportasi: {
      transportasi_id: IDS.angkot,
      nama_moda: 'Angkot Kalapa Dago 02',
      jenis_transportasi: 'ANGKOT',
    },
  },
]

export const stops = [
  {
    plan_item_id: IDS.stop1,
    itinerary_id: IDS.itinerary,
    place_id: IDS.gedungSate,
    urutan: 1,
    waktu_mulai_rencana: '2026-11-14 09:00:00',
    waktu_selesai_rencana: '2026-11-14 11:00:00',
    total_jarak_segment_km: 2.4,
    total_durasi_segment_menit: 15,
    total_biaya_segment: 8000,
    is_manual_selected: false,
    tempat: {
      place_id: IDS.gedungSate,
      nama_tempat: 'Gedung Sate',
      kategori_wisata: 'sejarah',
      latitude: -6.902484,
      longitude: 107.618765,
      alamat_lengkap: 'Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan',
    },
    legs,
  },
  {
    plan_item_id: IDS.stop2,
    itinerary_id: IDS.itinerary,
    place_id: IDS.braga,
    urutan: 2,
    waktu_mulai_rencana: '2026-11-14 12:30:00',
    waktu_selesai_rencana: '2026-11-14 14:00:00',
    total_jarak_segment_km: 3.1,
    total_durasi_segment_menit: 18,
    total_biaya_segment: 12000,
    is_manual_selected: false,
    tempat: {
      place_id: IDS.braga,
      nama_tempat: 'Braga Heritage Walk',
      kategori_wisata: 'budaya',
      latitude: -6.917464,
      longitude: 107.60981,
      alamat_lengkap: 'Jl. Braga, Kec. Sumur Bandung',
    },
    legs: [
      {
        leg_id: 'e1000000-0000-4000-8000-000000000003',
        plan_item_id: IDS.stop2,
        transportasi_id: IDS.pedestrian,
        urutan_leg: 1,
        instruksi_rute: 'Jalan kaki 400 m menyusuri Jl. Diponegoro ke titik jemput.',
        jarak_leg_km: 0.4,
        estimasi_durasi_menit: 6,
        biaya_leg: 0,
        transportasi: {
          transportasi_id: IDS.pedestrian,
          nama_moda: 'Trotoar Dago Heritage',
          jenis_transportasi: 'PEDESTRIAN',
        },
      },
      {
        leg_id: 'e1000000-0000-4000-8000-000000000004',
        plan_item_id: IDS.stop2,
        transportasi_id: IDS.gocar,
        urutan_leg: 2,
        instruksi_rute: 'GoCar dari Gedung Sate ke Braga Heritage Walk.',
        jarak_leg_km: 2.7,
        estimasi_durasi_menit: 12,
        biaya_leg: 12000,
        transportasi: {
          transportasi_id: IDS.gocar,
          nama_moda: 'GoCar Bandung',
          jenis_transportasi: 'ONLINE_TAXI',
        },
      },
    ],
  },
  {
    plan_item_id: IDS.stop3,
    itinerary_id: IDS.itinerary,
    place_id: IDS.saung,
    urutan: 3,
    waktu_mulai_rencana: '2026-11-14 15:30:00',
    waktu_selesai_rencana: '2026-11-14 17:00:00',
    total_jarak_segment_km: 4.2,
    total_durasi_segment_menit: 22,
    total_biaya_segment: 8000,
    is_manual_selected: true,
    tempat: {
      place_id: IDS.saung,
      nama_tempat: 'Saung Angklung Udjo',
      kategori_wisata: 'budaya',
      latitude: -6.89753,
      longitude: 107.63551,
      alamat_lengkap: 'Jl. Padasukah No.118, Cibeunying Kidul',
    },
    legs: [
      {
        leg_id: 'e1000000-0000-4000-8000-000000000005',
        plan_item_id: IDS.stop3,
        transportasi_id: IDS.pedestrian,
        urutan_leg: 1,
        instruksi_rute: 'Jalan kaki 500 m ke Halte Alun-Alun.',
        jarak_leg_km: 0.5,
        estimasi_durasi_menit: 6,
        biaya_leg: 0,
        transportasi: {
          transportasi_id: IDS.pedestrian,
          nama_moda: 'Trotoar Dago Heritage',
          jenis_transportasi: 'PEDESTRIAN',
        },
      },
      {
        leg_id: 'e1000000-0000-4000-8000-000000000006',
        plan_item_id: IDS.stop3,
        transportasi_id: IDS.shuttle,
        urutan_leg: 2,
        instruksi_rute:
          'Tourist Shuttle 04 dari Halte Alun-Alun ke gerbang Saung Angklung Udjo.',
        jarak_leg_km: 3.7,
        estimasi_durasi_menit: 16,
        biaya_leg: 8000,
        transportasi: {
          transportasi_id: IDS.shuttle,
          nama_moda: 'Tourist Shuttle Bandung',
          jenis_transportasi: 'SHUTTLE',
        },
      },
    ],
  },
]

export const itineraryDetail = {
  ...itinerarySummary,
  destinasi: stops,
  rekomendasi_teratas: {
    recommendation_id: IDS.recommendation,
    ranking: 1,
    total_estimated_cost: 28000,
    total_estimated_duration: 55,
    suitability_score: 0.94,
  },
}

export const recommendations = [
  {
    recommendation_id: IDS.recommendation,
    itinerary_id: IDS.itinerary,
    context_id: IDS.contextBandung,
    ranking: 1,
    total_estimated_cost: 28000,
    total_estimated_duration: 55,
    suitability_score: 0.94,
    comfort_score: 0.89,
    weather_impact_score: 0.92,
    traffic_impact_score: 0.81,
    catatan_konteks:
      'Rute ini memakai Angkot 02, TMB Koridor 3, dan shuttle tertutup. Hanya 1,5 km jalan kaki terbuka sehingga tetap aman saat hujan ringan.',
    generated_at: '2026-10-30 14:12:00',
    itinerary: {
      itinerary_id: IDS.itinerary,
      judul_perjalanan: 'Bandung Heritage & Kuliner Weekend',
    },
    konteks: {
      context_id: IDS.contextBandung,
      kondisi_cuaca: 'Hujan Ringan',
      kondisi_lalu_lintas: 'Padat',
      tingkat_curah_hujan: 8.4,
    },
  },
  {
    recommendation_id: IDS.recommendation2,
    itinerary_id: IDS.itinerary,
    context_id: IDS.contextBandung,
    ranking: 2,
    total_estimated_cost: 122000,
    total_estimated_duration: 47,
    suitability_score: 0.86,
    comfort_score: 0.94,
    weather_impact_score: 0.84,
    traffic_impact_score: 0.62,
    catatan_konteks:
      'Taksi online memberi waktu tempuh lebih singkat dan terlindung dari hujan, tetapi biaya naik dan rawan tertahan kemacetan Jl. Asia Afrika.',
    generated_at: '2026-10-30 14:12:00',
    itinerary: {
      itinerary_id: IDS.itinerary,
      judul_perjalanan: 'Bandung Heritage & Kuliner Weekend',
    },
    konteks: {
      context_id: IDS.contextBandung,
      kondisi_cuaca: 'Hujan Ringan',
      kondisi_lalu_lintas: 'Padat',
      tingkat_curah_hujan: 8.4,
    },
  },
]

export const recommendationsHistory = recommendations.map((item) => ({
  recommendation_id: item.recommendation_id,
  itinerary_id: item.itinerary_id,
  judul_perjalanan: item.itinerary.judul_perjalanan,
  ranking: item.ranking,
  total_estimated_cost: item.total_estimated_cost,
  total_estimated_duration: item.total_estimated_duration,
  suitability_score: item.suitability_score,
  kondisi_cuaca: item.konteks.kondisi_cuaca,
  catatan_konteks: item.catatan_konteks,
  generated_at: item.generated_at,
}))

export const notifications = [
  {
    notifikasi_id: IDS.notification,
    itinerary_id: IDS.itinerary,
    judul_peringatan: 'Hujan lebat di sektor Dago',
    pesan_kendala:
      'Curah hujan terpantau 14,5 mm per jam. Leg jalan kaki menuju Saung Angklung Udjo dialihkan ke shuttle tertutup.',
    jenis_pemicu: 'cuaca_hujan',
    tingkat_urgensi: 'peringatan',
    waktu_dibuat: '2026-10-30 14:20:00',
    is_dibaca: false,
    itinerary: {
      itinerary_id: IDS.itinerary,
      judul_perjalanan: 'Bandung Heritage & Kuliner Weekend',
    },
  },
  {
    notifikasi_id: IDS.notification2,
    itinerary_id: IDS.itinerary,
    judul_peringatan: 'Kepadatan meningkat di Jl. Asia Afrika',
    pesan_kendala:
      'Kepadatan jalan tercatat 0,72. Perjalanan dengan taksi berpotensi terlambat 8 sampai 12 menit.',
    jenis_pemicu: 'lalu_lintas',
    tingkat_urgensi: 'info',
    waktu_dibuat: '2026-10-30 13:45:00',
    is_dibaca: true,
    itinerary: {
      itinerary_id: IDS.itinerary,
      judul_perjalanan: 'Bandung Heritage & Kuliner Weekend',
    },
  },
]

export const auditLogs = [
  {
    log_id: IDS.log,
    entitas_terdampak: 'transportasi',
    id_referensi: IDS.gocar,
    aksi: 'UPDATE',
    detail_perubahan: {
      tarif_per_km: { before: 4000, after: 4500 },
      surge_multiplier: { before: 1.1, after: 1.2 },
    },
    aktor_pelaksana: 'Dewi Lestari',
    waktu_log: '2026-10-30 14:05:00',
  },
  {
    log_id: 'a5000000-0000-4000-8000-000000000002',
    entitas_terdampak: 'mitra_transportasi',
    id_referensi: IDS.partner,
    aksi: 'UPDATE',
    detail_perubahan: {
      status_verifikasi: { before: false, after: true },
      verified_by_admin_id: { before: null, after: IDS.admin },
    },
    aktor_pelaksana: 'Tantan Nugraha',
    waktu_log: '2026-10-27 09:12:00',
  },
  {
    log_id: 'a5000000-0000-4000-8000-000000000003',
    entitas_terdampak: 'ulasan_tempat',
    id_referensi: 'a4000000-0000-4000-8000-000000000008',
    aksi: 'UPDATE',
    detail_perubahan: {
      status_publikasi: { before: true, after: false },
      alasan: 'Menunggu pemeriksaan moderator',
    },
    aktor_pelaksana: 'Johannes Putra',
    waktu_log: '2026-10-29 19:02:00',
  },
]

export const partnerFleets = transportModes.filter((item) =>
  [IDS.gocar, IDS.rental].includes(item.transportasi_id),
)

export const dashboard = {
  pengguna: {
    total: 8,
    wisatawan: 3,
    mitra: 3,
    admin: 2,
  },
  mitra: {
    total: 3,
    terverifikasi: 2,
    menunggu_verifikasi: 1,
  },
  wilayah: {
    total: 4,
    cakupan_aktif: 3,
  },
  destinasi: {
    total: 12,
    populer: 10,
    rata_rata_rating: 4.58,
  },
  itinerary: {
    total: 5,
    draft: 2,
    aktif: 2,
    selesai: 1,
    dibatalkan: 0,
  },
  rekomendasi: {
    total: 10,
    dihitung_hari_ini: 6,
  },
  notifikasi: {
    total: 5,
    belum_dibaca: 3,
  },
  aktivitas_terbaru: auditLogs.slice(0, 2),
  diperbarui_pada: '2026-10-30 15:45:00',
}

export const listMeta = (total, perPage = 10, page = 1) => ({
  page,
  per_page: perPage,
  total,
  total_pages: Math.max(1, Math.ceil(total / perPage)),
})

export const ok = (data, message) => ({
  data,
  ...(message ? { message } : {}),
})

export const list = (data, meta = listMeta(data.length), message) => ({
  data,
  ...(message ? { message } : {}),
  meta,
})

export const created = (data, message = 'Data berhasil dibuat.') =>
  ok(data, message)

export const deleted = null
