import {
  IDS,
  itineraryDetail,
  itinerarySummary,
  itinerarySummary2,
  itineraries,
  list,
  listMeta,
  notifications,
  preference,
  recommendations,
  recommendationsHistory,
  stops,
  transportModes,
} from './data.mjs'
import { ref } from './schemas.mjs'
import {
  badRequest,
  conflict,
  custom,
  detail,
  empty,
  err,
  eventStream,
  forbidden,
  internal,
  list as listResponse,
  notFound,
  pageQuery,
  pathId,
  protectedErrors,
  query,
  rateLimited,
  sortQuery,
  unauthenticated,
  upstream,
  validation,
} from './helpers.mjs'

const itineraryListExample = list(itineraries, listMeta(2, 10, 1))

const createdItineraryExample = {
  data: {
    ...itineraryDetail,
    itinerary_id: 'c1000000-0000-4000-8000-000000000099',
    judul_perjalanan: 'Bandung Heritage & Kuliner Weekend',
  },
  message: 'Itinerary berhasil dibuat dan rekomendasi mulai dihitung.',
}

const routeGeometryExample = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [107.6101, -6.9212],
      },
      properties: {
        kind: 'waypoint',
        plan_item_id: IDS.stop1,
        urutan: 1,
        nama_tempat: 'Hotel Savoy Homann',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [107.6101, -6.9212],
          [107.6128, -6.918],
          [107.6162, -6.9101],
          [107.6188, -6.9025],
        ],
      },
      properties: {
        kind: 'leg',
        leg_id: IDS.leg1,
        urutan_leg: 1,
        nama_moda: 'Trotoar Dago Heritage',
        jenis_transportasi: 'PEDESTRIAN',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [107.6188, -6.9025],
      },
      properties: {
        kind: 'waypoint',
        plan_item_id: IDS.stop1,
        urutan: 1,
        nama_tempat: 'Gedung Sate',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [107.6188, -6.9025],
          [107.6172, -6.9085],
          [107.6136, -6.914],
          [107.6098, -6.9175],
        ],
      },
      properties: {
        kind: 'leg',
        leg_id: IDS.leg2,
        urutan_leg: 2,
        nama_moda: 'Angkot Kalapa Dago 02',
        jenis_transportasi: 'ANGKOT',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [107.6098, -6.9175],
      },
      properties: {
        kind: 'waypoint',
        plan_item_id: IDS.stop2,
        urutan: 2,
        nama_tempat: 'Braga Heritage Walk',
      },
    },
  ],
}

const availableModesExample = {
  data: {
    itinerary_id: IDS.itinerary,
    preferensi: preference,
    moda: [
      {
        ...transportModes[0],
        cocok_dengan_preferensi: true,
        alasan: 'Tarif tetap dan kapasitas cukup untuk 2 wisatawan.',
      },
      {
        ...transportModes[2],
        cocok_dengan_preferensi: true,
        alasan: 'Waktu tempuh singkat dan terlindung dari hujan.',
      },
      {
        ...transportModes[1],
        cocok_dengan_preferensi: false,
        alasan: 'Paparan luar ruang lebih tinggi dari batas kenyamanan.',
      },
    ],
    catatan:
      'Satu moda disembunyikan karena tidak aktif. Dua moda disarankan sesuai preferensi kenyamanan.',
  },
}

const comparisonExample = {
  data: {
    itinerary_id: IDS.itinerary,
    total_anggaran_limit: 1500000,
    alternatives: [
      {
        title: 'Opsi 1: Transportasi Online (Taksi atau Mobil)',
        total_estimasi_biaya: 75000,
        total_estimasi_durasi_menit: 32,
        total_estimasi_jarak_km: 11.4,
        legs: [
          {
            urutan_leg: 1,
            nama_moda: 'GoCar Bandung',
            instruksi_rute:
              'Naik taksi online dari Gedung Sate ke Braga Citywalk.',
            jarak_leg_km: 4.2,
            estimasi_durasi_menit: 15,
            biaya_leg: 30000,
          },
        ],
      },
      {
        title: 'Opsi 2: Transportasi Umum (Bus Trans Metro)',
        total_estimasi_biaya: 9800,
        total_estimasi_durasi_menit: 58,
        total_estimasi_jarak_km: 12.1,
        legs: [
          {
            urutan_leg: 1,
            nama_moda: 'Jalan Kaki ke Halte',
            instruksi_rute: 'Jalan kaki 300 m ke Halte Gasibu.',
            jarak_leg_km: 0.3,
            estimasi_durasi_menit: 5,
            biaya_leg: 0,
          },
          {
            urutan_leg: 2,
            nama_moda: 'Trans Metro Bandung Koridor 3',
            instruksi_rute:
              'Naik TMB Koridor 3 dan turun di Halte Alun-Alun.',
            jarak_leg_km: 3.8,
            estimasi_durasi_menit: 25,
            biaya_leg: 4900,
          },
        ],
      },
    ],
    catatan:
      'Alternatif transportasi online paling cepat, sedangkan transportasi umum paling hemat.',
  },
}

const calculationExample = {
  data: recommendations,
  message: 'Rekomendasi berhasil dihitung ulang.',
  meta: {
    context_id: IDS.contextBandung,
    generated_at: '2026-10-30 15:58:00',
    dipicu_oleh: 'perubahan_urutan_destinasi',
  },
}

const feedbackExample = {
  data: {
    feedback_id: 'fb100000-0000-4000-8000-000000000001',
    recommendation_id: IDS.recommendation,
    user_id: IDS.tourist,
    status_penerimaan: 'diterima',
    skor_kepuasan: 5,
    catatan: 'Rute nyaman dan sesuai kebutuhan rombongan.',
    waktu_dibuat: '2026-10-30 16:02:00',
  },
  message: 'Umpan balik berhasil disimpan.',
}

const markedReadExample = {
  data: {
    ...notifications[0],
    is_dibaca: true,
  },
  message: 'Notifikasi ditandai sudah dibaca.',
}

const markAllReadExample = {
  data: {
    jumlah_diperbarui: 2,
  },
  message: 'Semua notifikasi ditandai sudah dibaca.',
}

const historyExample = list(recommendationsHistory, listMeta(2, 10, 1))

const alertsExample = list(notifications, listMeta(2, 10, 1))

const sseExample = `event: mobility_alert
data: {"notifikasi_id":"a3000000-0000-4000-8000-000000000001","judul_peringatan":"Hujan lebat di sektor Dago","pesan_kendala":"Curah hujan terpantau 14,5 mm per jam. Leg jalan kaki menuju Saung Angklung Udjo dialihkan ke shuttle tertutup.","tingkat_urgensi":"peringatan","waktu_dibuat":"2026-10-30 14:20:00"}

event: ping
data: {"waktu":"2026-10-30 15:58:30"}`

export const touristEndpoints = [
  {
    method: 'get',
    path: '/itineraries',
    operationId: 'listItineraries',
    tag: 'Itinerary',
    summary: 'Daftar itinerary wisatawan',
    description:
      'Menampilkan itinerary milik wisatawan yang sedang masuk. Admin memakai endpoint /admin/itineraries untuk melihat seluruh itinerary.',
    roles: ['tourist'],
    kf: ['KF-10'],
    parameters: [
      query('status_rencana', 'Filter status itinerary.', {
        type: 'string',
        enum: ['draft', 'aktif', 'selesai', 'dibatalkan'],
      }, 'aktif'),
      sortQuery(['terbaru', 'tanggal_mulai', 'judul']),
      ...pageQuery(),
    ],
    success: listResponse(
      200,
      'Daftar itinerary berhasil diambil.',
      'ItinerarySummary',
      itineraryListExample,
    ),
    errors: [
      unauthenticated(),
      forbidden('Hanya wisatawan yang memiliki daftar itinerary pribadi.'),
      badRequest('Filter status itinerary tidak valid.'),
      internal(),
    ],
  },
  {
    method: 'post',
    path: '/itineraries',
    operationId: 'createItinerary',
    tag: 'Itinerary',
    summary: 'Buat itinerary',
    description:
      'Membuat itinerary, preferensi perjalanan, dan daftar perhentian dalam satu transaksi. Setelah data tersimpan, sistem menjalankan perhitungan rekomendasi awal.',
    roles: ['tourist'],
    kf: ['KF-08', 'KF-28'],
    body: {
      required: true,
      schema: ref('ItineraryInput'),
      example: {
        judul_perjalanan: 'Bandung Heritage & Kuliner Weekend',
        start_place_id: IDS.hotelSavoy,
        tanggal_mulai: '2026-11-14',
        tanggal_selesai: '2026-11-15',
        jumlah_wisatawan: 2,
        total_anggaran: 1500000,
        prioritas_utama: 'kenyamanan',
        hindari_jalan_kaki_jauh: true,
        maksimal_transit: 2,
        preferensi_biaya: 'standar',
        destinasi: [
          {
            place_id: IDS.gedungSate,
            waktu_mulai_rencana: '2026-11-14 09:00:00',
            waktu_selesai_rencana: '2026-11-14 11:00:00',
          },
          {
            place_id: IDS.braga,
            waktu_mulai_rencana: '2026-11-14 12:30:00',
            waktu_selesai_rencana: '2026-11-14 14:00:00',
          },
        ],
      },
      description:
        'Data itinerary, preferensi, dan destinasi berurutan. Minimal satu destinasi.',
    },
    success: detail(
      201,
      'Itinerary berhasil dibuat.',
      'ItineraryDetail',
      createdItineraryExample,
    ),
    errors: [
      unauthenticated(),
      forbidden('Hanya wisatawan yang dapat membuat itinerary.'),
      validation('Data itinerary belum lengkap atau formatnya belum benar.', [
        { field: 'tanggal_selesai', message: 'Tanggal selesai tidak boleh sebelum tanggal mulai.' },
        { field: 'destinasi', message: 'Minimal satu destinasi harus dipilih.' },
      ]),
      notFound('Tempat awal atau destinasi yang dipilih tidak ditemukan.'),
      rateLimited('Terlalu banyak permintaan pembuatan itinerary.'),
      internal(),
    ],
  },
  {
    method: 'get',
    path: '/itineraries/{id}',
    operationId: 'getItinerary',
    tag: 'Itinerary',
    summary: 'Detail itinerary',
    description:
      'Menampilkan itinerary beserta preferensi, perhentian berurutan, segmen perjalanan, dan rekomendasi teratas.',
    roles: ['tourist'],
    kf: ['KF-10'],
    parameters: [pathId('id', IDS.itinerary)],
    success: detail(200, 'Detail itinerary berhasil diambil.', 'ItineraryDetail', {
      data: itineraryDetail,
    }),
    errors: [
      unauthenticated(),
      forbidden('Itinerary ini bukan milik akun yang sedang masuk.'),
      notFound('Itinerary tidak ditemukan.'),
      internal(),
    ],
  },
  {
    method: 'put',
    path: '/itineraries/{id}',
    operationId: 'updateItinerary',
    tag: 'Itinerary',
    summary: 'Ubah itinerary',
    description:
      'Memperbarui data itinerary, preferensi, dan urutan destinasi. Perubahan memicu perhitungan ulang rekomendasi sesuai KF-28.',
    roles: ['tourist'],
    kf: ['KF-09', 'KF-28'],
    parameters: [pathId('id', IDS.itinerary)],
    body: {
      required: true,
      schema: ref('ItineraryInput'),
      example: {
        judul_perjalanan: 'Bandung Heritage & Kuliner Weekend',
        start_place_id: IDS.hotelSavoy,
        tanggal_mulai: '2026-11-14',
        tanggal_selesai: '2026-11-15',
        jumlah_wisatawan: 2,
        total_anggaran: 1750000,
        prioritas_utama: 'kecepatan',
        hindari_jalan_kaki_jauh: true,
        maksimal_transit: 2,
        preferensi_biaya: 'standar',
        destinasi: [
          {
            place_id: IDS.braga,
            waktu_mulai_rencana: '2026-11-14 09:00:00',
            waktu_selesai_rencana: '2026-11-14 11:00:00',
          },
          {
            place_id: IDS.gedungSate,
            waktu_mulai_rencana: '2026-11-14 12:30:00',
            waktu_selesai_rencana: '2026-11-14 14:00:00',
          },
        ],
      },
      description:
        'Data itinerary lengkap. Daftar destinasi dianggap sebagai urutan baru.',
    },
    success: detail(200, 'Itinerary berhasil diperbarui.', 'ItineraryDetail', {
      data: {
        ...itineraryDetail,
        total_anggaran: 1750000,
        preferensi: {
          ...preference,
          prioritas_utama: 'kecepatan',
        },
      },
      message: 'Itinerary berhasil diperbarui dan rekomendasi dihitung ulang.',
    }),
    errors: [
      unauthenticated(),
      forbidden('Itinerary ini bukan milik akun yang sedang masuk.'),
      notFound('Itinerary atau destinasi yang dipilih tidak ditemukan.'),
      validation('Data perubahan itinerary belum lengkap atau tidak konsisten.', [
        { field: 'tanggal_selesai', message: 'Tanggal selesai tidak boleh sebelum tanggal mulai.' },
      ]),
      conflict(
        'ITINERARY_LOCKED',
        'Itinerary yang sudah selesai atau dibatalkan tidak dapat diubah.',
      ),
      internal(),
    ],
  },
  {
    method: 'delete',
    path: '/itineraries/{id}',
    operationId: 'deleteItinerary',
    tag: 'Itinerary',
    summary: 'Hapus itinerary',
    description:
      'Menghapus itinerary beserta preferensi, perhentian, segmen perjalanan, rekomendasi, dan notifikasi terkait melalui aturan cascade.',
    roles: ['tourist'],
    kf: ['KF-12'],
    parameters: [pathId('id', IDS.itinerary)],
    success: empty(204, 'Itinerary berhasil dihapus. Tidak ada isi respons.'),
    errors: [
      unauthenticated(),
      forbidden('Itinerary ini bukan milik akun yang sedang masuk.'),
      notFound('Itinerary tidak ditemukan.'),
      conflict(
        'ITINERARY_ACTIVE',
        'Itinerary yang sedang aktif harus diselesaikan atau dibatalkan sebelum dihapus.',
      ),
      internal(),
    ],
  },
  {
    method: 'put',
    path: '/itineraries/{id}/stops',
    operationId: 'reorderItineraryStops',
    tag: 'Itinerary',
    summary: 'Ubah urutan perhentian',
    description:
      'Mengubah urutan perhentian tanpa mengubah data itinerary lain. Setelah urutan tersimpan, rekomendasi dihitung ulang.',
    roles: ['tourist'],
    kf: ['KF-09', 'KF-28'],
    parameters: [pathId('id', IDS.itinerary)],
    body: {
      required: true,
      schema: ref('StopsReorderInput'),
      example: {
        destinasi: [
          { plan_item_id: IDS.stop2, urutan: 1 },
          { plan_item_id: IDS.stop1, urutan: 2 },
          { plan_item_id: IDS.stop3, urutan: 3 },
        ],
      },
      description: 'Daftar perhentian dengan urutan baru.',
    },
    success: detail(
      200,
      'Urutan perhentian berhasil diperbarui.',
      'ItineraryDetail',
      {
        data: {
          ...itineraryDetail,
          destinasi: [stops[1], stops[0], stops[2]],
        },
        message:
          'Urutan perhentian berhasil diperbarui dan rekomendasi dihitung ulang.',
      },
    ),
    errors: [
      unauthenticated(),
      forbidden('Itinerary ini bukan milik akun yang sedang masuk.'),
      notFound('Itinerary atau perhentian tidak ditemukan.'),
      validation('Daftar urutan perhentian tidak lengkap atau berisi duplikat.', [
        { field: 'destinasi', message: 'Setiap perhentian harus muncul tepat satu kali.' },
      ]),
      conflict(
        'ITINERARY_LOCKED',
        'Urutan perhentian pada itinerary yang sudah selesai tidak dapat diubah.',
      ),
      internal(),
    ],
  },
  {
    method: 'get',
    path: '/itineraries/{id}/route-geometry',
    operationId: 'getRouteGeometry',
    tag: 'Itinerary',
    summary: 'Geometri rute peta',
    description:
      'Mengembalikan GeoJSON FeatureCollection berisi titik perhentian dan garis rute antar perhentian. Respons ini memakai format GeoJSON langsung, bukan amplop data.',
    roles: ['tourist'],
    kf: ['KF-11'],
    parameters: [pathId('id', IDS.itinerary)],
    success: custom(
      200,
      'Geometri rute berhasil diambil.',
      ref('RouteGeometry'),
      routeGeometryExample,
    ),
    errors: [
      unauthenticated(),
      forbidden('Itinerary ini bukan milik akun yang sedang masuk.'),
      notFound('Itinerary tidak ditemukan.'),
      conflict(
        'ROUTE_NOT_READY',
        'Rute belum dapat digambar karena itinerary belum memiliki cukup perhentian.',
      ),
      internal(),
    ],
  },
  {
    method: 'get',
    path: '/itineraries/{id}/available-modes',
    operationId: 'listAvailableModes',
    tag: 'Transportasi',
    summary: 'Moda yang tersedia untuk itinerary',
    description:
      'Menampilkan moda transportasi yang sesuai dengan preferensi itinerary, lengkap dengan alasan filter dan rincian tarif.',
    roles: ['tourist'],
    kf: ['KF-20', 'KF-21'],
    parameters: [pathId('id', IDS.itinerary)],
    success: detail(
      200,
      'Moda transportasi yang tersedia berhasil diambil.',
      'AvailableModesResult',
      availableModesExample,
    ),
    errors: [
      unauthenticated(),
      forbidden('Itinerary ini bukan milik akun yang sedang masuk.'),
      notFound('Itinerary tidak ditemukan.'),
      conflict(
        'NO_AVAILABLE_MODES',
        'Tidak ada moda transportasi yang sesuai dengan preferensi saat ini.',
      ),
      internal(),
    ],
  },
  {
    method: 'get',
    path: '/itineraries/{id}/strategies/compare',
    operationId: 'compareStrategies',
    tag: 'Rekomendasi dan Riwayat',
    summary: 'Bandingkan strategi perjalanan',
    description:
      'Membandingkan seluruh alternatif strategi berdasarkan total biaya, durasi, dan jarak. Data diambil dari rekomendasi yang tersimpan.',
    roles: ['tourist'],
    kf: ['KF-22', 'KF-23', 'KF-24', 'KF-25'],
    parameters: [pathId('id', IDS.itinerary)],
    success: detail(
      200,
      'Perbandingan strategi berhasil diambil.',
      'StrategyComparison',
      comparisonExample,
    ),
    errors: [
      unauthenticated(),
      forbidden('Itinerary ini bukan milik akun yang sedang masuk.'),
      notFound('Itinerary atau rekomendasi tidak ditemukan.'),
      validation('Itinerary belum memiliki cukup data untuk dibandingkan.', [
        { field: 'itinerary_id', message: 'Rekomendasi belum tersedia.' },
      ]),
      upstream('Mesin rekomendasi sedang tidak tersedia.'),
      internal(),
    ],
  },
  {
    method: 'post',
    path: '/itineraries/{id}/recommendations/calculate',
    operationId: 'calculateRecommendations',
    tag: 'Rekomendasi dan Riwayat',
    summary: 'Hitung ulang rekomendasi',
    description:
      'Menjalankan ulang perhitungan rekomendasi untuk itinerary. Sistem mengambil konteks cuaca dan lalu lintas terbaru, memanggil mesin rekomendasi, lalu mengganti rekomendasi lama dengan hasil baru.',
    roles: ['tourist'],
    kf: ['KF-26', 'KF-28', 'KF-31', 'KF-32'],
    parameters: [pathId('id', IDS.itinerary)],
    body: {
      required: false,
      schema: {
        type: 'object',
        properties: {
          pemicu: {
            type: 'string',
            description: 'Alasan perhitungan ulang.',
            enum: ['manual', 'perubahan_itinerary', 'perubahan_konteks'],
            example: 'manual',
          },
          gunakan_konteks_terbaru: {
            type: 'boolean',
            description: 'Apakah konteks terbaru wajib dipakai.',
            example: true,
          },
        },
      },
      example: {
        pemicu: 'manual',
        gunakan_konteks_terbaru: true,
      },
      description:
        'Opsional. Bila kosong, sistem memakai pemicu manual dan konteks terbaru.',
    },
    success: custom(
      200,
      'Rekomendasi berhasil dihitung ulang.',
      {
        type: 'object',
        required: ['data', 'meta'],
        properties: {
          data: {
            type: 'array',
            items: ref('Recommendation'),
          },
          message: { type: 'string' },
          meta: {
            type: 'object',
            properties: {
              context_id: { type: 'string', format: 'uuid' },
              generated_at: { type: 'string' },
              dipicu_oleh: { type: 'string' },
            },
          },
        },
      },
      calculationExample,
    ),
    errors: [
      unauthenticated(),
      forbidden('Itinerary ini bukan milik akun yang sedang masuk.'),
      notFound('Itinerary tidak ditemukan.'),
      validation('Itinerary belum memiliki destinasi atau preferensi yang cukup.', [
        { field: 'destinasi', message: 'Tambahkan minimal satu destinasi.' },
      ]),
      rateLimited('Perhitungan ulang terlalu sering. Tunggu beberapa saat.'),
      upstream('Mesin rekomendasi atau layanan cuaca sedang tidak tersedia.'),
      internal(),
    ],
  },
  {
    method: 'get',
    path: '/itineraries/{id}/recommendations',
    operationId: 'listItineraryRecommendations',
    tag: 'Rekomendasi dan Riwayat',
    summary: 'Daftar rekomendasi itinerary',
    description:
      'Menampilkan rekomendasi yang tersimpan untuk satu itinerary, diurutkan berdasarkan peringkat.',
    roles: ['tourist'],
    kf: ['KF-26', 'KF-27'],
    parameters: [pathId('id', IDS.itinerary)],
    success: listResponse(
      200,
      'Daftar rekomendasi berhasil diambil.',
      'Recommendation',
      list(recommendations, listMeta(2, 10, 1)),
    ),
    errors: [
      unauthenticated(),
      forbidden('Itinerary ini bukan milik akun yang sedang masuk.'),
      notFound('Itinerary tidak ditemukan.'),
      internal(),
    ],
  },
  {
    method: 'get',
    path: '/recommendations/{id}',
    operationId: 'getRecommendation',
    tag: 'Rekomendasi dan Riwayat',
    summary: 'Detail rekomendasi',
    description:
      'Menampilkan rincian skor, biaya, durasi, dan penjelasan konteks untuk satu rekomendasi.',
    roles: ['tourist'],
    kf: ['KF-27', 'KF-31', 'KF-32'],
    parameters: [pathId('id', IDS.recommendation)],
    success: detail(
      200,
      'Detail rekomendasi berhasil diambil.',
      'Recommendation',
      { data: recommendations[0] },
    ),
    errors: [
      unauthenticated(),
      forbidden('Rekomendasi ini bukan milik itinerary akun yang sedang masuk.'),
      notFound('Rekomendasi tidak ditemukan.'),
      internal(),
    ],
  },
  {
    method: 'post',
    path: '/recommendations/{id}/feedback',
    operationId: 'createRecommendationFeedback',
    tag: 'Rekomendasi dan Riwayat',
    summary: 'Kirim umpan balik rekomendasi',
    description:
      'Menyimpan sikap wisatawan terhadap rekomendasi. Endpoint dan struktur data ini adalah usulan perluasan karena tabel umpan balik belum ada pada SQL saat ini. Lihat dokumen pemetaan basis data untuk rancangan tabelnya.',
    roles: ['tourist'],
    proposed: true,
    kf: ['KF-33'],
    parameters: [pathId('id', IDS.recommendation)],
    body: {
      required: true,
      schema: {
        type: 'object',
        required: ['status_penerimaan'],
        properties: {
          status_penerimaan: {
            type: 'string',
            enum: ['diterima', 'ditolak', 'netral'],
            description: 'Sikap wisatawan terhadap rekomendasi.',
            example: 'diterima',
          },
          skor_kepuasan: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
            description: 'Skor kepuasan 1 sampai 5.',
            example: 5,
          },
          catatan: {
            type: 'string',
            description: 'Catatan tambahan.',
            example: 'Rute nyaman dan sesuai kebutuhan rombongan.',
          },
        },
      },
      example: {
        status_penerimaan: 'diterima',
        skor_kepuasan: 5,
        catatan: 'Rute nyaman dan sesuai kebutuhan rombongan.',
      },
      description: 'Status penerimaan wajib diisi, skor dan catatan bersifat opsional.',
    },
    success: detail(
      201,
      'Umpan balik berhasil disimpan.',
      'RecommendationFeedback',
      feedbackExample,
    ),
    errors: [
      unauthenticated(),
      forbidden('Rekomendasi ini bukan milik itinerary akun yang sedang masuk.'),
      notFound('Rekomendasi tidak ditemukan.'),
      validation('Umpan balik belum lengkap atau skor di luar rentang 1 sampai 5.', [
        { field: 'skor_kepuasan', message: 'Skor kepuasan harus antara 1 sampai 5.' },
      ]),
      conflict(
        'FEEDBACK_ALREADY_EXISTS',
        'Umpan balik untuk rekomendasi ini sudah pernah dikirim.',
      ),
      internal(),
    ],
  },
  {
    method: 'get',
    path: '/user/recommendation-history',
    operationId: 'listRecommendationHistory',
    tag: 'Rekomendasi dan Riwayat',
    summary: 'Riwayat rekomendasi',
    description:
      'Menampilkan riwayat rekomendasi yang pernah dibuat untuk seluruh itinerary wisatawan, termasuk konteks cuaca dan waktu perhitungan.',
    roles: ['tourist'],
    kf: ['KF-33'],
    parameters: [
      query('itinerary_id', 'Batasi ke satu itinerary.', {
        type: 'string',
        format: 'uuid',
      }, IDS.itinerary),
      query('dari', 'Tanggal awal riwayat.', {
        type: 'string',
        format: 'date',
      }),
      query('sampai', 'Tanggal akhir riwayat.', {
        type: 'string',
        format: 'date',
      }),
      ...pageQuery(),
    ],
    success: listResponse(
      200,
      'Riwayat rekomendasi berhasil diambil.',
      'RecommendationHistoryItem',
      historyExample,
    ),
    errors: [
      unauthenticated(),
      forbidden('Hanya wisatawan yang memiliki riwayat rekomendasi pribadi.'),
      badRequest('Rentang tanggal riwayat tidak valid.'),
      internal(),
    ],
  },
  {
    method: 'get',
    path: '/itineraries/{id}/alerts',
    operationId: 'listItineraryAlerts',
    tag: 'Notifikasi',
    summary: 'Daftar peringatan itinerary',
    description:
      'Menampilkan seluruh notifikasi perjalanan untuk satu itinerary. Endpoint ini cocok untuk memuat ulang daftar setelah koneksi aliran event terputus.',
    roles: ['tourist'],
    kf: ['KF-29'],
    parameters: [
      pathId('id', IDS.itinerary),
      query('tingkat_urgensi', 'Filter tingkat urgensi.', {
        type: 'string',
        enum: ['info', 'peringatan', 'kritis'],
      }, 'peringatan'),
      query('is_dibaca', 'Filter status baca.', { type: 'boolean' }, false),
      ...pageQuery(),
    ],
    success: listResponse(
      200,
      'Daftar peringatan berhasil diambil.',
      'Notification',
      alertsExample,
    ),
    errors: [
      unauthenticated(),
      forbidden('Itinerary ini bukan milik akun yang sedang masuk.'),
      notFound('Itinerary tidak ditemukan.'),
      internal(),
    ],
  },
  {
    method: 'get',
    path: '/itineraries/{id}/alerts/stream',
    operationId: 'streamItineraryAlerts',
    tag: 'Notifikasi',
    summary: 'Aliran peringatan real time',
    description:
      'Membuka aliran Server-Sent Events untuk peringatan perjalanan. Endpoint ini tidak dapat dijalankan sepenuhnya dari Swagger UI karena koneksi perlu dibiarkan terbuka. Contoh event tetap ditampilkan pada dokumentasi.',
    roles: ['tourist'],
    kf: ['KF-29'],
    parameters: [pathId('id', IDS.itinerary)],
    success: eventStream(
      200,
      'Aliran event dibuka. Koneksi tetap terbuka sampai klien memutuskan.',
      sseExample,
    ),
    errors: [
      unauthenticated(),
      forbidden('Itinerary ini bukan milik akun yang sedang masuk.'),
      notFound('Itinerary tidak ditemukan.'),
      rateLimited('Terlalu banyak koneksi aliran event untuk akun ini.'),
      internal(),
    ],
  },
  {
    method: 'get',
    path: '/notifications',
    operationId: 'listNotifications',
    tag: 'Notifikasi',
    summary: 'Daftar notifikasi pengguna',
    description:
      'Menampilkan seluruh notifikasi perjalanan milik wisatawan, terbaru lebih dahulu. Admin memakai endpoint /admin/notifications untuk melihat seluruh data.',
    roles: ['tourist'],
    kf: ['KF-29'],
    parameters: [
      query('is_dibaca', 'Filter status baca.', { type: 'boolean' }),
      query('tingkat_urgensi', 'Filter tingkat urgensi.', {
        type: 'string',
        enum: ['info', 'peringatan', 'kritis'],
      }),
      ...pageQuery(),
    ],
    success: listResponse(
      200,
      'Daftar notifikasi berhasil diambil.',
      'Notification',
      alertsExample,
    ),
    errors: [
      unauthenticated(),
      forbidden('Hanya wisatawan yang memiliki daftar notifikasi pribadi.'),
      internal(),
    ],
  },
  {
    method: 'patch',
    path: '/notifications/{id}/read',
    operationId: 'markNotificationRead',
    tag: 'Notifikasi',
    summary: 'Tandai notifikasi sudah dibaca',
    description:
      'Mengubah is_dibaca menjadi true untuk satu notifikasi. Bila notifikasi sudah dibaca, operasi tetap berhasil dan data dikembalikan tanpa perubahan.',
    roles: ['tourist'],
    kf: ['KF-29'],
    parameters: [pathId('id', IDS.notification)],
    success: detail(
      200,
      'Notifikasi ditandai sudah dibaca.',
      'Notification',
      markedReadExample,
    ),
    errors: [
      unauthenticated(),
      forbidden('Notifikasi ini bukan milik akun yang sedang masuk.'),
      notFound('Notifikasi tidak ditemukan.'),
      internal(),
    ],
  },
  {
    method: 'patch',
    path: '/notifications/read-all',
    operationId: 'markAllNotificationsRead',
    tag: 'Notifikasi',
    summary: 'Tandai semua notifikasi sudah dibaca',
    description:
      'Menandai seluruh notifikasi milik wisatawan sebagai sudah dibaca. Jumlah data yang berubah dikembalikan pada respons.',
    roles: ['tourist'],
    kf: ['KF-29'],
    success: custom(
      200,
      'Semua notifikasi ditandai sudah dibaca.',
      {
        type: 'object',
        required: ['data'],
        properties: {
          data: {
            type: 'object',
            properties: {
              jumlah_diperbarui: { type: 'integer', example: 2 },
            },
          },
          message: { type: 'string' },
        },
      },
      markAllReadExample,
    ),
    errors: [
      unauthenticated(),
      forbidden('Hanya wisatawan yang memiliki daftar notifikasi pribadi.'),
      internal(),
    ],
  },
]

export const touristTagDescriptions = [
  {
    name: 'Itinerary',
    description:
      'Pembuatan, perubahan, penghapusan, urutan perhentian, dan geometri rute itinerary.',
  },
  {
    name: 'Rekomendasi dan Riwayat',
    description:
      'Perhitungan rekomendasi kontekstual, perbandingan strategi, penjelasan faktor, dan riwayat.',
  },
  {
    name: 'Notifikasi',
    description:
      'Peringatan perjalanan, aliran event real time, dan pengelolaan status baca.',
  },
]
