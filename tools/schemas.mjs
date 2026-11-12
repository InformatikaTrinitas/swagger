const ref = (name) => ({ $ref: `#/components/schemas/${name}` })
const str = (description, extra = {}) => ({ type: 'string', description, ...extra })
const num = (description, extra = {}) => ({ type: 'number', description, ...extra })
const int = (description, extra = {}) => ({ type: 'integer', description, ...extra })
const bool = (description) => ({ type: 'boolean', description })
const arr = (items, description) => ({ type: 'array', description, items })
const uuid = (description) => ({
  type: 'string',
  format: 'uuid',
  description,
})
const date = (description) => ({
  type: 'string',
  format: 'date',
  description,
})
const dateTime = (description) => ({
  type: 'string',
  description: `${description} Format YYYY-MM-DD HH:MM:SS.`,
  example: '2026-10-30 14:10:00',
})
const nullable = (schema) => ({ ...schema, nullable: true })

const meta = {
  type: 'object',
  description: 'Informasi halaman untuk respons daftar.',
  required: ['page', 'per_page', 'total', 'total_pages'],
  properties: {
    page: int('Halaman yang dikembalikan.', { minimum: 1, example: 1 }),
    per_page: int('Jumlah data per halaman.', { minimum: 1, maximum: 100, example: 10 }),
    total: int('Total data yang sesuai filter.', { minimum: 0, example: 4 }),
    total_pages: int('Total halaman.', { minimum: 1, example: 1 }),
  },
}

const errorDetail = {
  type: 'object',
  description: 'Rincian satu kesalahan validasi atau konflik.',
  required: ['field', 'message'],
  properties: {
    field: str('Nama field yang bermasalah.', { example: 'email' }),
    message: str('Penjelasan singkat untuk field tersebut.', {
      example: 'Format email belum benar.',
    }),
  },
}

const error = {
  type: 'object',
  description: 'Objek kesalahan yang konsisten untuk seluruh endpoint.',
  required: ['code', 'message'],
  properties: {
    code: str('Kode kesalahan yang stabil untuk kebutuhan integrasi.', {
      example: 'VALIDATION_ERROR',
    }),
    message: str('Pesan yang dapat ditampilkan kepada pengguna.', {
      example: 'Data yang dikirim belum lengkap.',
    }),
    details: arr(ref('ErrorDetail'), 'Rincian kesalahan bila tersedia.'),
  },
}

const errorEnvelope = {
  type: 'object',
  description: 'Amplop respons kesalahan.',
  required: ['error', 'request_id'],
  properties: {
    error: ref('Error'),
    request_id: str('ID permintaan untuk penelusuran log.', {
      example: 'req_demo_0001',
    }),
  },
}

const userProfile = {
  type: 'object',
  description:
    'Data profil tambahan sesuai peran. Field yang tidak relevan tidak dikirim.',
  properties: {
    preferensi_umum: str('Preferensi perjalanan wisatawan.', {
      example: 'Wisata Budaya & Kuliner',
    }),
    jumlah_itinerary: int('Jumlah itinerary milik wisatawan.', { example: 2 }),
    jumlah_notifikasi_belum_dibaca: int('Jumlah notifikasi yang belum dibaca.', {
      example: 3,
    }),
    nama_perusahaan: str('Nama badan usaha mitra.', {
      example: 'PT Bandung Jaya Tour',
    }),
    legalitas_doc_url: nullable(
      str('URL dokumen legalitas mitra.', {
        example: '/docs/legalitas-bandung-jaya.txt',
      }),
    ),
    status_verifikasi: bool('Status verifikasi mitra oleh admin.'),
    verified_by_admin_id: nullable(uuid('Admin yang memverifikasi mitra.')),
    jumlah_armada: int('Jumlah armada aktif milik mitra.', { example: 3 }),
    admin_level: str('Tingkat administrator.', { example: 'super_admin' }),
    departemen: str('Departemen administrator.', { example: 'Operasional' }),
    terakhir_aktif: dateTime('Waktu terakhir administrator aktif.'),
  },
}

const user = {
  type: 'object',
  description: 'Data pengguna beserta profil sesuai peran.',
  required: ['user_id', 'nama', 'email', 'role'],
  properties: {
    user_id: uuid('ID pengguna.'),
    nama: str('Nama lengkap.', { example: 'Alfian Hanif' }),
    email: str('Alamat email.', {
      format: 'email',
      example: 'alfian.hanif@example.com',
    }),
    nomor_telepon: nullable(
      str('Nomor telepon dalam format internasional.', {
        example: '+6281321001001',
      }),
    ),
    role: str('Peran pengguna.', {
      enum: ['tourist', 'partner', 'admin'],
      example: 'tourist',
    }),
    profil: ref('UserProfile'),
  },
}

const authSession = {
  type: 'object',
  description: 'Sesi pengguna setelah registrasi atau login.',
  required: ['user', 'token', 'token_type', 'abilities'],
  properties: {
    user: ref('User'),
    token: str('Token Bearer untuk permintaan berikutnya.', {
      example: '1|fh_demo_tourist_9f8e7d6c5b4a39281706',
    }),
    token_type: str('Jenis token.', { example: 'Bearer' }),
    abilities: arr(str('Kemampuan token.'), 'Daftar izin yang melekat pada token.', {
      example: ['role:tourist'],
    }),
  },
}

const region = {
  type: 'object',
  description: 'Wilayah layanan beserta batas geografis.',
  required: ['wilayah_id', 'nama_wilayah', 'provinsi', 'status_cakupan_aktif'],
  properties: {
    wilayah_id: uuid('ID wilayah.'),
    nama_wilayah: str('Nama kabupaten atau kota.', { example: 'Kota Bandung' }),
    provinsi: str('Nama provinsi.', { example: 'Jawa Barat' }),
    boundary_coordinates: arr(
      arr(num('Koordinat.'), 'Pasangan longitude dan latitude.'),
      'Garis batas wilayah dalam format GeoJSON sederhana.',
    ),
    status_cakupan_aktif: bool('Apakah wilayah sedang dilayani.'),
    jumlah_destinasi: int('Jumlah destinasi di wilayah ini.', { example: 9 }),
  },
}

const facility = {
  type: 'object',
  description: 'Fasilitas utilitas pada satu tempat.',
  required: ['fasilitas_id', 'place_id', 'jenis', 'is_gratis', 'fasilitas_tersedia'],
  properties: {
    fasilitas_id: uuid(
      'ID fasilitas. Nilai ini ditambahkan pada kontrak karena satu tempat dapat memiliki beberapa fasilitas.',
    ),
    place_id: uuid('ID tempat pemilik fasilitas.'),
    jenis: str('Jenis fasilitas.', {
      enum: [
        'TEMPAT_IBADAH',
        'RESTORAN_KULINER',
        'TOILET_UMUM',
        'HOTEL_PENGINAPAN',
        'SPBU',
        'ATM',
      ],
      example: 'ATM',
    }),
    is_gratis: bool('Apakah fasilitas dapat digunakan tanpa biaya.'),
    fasilitas_tersedia: arr(
      str('Nama fasilitas.'),
      'Daftar fasilitas yang tersedia.',
    ),
  },
}

const placeSummary = {
  type: 'object',
  description: 'Ringkasan tempat kunjungan.',
  required: ['place_id', 'nama_tempat', 'latitude', 'longitude'],
  properties: {
    place_id: uuid('ID tempat kunjungan.'),
    nama_tempat: str('Nama tempat.', { example: 'Gedung Sate' }),
    kategori_wisata: str('Kategori wisata.', { example: 'sejarah' }),
    alamat_lengkap: str('Alamat lengkap.', {
      example: 'Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan',
    }),
    latitude: num('Koordinat lintang.', { example: -6.902484 }),
    longitude: num('Koordinat bujur.', { example: 107.618765 }),
    rating_rata_rata: num('Rata-rata rating.', { example: 4.7 }),
    jumlah_review: int('Jumlah ulasan.', { example: 3210 }),
    estimasi_durasi_kunjungan: int('Estimasi durasi kunjungan dalam menit.', {
      example: 90,
    }),
    harga_tiket_masuk: num('Harga tiket masuk dalam rupiah.', { example: 5000 }),
  },
}

const destination = {
  allOf: [
    ref('PlaceSummary'),
    {
      type: 'object',
      required: [
        'wilayah_id',
        'jam_buka',
        'jam_tutup',
        'daftar_foto_url',
        'wilayah',
      ],
      properties: {
        wilayah_id: uuid('ID wilayah.'),
        jam_buka: str('Jam buka.', { example: '08:00' }),
        jam_tutup: str('Jam tutup.', { example: '16:00' }),
        daftar_foto_url: arr(str('URL foto.'), 'Daftar URL foto tempat.'),
        wilayah: ref('RegionSummary'),
        fasilitas: arr(ref('Facility'), 'Fasilitas yang tersedia di tempat.'),
      },
    },
  ],
}

const regionSummary = {
  type: 'object',
  description: 'Ringkasan wilayah.',
  required: ['wilayah_id', 'nama_wilayah', 'provinsi'],
  properties: {
    wilayah_id: uuid('ID wilayah.'),
    nama_wilayah: str('Nama wilayah.', { example: 'Kota Bandung' }),
    provinsi: str('Nama provinsi.', { example: 'Jawa Barat' }),
  },
}

const transportDetail = {
  type: 'object',
  description:
    'Rincian tarif dan layanan sesuai jenis transportasi. Hanya field yang relevan yang dikirim.',
  properties: {
    nomor_trayek: str('Nomor trayek untuk bus, angkot, atau shuttle.', {
      example: 'Koridor 3',
    }),
    rute_halte: arr(str('Nama halte.'), 'Urutan halte yang dilalui.'),
    tarif_tetap: num('Tarif tetap per penumpang dalam rupiah.', { example: 4900 }),
    interval_menit: int('Interval kedatangan dalam menit.', { example: 15 }),
    tarif_dasar: num('Tarif dasar taksi online dalam rupiah.', { example: 10000 }),
    tarif_per_km: num('Tarif per kilometer dalam rupiah.', { example: 4500 }),
    surge_multiplier: num('Pengali tarif saat permintaan tinggi.', { example: 1.2 }),
    tarif_per_hari: num('Tarif sewa per hari dalam rupiah.', { example: 450000 }),
    termasuk_driver: bool('Apakah sewa sudah termasuk driver.'),
    jenis_bahan_bakar: str('Jenis bahan bakar kendaraan.', { example: 'Bensin' }),
    kecepatan_rata_rata_km_jam: num('Kecepatan rata-rata pejalan kaki.', {
      example: 4.5,
    }),
    is_jalur_pedestrian_tersedia: bool('Apakah jalur pedestrian tersedia.'),
  },
}

const transportMode = {
  type: 'object',
  description: 'Moda transportasi beserta tarif dan wilayah layanan.',
  required: [
    'transportasi_id',
    'nama_moda',
    'jenis_transportasi',
    'kapasitas_penumpang',
    'status_aktif',
  ],
  properties: {
    transportasi_id: uuid('ID moda transportasi.'),
    wilayah_id: nullable(uuid('ID wilayah layanan.')),
    mitra_id: nullable(uuid('ID mitra pemilik armada.')),
    nama_moda: str('Nama moda atau armada.', { example: 'GoCar Bandung' }),
    jenis_transportasi: str('Jenis transportasi.', {
      enum: [
        'BUS',
        'ANGKOT',
        'ONLINE_TAXI',
        'ONLINE_MOTOR',
        'RENTAL',
        'PEDESTRIAN',
        'SHUTTLE',
      ],
      example: 'ONLINE_TAXI',
    }),
    kapasitas_penumpang: int('Kapasitas penumpang.', { example: 4 }),
    status_aktif: bool('Apakah moda sedang aktif.'),
    sumber_data: str('Sumber data moda.', { example: 'Mitra Portal' }),
    terakhir_diperbarui: dateTime('Waktu pembaruan terakhir.'),
    wilayah: nullable(ref('RegionSummary')),
    mitra: nullable(ref('PartnerSummary')),
    detail: ref('TransportDetail'),
  },
}

const partnerSummary = {
  type: 'object',
  description: 'Ringkasan mitra transportasi.',
  required: ['user_id', 'nama_perusahaan'],
  properties: {
    user_id: uuid('ID pengguna mitra.'),
    nama_perusahaan: str('Nama badan usaha.', {
      example: 'PT Bandung Jaya Tour',
    }),
  },
}

const review = {
  type: 'object',
  description: 'Ulasan pengunjung untuk satu tempat.',
  required: [
    'ulasan_id',
    'place_id',
    'nama_penulis',
    'skor_rating',
    'isi_komentar',
    'status_publikasi',
  ],
  properties: {
    ulasan_id: uuid('ID ulasan.'),
    place_id: uuid('ID tempat yang diulas.'),
    nama_penulis: str('Nama penulis yang ditampilkan.', {
      example: 'Rina Kartika',
    }),
    skor_rating: num('Nilai rating 1 sampai 5.', {
      minimum: 1,
      maximum: 5,
      example: 5,
    }),
    isi_komentar: str('Isi ulasan.', {
      example:
        'Bangunan ikonik dengan taman yang tertata. Tur museum informatif dan petugas ramah.',
    }),
    waktu_ulasan: dateTime('Waktu ulasan dibuat.'),
    status_publikasi: bool('Apakah ulasan sudah tampil untuk publik.'),
  },
}

const weather = {
  type: 'object',
  description: 'Konteks cuaca terkini untuk satu wilayah.',
  required: [
    'context_id',
    'wilayah_id',
    'nama_wilayah',
    'kondisi_cuaca',
    'suhu_celsius',
    'tingkat_curah_hujan',
    'terakhir_diperbarui',
  ],
  properties: {
    context_id: uuid('ID konteks lingkungan.'),
    wilayah_id: uuid('ID wilayah.'),
    nama_wilayah: str('Nama wilayah.', { example: 'Kota Bandung' }),
    kondisi_cuaca: str('Kondisi cuaca saat ini.', { example: 'Hujan Ringan' }),
    suhu_celsius: num('Suhu udara dalam derajat Celsius.', { example: 24.5 }),
    tingkat_curah_hujan: num('Curah hujan dalam milimeter per jam.', {
      example: 8.4,
    }),
    terakhir_diperbarui: dateTime('Waktu data cuaca diperbarui.'),
    status_data: str('Status kesegaran data cuaca.', {
      enum: ['segar', 'tertunda'],
      example: 'segar',
    }),
  },
}

const environmentContext = {
  type: 'object',
  description: 'Konteks cuaca dan lalu lintas untuk satu wilayah.',
  required: [
    'context_id',
    'wilayah_id',
    'kondisi_cuaca',
    'kondisi_lalu_lintas',
    'terakhir_diperbarui',
  ],
  properties: {
    context_id: uuid('ID konteks lingkungan.'),
    wilayah_id: uuid('ID wilayah.'),
    nama_wilayah: str('Nama wilayah.', { example: 'Kota Bandung' }),
    kondisi_cuaca: str('Kondisi cuaca.', { example: 'Hujan Ringan' }),
    suhu_celsius: num('Suhu udara dalam derajat Celsius.', { example: 24.5 }),
    tingkat_curah_hujan: num('Curah hujan dalam milimeter per jam.', {
      example: 8.4,
    }),
    kondisi_lalu_lintas: str('Kondisi lalu lintas.', { example: 'Padat' }),
    ada_insiden_kecelakaan: bool('Apakah ada insiden kecelakaan.'),
    rata_rata_kepadatan_jalan: num('Rata-rata kepadatan jalan dari 0 sampai 1.', {
      example: 0.72,
    }),
    terakhir_diperbarui: dateTime('Waktu pembaruan terakhir.'),
  },
}

const preferences = {
  type: 'object',
  description: 'Preferensi perjalanan untuk satu itinerary.',
  required: ['prioritas_utama', 'hindari_jalan_kaki_jauh', 'maksimal_transit'],
  properties: {
    preferensi_id: int('ID preferensi.', { example: 1 }),
    itinerary_id: uuid('ID itinerary.'),
    prioritas_utama: str('Prioritas utama perjalanan.', {
      enum: ['kecepatan', 'biaya', 'kenyamanan'],
      example: 'kenyamanan',
    }),
    hindari_jalan_kaki_jauh: bool('Apakah perjalanan jauh dengan kaki dihindari.'),
    maksimal_transit: int('Batas maksimal transit.', {
      minimum: 0,
      maximum: 5,
      example: 2,
    }),
    preferensi_biaya: str('Gaya biaya perjalanan.', {
      enum: ['hemat', 'standar', 'premium'],
      example: 'standar',
    }),
  },
}

const itinerarySummary = {
  type: 'object',
  description: 'Ringkasan itinerary milik wisatawan.',
  required: [
    'itinerary_id',
    'wisatawan_id',
    'judul_perjalanan',
    'tanggal_mulai',
    'tanggal_selesai',
    'jumlah_wisatawan',
    'total_anggaran',
    'status_rencana',
  ],
  properties: {
    itinerary_id: uuid('ID itinerary.'),
    wisatawan_id: uuid('ID wisatawan pemilik.'),
    start_place_id: nullable(uuid('ID tempat awal perjalanan.')),
    judul_perjalanan: str('Judul perjalanan.', {
      example: 'Bandung Heritage & Kuliner Weekend',
    }),
    tanggal_mulai: date('Tanggal mulai perjalanan.'),
    tanggal_selesai: date('Tanggal selesai perjalanan.'),
    jumlah_wisatawan: int('Jumlah wisatawan.', { minimum: 1, example: 2 }),
    total_anggaran: num('Total anggaran dalam rupiah.', { example: 1500000 }),
    status_rencana: str('Status itinerary.', {
      enum: ['draft', 'aktif', 'selesai', 'dibatalkan'],
      example: 'aktif',
    }),
    jumlah_destinasi: int('Jumlah destinasi pada itinerary.', { example: 3 }),
    total_estimasi_biaya: num('Total estimasi biaya rekomendasi teratas.', {
      example: 28000,
    }),
    preferensi: ref('Preferences'),
  },
}

const leg = {
  type: 'object',
  description: 'Satu segmen perjalanan dari satu perhentian.',
  required: [
    'leg_id',
    'plan_item_id',
    'urutan_leg',
    'instruksi_rute',
    'jarak_leg_km',
    'estimasi_durasi_menit',
    'biaya_leg',
  ],
  properties: {
    leg_id: uuid('ID segmen perjalanan.'),
    plan_item_id: uuid('ID perhentian pemilik segmen.'),
    transportasi_id: nullable(uuid('ID moda transportasi.')),
    urutan_leg: int('Urutan segmen dalam perhentian.', { example: 1 }),
    instruksi_rute: str('Instruksi perjalanan untuk pengguna.', {
      example: 'Jalan kaki 600 m dari Hotel Savoy Homann ke Halte Savoy.',
    }),
    jarak_leg_km: num('Jarak segmen dalam kilometer.', { example: 0.6 }),
    estimasi_durasi_menit: int('Estimasi durasi dalam menit.', { example: 7 }),
    biaya_leg: num('Biaya segmen dalam rupiah.', { example: 0 }),
    transportasi: ref('TransportSummary'),
  },
}

const transportSummary = {
  type: 'object',
  description: 'Ringkasan moda transportasi pada segmen.',
  properties: {
    transportasi_id: uuid('ID moda transportasi.'),
    nama_moda: str('Nama moda.', { example: 'Angkot Kalapa Dago 02' }),
    jenis_transportasi: str('Jenis transportasi.', { example: 'ANGKOT' }),
  },
}

const stop = {
  type: 'object',
  description: 'Perhentian pada itinerary beserta segmen perjalanannya.',
  required: [
    'plan_item_id',
    'itinerary_id',
    'place_id',
    'urutan',
    'waktu_mulai_rencana',
    'waktu_selesai_rencana',
  ],
  properties: {
    plan_item_id: uuid('ID perhentian.'),
    itinerary_id: uuid('ID itinerary.'),
    place_id: uuid('ID tempat.'),
    urutan: int('Urutan kunjungan.', { minimum: 1, example: 1 }),
    waktu_mulai_rencana: dateTime('Waktu mulai kunjungan.'),
    waktu_selesai_rencana: dateTime('Waktu selesai kunjungan.'),
    total_jarak_segment_km: num('Total jarak segmen dalam kilometer.', {
      example: 2.4,
    }),
    total_durasi_segment_menit: int('Total durasi segmen dalam menit.', {
      example: 15,
    }),
    total_biaya_segment: num('Total biaya segmen dalam rupiah.', {
      example: 8000,
    }),
    is_manual_selected: bool('Apakah perhentian dipilih manual oleh wisatawan.'),
    tempat: ref('PlaceSummary'),
    legs: arr(ref('Leg'), 'Segmen perjalanan menuju perhentian ini.'),
  },
}

const itineraryDetail = {
  allOf: [
    ref('ItinerarySummary'),
    {
      type: 'object',
      required: ['destinasi'],
      properties: {
        destinasi: arr(ref('Stop'), 'Daftar perhentian berurutan.'),
        rekomendasi_teratas: nullable(ref('RecommendationSummary')),
      },
    },
  ],
}

const recommendationSummary = {
  type: 'object',
  description: 'Ringkasan rekomendasi pada detail itinerary.',
  properties: {
    recommendation_id: uuid('ID rekomendasi.'),
    ranking: int('Peringkat rekomendasi.', { example: 1 }),
    total_estimated_cost: num('Estimasi biaya dalam rupiah.', { example: 28000 }),
    total_estimated_duration: int('Estimasi durasi dalam menit.', { example: 55 }),
    suitability_score: num('Skor kesesuaian dari 0 sampai 1.', { example: 0.94 }),
  },
}

const recommendation = {
  type: 'object',
  description: 'Rekomendasi perjalanan hasil perhitungan konteks.',
  required: [
    'recommendation_id',
    'itinerary_id',
    'ranking',
    'total_estimated_cost',
    'total_estimated_duration',
    'suitability_score',
    'generated_at',
  ],
  properties: {
    recommendation_id: uuid('ID rekomendasi.'),
    itinerary_id: uuid('ID itinerary.'),
    context_id: nullable(uuid('ID konteks yang dipakai.')),
    ranking: int('Peringkat rekomendasi.', { example: 1 }),
    total_estimated_cost: num('Estimasi biaya dalam rupiah.', { example: 28000 }),
    total_estimated_duration: int('Estimasi durasi dalam menit.', { example: 55 }),
    suitability_score: num('Skor kesesuaian dari 0 sampai 1.', { example: 0.94 }),
    comfort_score: num('Skor kenyamanan dari 0 sampai 1.', { example: 0.89 }),
    weather_impact_score: num('Skor dampak cuaca dari 0 sampai 1.', {
      example: 0.92,
    }),
    traffic_impact_score: num('Skor dampak lalu lintas dari 0 sampai 1.', {
      example: 0.81,
    }),
    catatan_konteks: str('Penjelasan faktor yang memengaruhi rekomendasi.', {
      example:
        'Rute ini memakai Angkot 02, TMB Koridor 3, dan shuttle tertutup. Hanya 1,5 km jalan kaki terbuka sehingga tetap aman saat hujan ringan.',
    }),
    generated_at: dateTime('Waktu rekomendasi dihitung.'),
    itinerary: ref('ItineraryReference'),
    konteks: ref('ContextReference'),
  },
}

const itineraryReference = {
  type: 'object',
  description: 'Ringkasan itinerary yang dipakai pada rekomendasi.',
  properties: {
    itinerary_id: uuid('ID itinerary.'),
    judul_perjalanan: str('Judul perjalanan.', {
      example: 'Bandung Heritage & Kuliner Weekend',
    }),
  },
}

const contextReference = {
  type: 'object',
  description: 'Ringkasan konteks yang dipakai pada rekomendasi.',
  properties: {
    context_id: uuid('ID konteks.'),
    kondisi_cuaca: str('Kondisi cuaca.', { example: 'Hujan Ringan' }),
    kondisi_lalu_lintas: str('Kondisi lalu lintas.', { example: 'Padat' }),
    tingkat_curah_hujan: num('Curah hujan dalam milimeter per jam.', {
      example: 8.4,
    }),
  },
}

const recommendationHistoryItem = {
  type: 'object',
  description: 'Satu baris riwayat rekomendasi.',
  required: [
    'recommendation_id',
    'itinerary_id',
    'judul_perjalanan',
    'ranking',
    'generated_at',
  ],
  properties: {
    recommendation_id: uuid('ID rekomendasi.'),
    itinerary_id: uuid('ID itinerary.'),
    judul_perjalanan: str('Judul perjalanan.', {
      example: 'Bandung Heritage & Kuliner Weekend',
    }),
    ranking: int('Peringkat rekomendasi.', { example: 1 }),
    total_estimated_cost: num('Estimasi biaya dalam rupiah.', { example: 28000 }),
    total_estimated_duration: int('Estimasi durasi dalam menit.', { example: 55 }),
    suitability_score: num('Skor kesesuaian dari 0 sampai 1.', { example: 0.94 }),
    kondisi_cuaca: str('Kondisi cuaca saat rekomendasi dibuat.', {
      example: 'Hujan Ringan',
    }),
    catatan_konteks: str('Penjelasan konteks rekomendasi.'),
    generated_at: dateTime('Waktu rekomendasi dibuat.'),
  },
}

const notification = {
  type: 'object',
  description: 'Notifikasi perjalanan untuk wisatawan.',
  required: [
    'notifikasi_id',
    'itinerary_id',
    'judul_peringatan',
    'pesan_kendala',
    'tingkat_urgensi',
    'waktu_dibuat',
    'is_dibaca',
  ],
  properties: {
    notifikasi_id: uuid('ID notifikasi.'),
    itinerary_id: uuid('ID itinerary.'),
    judul_peringatan: str('Judul peringatan.', {
      example: 'Hujan lebat di sektor Dago',
    }),
    pesan_kendala: str('Penjelasan kendala.', {
      example:
        'Curah hujan terpantau 14,5 mm per jam. Leg jalan kaki menuju Saung Angklung Udjo dialihkan ke shuttle tertutup.',
    }),
    jenis_pemicu: str('Pemicu notifikasi.', { example: 'cuaca_hujan' }),
    tingkat_urgensi: str('Tingkat urgensi.', {
      enum: ['info', 'peringatan', 'kritis'],
      example: 'peringatan',
    }),
    waktu_dibuat: dateTime('Waktu notifikasi dibuat.'),
    is_dibaca: bool('Apakah notifikasi sudah dibaca.'),
    itinerary: ref('ItineraryReference'),
  },
}

const auditLog = {
  type: 'object',
  description: 'Catatan aktivitas perubahan data.',
  required: [
    'log_id',
    'entitas_terdampak',
    'id_referensi',
    'aksi',
    'waktu_log',
  ],
  properties: {
    log_id: uuid('ID log.'),
    entitas_terdampak: str('Nama tabel atau entitas yang berubah.', {
      example: 'transportasi',
    }),
    id_referensi: uuid('ID data yang berubah.'),
    aksi: str('Jenis aksi.', {
      enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'VERIFY'],
      example: 'UPDATE',
    }),
    detail_perubahan: {
      type: 'object',
      description: 'Rincian nilai sebelum dan sesudah perubahan.',
      additionalProperties: true,
    },
    aktor_pelaksana: str('Nama pelaku perubahan.', { example: 'Dewi Lestari' }),
    waktu_log: dateTime('Waktu log dibuat.'),
  },
}

const routeGeometry = {
  type: 'object',
  description:
    'FeatureCollection GeoJSON berisi titik perhentian dan garis rute. Endpoint ini mengembalikan GeoJSON langsung, bukan amplop data.',
  required: ['type', 'features'],
  properties: {
    type: str('Tipe koleksi GeoJSON.', { enum: ['FeatureCollection'] }),
    features: arr(ref('GeoJsonFeature'), 'Daftar fitur titik dan garis rute.'),
  },
}

const geoJsonFeature = {
  type: 'object',
  description: 'Satu fitur GeoJSON.',
  required: ['type', 'geometry', 'properties'],
  properties: {
    type: str('Tipe fitur.', { enum: ['Feature'] }),
    geometry: ref('GeoJsonGeometry'),
    properties: {
      type: 'object',
      description: 'Properti fitur, misalnya jenis, urutan, dan nama moda.',
      additionalProperties: true,
    },
  },
}

const geoJsonGeometry = {
  oneOf: [
    {
      type: 'object',
      required: ['type', 'coordinates'],
      properties: {
        type: str('Tipe geometri titik.', { enum: ['Point'] }),
        coordinates: arr(num('Koordinat.'), 'Longitude dan latitude.', {
          minItems: 2,
          maxItems: 2,
        }),
      },
    },
    {
      type: 'object',
      required: ['type', 'coordinates'],
      properties: {
        type: str('Tipe geometri garis.', { enum: ['LineString'] }),
        coordinates: arr(
          arr(num('Koordinat.'), 'Pasangan longitude dan latitude.'),
          'Daftar titik garis.',
        ),
      },
    },
  ],
}

const availableMode = {
  allOf: [
    ref('TransportMode'),
    {
      type: 'object',
      properties: {
        cocok_dengan_preferensi: bool(
          'Apakah moda cocok dengan preferensi itinerary.',
        ),
        alasan: str('Alasan singkat hasil filter.', {
          example: 'Tarif tetap dan kapasitas cukup untuk 2 wisatawan.',
        }),
      },
    },
  ],
}

const availableModesResult = {
  type: 'object',
  description: 'Moda yang tersedia untuk itinerary setelah filter preferensi.',
  required: ['itinerary_id', 'preferensi', 'moda'],
  properties: {
    itinerary_id: uuid('ID itinerary.'),
    preferensi: ref('Preferences'),
    moda: arr(ref('AvailableMode'), 'Daftar moda yang tersedia.'),
    catatan: str('Catatan hasil filter.', {
      example:
        'Satu moda disembunyikan karena tidak aktif. Dua moda disarankan sesuai preferensi kenyamanan.',
    }),
  },
}

const strategyLeg = {
  type: 'object',
  description: 'Satu segmen pada alternatif strategi.',
  required: ['urutan_leg', 'nama_moda', 'instruksi_rute', 'biaya_leg'],
  properties: {
    urutan_leg: int('Urutan segmen.', { example: 1 }),
    nama_moda: str('Nama moda.', { example: 'GoCar Bandung' }),
    instruksi_rute: str('Instruksi perjalanan.', {
      example: 'Naik taksi online dari Gedung Sate ke Braga Citywalk.',
    }),
    jarak_leg_km: num('Jarak segmen dalam kilometer.', { example: 4.2 }),
    estimasi_durasi_menit: int('Estimasi durasi dalam menit.', { example: 15 }),
    biaya_leg: num('Biaya segmen dalam rupiah.', { example: 30000 }),
  },
}

const strategyAlternative = {
  type: 'object',
  description: 'Satu alternatif strategi perjalanan.',
  required: [
    'title',
    'total_estimasi_biaya',
    'total_estimasi_durasi_menit',
    'total_estimasi_jarak_km',
  ],
  properties: {
    title: str('Nama alternatif.', {
      example: 'Opsi 1: Transportasi Online (Taksi atau Mobil)',
    }),
    total_estimasi_biaya: num('Total estimasi biaya dalam rupiah.', {
      example: 75000,
    }),
    total_estimasi_durasi_menit: int('Total estimasi durasi dalam menit.', {
      example: 32,
    }),
    total_estimasi_jarak_km: num('Total estimasi jarak dalam kilometer.', {
      example: 11.4,
    }),
    legs: arr(ref('StrategyLeg'), 'Rincian segmen alternatif.'),
  },
}

const strategyComparison = {
  type: 'object',
  description: 'Perbandingan seluruh strategi perjalanan untuk itinerary.',
  required: ['itinerary_id', 'total_anggaran_limit', 'alternatives'],
  properties: {
    itinerary_id: uuid('ID itinerary.'),
    total_anggaran_limit: num('Batas anggaran itinerary dalam rupiah.', {
      example: 1500000,
    }),
    alternatives: arr(ref('StrategyAlternative'), 'Daftar alternatif strategi.'),
    catatan: str('Catatan perbandingan.', {
      example:
        'Alternatif transportasi online paling cepat, sedangkan transportasi umum paling hemat.',
    }),
  },
}

const recommendationFeedback = {
  type: 'object',
  description:
    'Umpan balik wisatawan untuk satu rekomendasi. Struktur ini adalah usulan perluasan karena tabel umpan balik belum ada di SQL.',
  required: ['feedback_id', 'recommendation_id', 'user_id', 'status_penerimaan'],
  properties: {
    feedback_id: uuid('ID umpan balik.'),
    recommendation_id: uuid('ID rekomendasi.'),
    user_id: uuid('ID wisatawan.'),
    status_penerimaan: str('Sikap wisatawan terhadap rekomendasi.', {
      enum: ['diterima', 'ditolak', 'netral'],
      example: 'diterima',
    }),
    skor_kepuasan: int('Skor kepuasan 1 sampai 5.', {
      minimum: 1,
      maximum: 5,
      example: 5,
    }),
    catatan: str('Catatan tambahan.', {
      example: 'Rute nyaman dan sesuai kebutuhan rombongan.',
    }),
    waktu_dibuat: dateTime('Waktu umpan balik dibuat.'),
  },
}

const dashboard = {
  type: 'object',
  description: 'Ringkasan operasional untuk halaman admin.',
  required: ['pengguna', 'mitra', 'wilayah', 'destinasi', 'itinerary'],
  properties: {
    pengguna: {
      type: 'object',
      properties: {
        total: int('Total pengguna.', { example: 8 }),
        wisatawan: int('Total wisatawan.', { example: 3 }),
        mitra: int('Total mitra.', { example: 3 }),
        admin: int('Total admin.', { example: 2 }),
      },
    },
    mitra: {
      type: 'object',
      properties: {
        total: int('Total mitra.', { example: 3 }),
        terverifikasi: int('Mitra terverifikasi.', { example: 2 }),
        menunggu_verifikasi: int('Mitra menunggu verifikasi.', { example: 1 }),
      },
    },
    wilayah: {
      type: 'object',
      properties: {
        total: int('Total wilayah.', { example: 4 }),
        cakupan_aktif: int('Wilayah dengan cakupan aktif.', { example: 3 }),
      },
    },
    destinasi: {
      type: 'object',
      properties: {
        total: int('Total destinasi.', { example: 12 }),
        populer: int('Destinasi populer.', { example: 10 }),
        rata_rata_rating: num('Rata-rata rating destinasi.', { example: 4.58 }),
      },
    },
    itinerary: {
      type: 'object',
      properties: {
        total: int('Total itinerary.', { example: 5 }),
        draft: int('Itinerary draft.', { example: 2 }),
        aktif: int('Itinerary aktif.', { example: 2 }),
        selesai: int('Itinerary selesai.', { example: 1 }),
        dibatalkan: int('Itinerary dibatalkan.', { example: 0 }),
      },
    },
    rekomendasi: {
      type: 'object',
      properties: {
        total: int('Total rekomendasi.', { example: 10 }),
        dihitung_hari_ini: int('Rekomendasi yang dihitung hari ini.', {
          example: 6,
        }),
      },
    },
    notifikasi: {
      type: 'object',
      properties: {
        total: int('Total notifikasi.', { example: 5 }),
        belum_dibaca: int('Notifikasi belum dibaca.', { example: 3 }),
      },
    },
    aktivitas_terbaru: arr(ref('AuditLog'), 'Aktivitas terbaru.'),
    diperbarui_pada: dateTime('Waktu ringkasan dibuat.'),
  },
}

const health = {
  type: 'object',
  description: 'Status kesehatan layanan.',
  required: ['status', 'service', 'version', 'waktu'],
  properties: {
    status: str('Status layanan.', { example: 'ok' }),
    service: str('Nama layanan.', { example: 'find-holiday-api' }),
    version: str('Versi kontrak.', { example: '1.0.0' }),
    waktu: dateTime('Waktu pemeriksaan.'),
    pemeriksaan: {
      type: 'object',
      properties: {
        database: str('Status basis data.', { example: 'ok' }),
        weather_service: str('Status layanan cuaca.', { example: 'ok' }),
        recommendation_engine: str('Status mesin rekomendasi.', {
          example: 'ok',
        }),
      },
    },
  },
}

const registerInput = {
  type: 'object',
  description: 'Data pendaftaran akun wisatawan atau mitra.',
  required: [
    'nama',
    'email',
    'password',
    'password_confirmation',
    'role',
  ],
  properties: {
    nama: str('Nama lengkap.', { example: 'Budi Santoso' }),
    email: str('Alamat email.', {
      format: 'email',
      example: 'budi.santoso@example.com',
    }),
    password: str('Kata sandi minimal 8 karakter.', {
      format: 'password',
      minLength: 8,
      example: 'SecurePassword123!',
    }),
    password_confirmation: str('Ulangi kata sandi.', {
      format: 'password',
      example: 'SecurePassword123!',
    }),
    nomor_telepon: str('Nomor telepon.', { example: '+6281234567890' }),
    role: str('Peran akun baru. Admin tidak dapat mendaftar dari publik.', {
      enum: ['tourist', 'partner'],
      example: 'tourist',
    }),
    preferensi_umum: str('Preferensi wisatawan, wajib untuk role tourist.', {
      example: 'Wisata Budaya & Kuliner',
    }),
    nama_perusahaan: str('Nama perusahaan, wajib untuk role partner.', {
      example: 'PT Contoh Wisata',
    }),
    legalitas_doc_url: str('URL dokumen legalitas mitra.', {
      example: '/docs/legalitas-contoh.txt',
    }),
  },
}

const loginInput = {
  type: 'object',
  description: 'Kredensial login.',
  required: ['email', 'password'],
  properties: {
    email: str('Alamat email terdaftar.', {
      format: 'email',
      example: 'alfian.hanif@example.com',
    }),
    password: str('Kata sandi.', {
      format: 'password',
      example: 'RahasiaDemo123!',
    }),
  },
}

const profileUpdateInput = {
  type: 'object',
  description:
    'Perubahan profil. Hanya field yang dikirim yang diubah. Peran tidak dapat diubah dari endpoint ini.',
  properties: {
    nama: str('Nama lengkap.', { example: 'Alfian Hanif' }),
    email: str('Alamat email.', {
      format: 'email',
      example: 'alfian.hanif@example.com',
    }),
    nomor_telepon: str('Nomor telepon.', { example: '+6281321001001' }),
    preferensi_umum: str('Preferensi wisatawan.', {
      example: 'Wisata Budaya & Kuliner',
    }),
    nama_perusahaan: str('Nama perusahaan mitra.', {
      example: 'PT Bandung Jaya Tour',
    }),
    legalitas_doc_url: str('URL dokumen legalitas mitra.', {
      example: '/docs/legalitas-bandung-jaya.txt',
    }),
  },
}

const passwordUpdateInput = {
  type: 'object',
  description: 'Perubahan kata sandi.',
  required: ['password_lama', 'password', 'password_confirmation'],
  properties: {
    password_lama: str('Kata sandi saat ini.', {
      format: 'password',
      example: 'RahasiaDemo123!',
    }),
    password: str('Kata sandi baru minimal 8 karakter.', {
      format: 'password',
      minLength: 8,
      example: 'RahasiaBaru456!',
    }),
    password_confirmation: str('Ulangi kata sandi baru.', {
      format: 'password',
      example: 'RahasiaBaru456!',
    }),
  },
}

const itineraryInput = {
  type: 'object',
  description: 'Data pembuatan itinerary beserta preferensi dan destinasi.',
  required: [
    'judul_perjalanan',
    'tanggal_mulai',
    'tanggal_selesai',
    'jumlah_wisatawan',
    'total_anggaran',
    'destinasi',
  ],
  properties: {
    judul_perjalanan: str('Judul perjalanan.', {
      example: 'Bandung Heritage & Kuliner Weekend',
    }),
    start_place_id: uuid('ID tempat awal perjalanan.'),
    tanggal_mulai: date('Tanggal mulai.'),
    tanggal_selesai: date('Tanggal selesai.'),
    jumlah_wisatawan: int('Jumlah wisatawan.', { minimum: 1, example: 2 }),
    total_anggaran: num('Total anggaran dalam rupiah.', {
      minimum: 0,
      example: 1500000,
    }),
    prioritas_utama: str('Prioritas utama perjalanan.', {
      enum: ['kecepatan', 'biaya', 'kenyamanan'],
      example: 'kenyamanan',
    }),
    hindari_jalan_kaki_jauh: bool('Hindari jalan kaki jauh.'),
    maksimal_transit: int('Batas maksimal transit.', {
      minimum: 0,
      maximum: 5,
      example: 2,
    }),
    preferensi_biaya: str('Gaya biaya perjalanan.', {
      enum: ['hemat', 'standar', 'premium'],
      example: 'standar',
    }),
    destinasi: arr(
      ref('ItineraryStopInput'),
      'Daftar destinasi berurutan. Minimal satu destinasi.',
    ),
  },
}

const itineraryStopInput = {
  type: 'object',
  description: 'Satu destinasi pada permintaan itinerary.',
  required: ['place_id', 'waktu_mulai_rencana', 'waktu_selesai_rencana'],
  properties: {
    place_id: uuid('ID tempat kunjungan.'),
    waktu_mulai_rencana: dateTime('Waktu mulai kunjungan.'),
    waktu_selesai_rencana: dateTime('Waktu selesai kunjungan.'),
  },
}

const stopsReorderInput = {
  type: 'object',
  description: 'Perubahan urutan perhentian itinerary.',
  required: ['destinasi'],
  properties: {
    destinasi: arr(ref('ReorderStopInput'), 'Daftar perhentian dengan urutan baru.'),
  },
}

const reorderStopInput = {
  type: 'object',
  description: 'Satu perhentian pada perubahan urutan.',
  required: ['plan_item_id', 'urutan'],
  properties: {
    plan_item_id: uuid('ID perhentian.'),
    urutan: int('Urutan baru.', { minimum: 1, example: 1 }),
  },
}

const fleetInput = {
  type: 'object',
  description: 'Data armada mitra.',
  required: ['nama_moda', 'jenis_transportasi', 'kapasitas_penumpang'],
  properties: {
    wilayah_id: uuid('ID wilayah layanan.'),
    nama_moda: str('Nama moda atau armada.', { example: 'GoCar Bandung' }),
    jenis_transportasi: str('Jenis transportasi.', {
      enum: [
        'BUS',
        'ANGKOT',
        'ONLINE_TAXI',
        'ONLINE_MOTOR',
        'RENTAL',
        'PEDESTRIAN',
        'SHUTTLE',
      ],
      example: 'ONLINE_TAXI',
    }),
    kapasitas_penumpang: int('Kapasitas penumpang.', {
      minimum: 1,
      example: 4,
    }),
    status_aktif: bool('Status aktif armada.'),
    sumber_data: str('Sumber data.', { example: 'Mitra Portal' }),
    detail: ref('TransportDetailInput'),
  },
}

const transportDetailInput = {
  type: 'object',
  description: 'Rincian tarif sesuai jenis transportasi.',
  properties: {
    nomor_trayek: str('Nomor trayek.', { example: 'Koridor 3' }),
    rute_halte: arr(str('Nama halte.'), 'Daftar halte.'),
    tarif_tetap: num('Tarif tetap dalam rupiah.', { example: 4900 }),
    interval_menit: int('Interval kedatangan dalam menit.', { example: 15 }),
    tarif_dasar: num('Tarif dasar dalam rupiah.', { example: 10000 }),
    tarif_per_km: num('Tarif per kilometer dalam rupiah.', { example: 4500 }),
    surge_multiplier: num('Pengali tarif.', { example: 1.2 }),
    tarif_per_hari: num('Tarif sewa per hari dalam rupiah.', { example: 450000 }),
    termasuk_driver: bool('Termasuk driver.'),
    jenis_bahan_bakar: str('Jenis bahan bakar.', { example: 'Bensin' }),
    kecepatan_rata_rata_km_jam: num('Kecepatan rata-rata pejalan kaki.', {
      example: 4.5,
    }),
    is_jalur_pedestrian_tersedia: bool('Jalur pedestrian tersedia.'),
  },
}

const transportModeInput = {
  allOf: [
    ref('FleetInput'),
    {
      type: 'object',
      properties: {
        mitra_id: uuid('ID mitra pemilik armada, diisi admin bila perlu.'),
      },
    },
  ],
}

const regionInput = {
  type: 'object',
  description: 'Data wilayah.',
  required: ['nama_wilayah', 'provinsi'],
  properties: {
    nama_wilayah: str('Nama wilayah.', { example: 'Kota Bandung' }),
    provinsi: str('Nama provinsi.', { example: 'Jawa Barat' }),
    boundary_coordinates: arr(
      arr(num('Koordinat.'), 'Pasangan longitude dan latitude.'),
      'Batas wilayah.',
    ),
    status_cakupan_aktif: bool('Status cakupan layanan.'),
  },
}

const placeInput = {
  type: 'object',
  description: 'Data tempat kunjungan dan detail destinasi.',
  required: [
    'wilayah_id',
    'nama_tempat',
    'alamat_lengkap',
    'latitude',
    'longitude',
    'kategori_wisata',
  ],
  properties: {
    wilayah_id: uuid('ID wilayah.'),
    nama_tempat: str('Nama tempat.', { example: 'Gedung Sate' }),
    alamat_lengkap: str('Alamat lengkap.', {
      example: 'Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan',
    }),
    latitude: num('Koordinat lintang.', { example: -6.902484 }),
    longitude: num('Koordinat bujur.', { example: 107.618765 }),
    jam_buka: str('Jam buka.', { example: '08:00' }),
    jam_tutup: str('Jam tutup.', { example: '16:00' }),
    daftar_foto_url: arr(str('URL foto.'), 'Daftar URL foto.'),
    kategori_wisata: str('Kategori wisata.', { example: 'sejarah' }),
    estimasi_durasi_kunjungan: int('Estimasi durasi kunjungan dalam menit.', {
      example: 90,
    }),
    harga_tiket_masuk: num('Harga tiket masuk dalam rupiah.', { example: 5000 }),
  },
}

const facilityInput = {
  type: 'object',
  description: 'Data fasilitas pada tempat.',
  required: ['jenis', 'is_gratis', 'fasilitas_tersedia'],
  properties: {
    jenis: str('Jenis fasilitas.', {
      enum: [
        'TEMPAT_IBADAH',
        'RESTORAN_KULINER',
        'TOILET_UMUM',
        'HOTEL_PENGINAPAN',
        'SPBU',
        'ATM',
      ],
      example: 'ATM',
    }),
    is_gratis: bool('Fasilitas gratis.'),
    fasilitas_tersedia: arr(str('Nama fasilitas.'), 'Daftar fasilitas.'),
  },
}

const contextInput = {
  type: 'object',
  description: 'Data konteks cuaca dan lalu lintas wilayah.',
  required: ['wilayah_id', 'kondisi_cuaca', 'kondisi_lalu_lintas'],
  properties: {
    wilayah_id: uuid('ID wilayah.'),
    kondisi_cuaca: str('Kondisi cuaca.', { example: 'Hujan Ringan' }),
    suhu_celsius: num('Suhu dalam derajat Celsius.', { example: 24.5 }),
    tingkat_curah_hujan: num('Curah hujan dalam milimeter per jam.', {
      example: 8.4,
    }),
    kondisi_lalu_lintas: str('Kondisi lalu lintas.', { example: 'Padat' }),
    ada_insiden_kecelakaan: bool('Ada insiden kecelakaan.'),
    rata_rata_kepadatan_jalan: num('Kepadatan jalan dari 0 sampai 1.', {
      example: 0.72,
    }),
  },
}

const reviewInput = {
  type: 'object',
  description: 'Ulasan baru untuk destinasi.',
  required: ['skor_rating', 'isi_komentar'],
  properties: {
    skor_rating: num('Nilai rating 1 sampai 5.', {
      minimum: 1,
      maximum: 5,
      example: 5,
    }),
    isi_komentar: str('Isi ulasan.', {
      minLength: 10,
      maxLength: 2000,
      example:
        'Bangunan ikonik dengan taman yang tertata. Tur museum informatif dan petugas ramah.',
    }),
  },
}

const reviewModerationInput = {
  type: 'object',
  description: 'Keputusan moderasi ulasan.',
  required: ['status_publikasi'],
  properties: {
    status_publikasi: bool('Apakah ulasan dipublikasikan.'),
    catatan_moderasi: str('Catatan moderator.', {
      example: 'Ulasan sudah diperiksa dan layak tampil.',
    }),
  },
}

const userUpdateInput = {
  type: 'object',
  description: 'Perubahan data pengguna oleh admin.',
  properties: {
    nama: str('Nama lengkap.', { example: 'Salsabila Putri' }),
    email: str('Alamat email.', {
      format: 'email',
      example: 'salsabila.putri@example.com',
    }),
    nomor_telepon: str('Nomor telepon.', { example: '+6281321001002' }),
    role: str('Peran pengguna.', {
      enum: ['tourist', 'partner', 'admin'],
      example: 'tourist',
    }),
  },
}

const partnerVerificationInput = {
  type: 'object',
  description: 'Keputusan verifikasi mitra.',
  required: ['status_verifikasi'],
  properties: {
    status_verifikasi: bool('Apakah mitra diverifikasi.'),
    catatan: str('Catatan verifikasi.', {
      example: 'Dokumen legalitas lengkap dan sesuai.',
    }),
  },
}

export const schemas = {
  Meta: meta,
  ErrorDetail: errorDetail,
  Error: error,
  ErrorEnvelope: errorEnvelope,
  UserProfile: userProfile,
  User: user,
  AuthSession: authSession,
  RegionSummary: regionSummary,
  Region: region,
  Facility: facility,
  PlaceSummary: placeSummary,
  Destination: destination,
  PartnerSummary: partnerSummary,
  TransportDetail: transportDetail,
  TransportSummary: transportSummary,
  TransportMode: transportMode,
  Review: review,
  Weather: weather,
  EnvironmentContext: environmentContext,
  Preferences: preferences,
  ItinerarySummary: itinerarySummary,
  ItineraryDetail: itineraryDetail,
  RecommendationSummary: recommendationSummary,
  Recommendation: recommendation,
  ItineraryReference: itineraryReference,
  ContextReference: contextReference,
  RecommendationHistoryItem: recommendationHistoryItem,
  Notification: notification,
  AuditLog: auditLog,
  Leg: leg,
  Stop: stop,
  RouteGeometry: routeGeometry,
  GeoJsonFeature: geoJsonFeature,
  GeoJsonGeometry: geoJsonGeometry,
  AvailableMode: availableMode,
  AvailableModesResult: availableModesResult,
  StrategyLeg: strategyLeg,
  StrategyAlternative: strategyAlternative,
  StrategyComparison: strategyComparison,
  RecommendationFeedback: recommendationFeedback,
  Dashboard: dashboard,
  Health: health,
  RegisterInput: registerInput,
  LoginInput: loginInput,
  ProfileUpdateInput: profileUpdateInput,
  PasswordUpdateInput: passwordUpdateInput,
  ItineraryInput: itineraryInput,
  ItineraryStopInput: itineraryStopInput,
  StopsReorderInput: stopsReorderInput,
  ReorderStopInput: reorderStopInput,
  FleetInput: fleetInput,
  TransportDetailInput: transportDetailInput,
  TransportModeInput: transportModeInput,
  RegionInput: regionInput,
  PlaceInput: placeInput,
  FacilityInput: facilityInput,
  ContextInput: contextInput,
  ReviewInput: reviewInput,
  ReviewModerationInput: reviewModerationInput,
  UserUpdateInput: userUpdateInput,
  PartnerVerificationInput: partnerVerificationInput,
}

export { ref }
