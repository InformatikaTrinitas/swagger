import {
  IDS,
  TOKENS,
  adminUser,
  destinations,
  environment,
  list,
  listMeta,
  ok,
  partnerUser,
  regions,
  reviews,
  touristUser,
  transportModes,
  weather,
} from './data.mjs'
import { ref } from './schemas.mjs'
import {
  badRequest,
  conflict,
  custom,
  detail,
  empty,
  err,
  forbidden,
  internal,
  list as listResponse,
  notFound,
  pageQuery,
  pathId,
  protectedErrors,
  query,
  rateLimited,
  searchQuery,
  sortQuery,
  unauthenticated,
  upstream,
  validation,
} from './helpers.mjs'

const healthExample = {
  data: {
    status: 'ok',
    service: 'find-holiday-api',
    version: '1.0.0',
    waktu: '2026-10-30 15:50:00',
    pemeriksaan: {
      database: 'ok',
      weather_service: 'ok',
      recommendation_engine: 'ok',
    },
  },
}

const touristSession = {
  data: {
    user: touristUser,
    token: TOKENS.tourist,
    token_type: 'Bearer',
    abilities: ['role:tourist'],
  },
  message: 'Login berhasil.',
}

const partnerSession = {
  data: {
    user: partnerUser,
    token: TOKENS.partner,
    token_type: 'Bearer',
    abilities: ['role:partner'],
  },
  message: 'Login berhasil.',
}

const adminSession = {
  data: {
    user: adminUser,
    token: TOKENS.admin,
    token_type: 'Bearer',
    abilities: ['role:admin'],
  },
  message: 'Login berhasil.',
}

const registeredUser = {
  user_id: '8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e99',
  nama: 'Budi Santoso',
  email: 'budi.santoso@example.com',
  nomor_telepon: '+6281234567890',
  role: 'tourist',
  profil: {
    preferensi_umum: 'Wisata Budaya & Kuliner',
    jumlah_itinerary: 0,
    jumlah_notifikasi_belum_dibaca: 0,
  },
}

const registerExample = {
  data: {
    user: registeredUser,
    token: TOKENS.tourist,
    token_type: 'Bearer',
    abilities: ['role:tourist'],
  },
  message: 'Akun berhasil dibuat. Token sudah dapat dipakai.',
}

const regionListExample = list(regions, {
  ...listMeta(4, 10, 1),
  total: 4,
})

const destinationListExample = list(destinations.slice(0, 3), listMeta(3, 10, 1))

const weatherExample = ok(weather)

const environmentExample = ok(environment)

const transportListExample = list(transportModes.slice(0, 4), listMeta(4, 10, 1))

const reviewListExample = list(reviews.slice(0, 2), listMeta(2, 10, 1))

const createdReview = {
  ulasan_id: 'a4000000-0000-4000-8000-000000000099',
  place_id: IDS.gedungSate,
  nama_penulis: 'Alfian Hanif',
  skor_rating: 5,
  isi_komentar:
    'Bangunan ikonik dengan taman yang tertata. Tur museum informatif dan petugas ramah.',
  waktu_ulasan: '2026-10-30 15:55:00',
  status_publikasi: false,
}

export const publicEndpoints = [
  {
    method: 'get',
    path: '/health',
    operationId: 'getHealth',
    tag: 'Sistem',
    summary: 'Cek kesehatan layanan',
    description:
      'Memeriksa status layanan utama, basis data, layanan cuaca, dan mesin rekomendasi. Endpoint ini dapat dipanggil tanpa token.',
    roles: ['public'],
    public: true,
    kf: ['KNF-02'],
    success: detail(
      200,
      'Layanan berjalan normal.',
      'Health',
      healthExample,
    ),
    errors: [internal()],
  },
  {
    method: 'post',
    path: '/auth/register',
    operationId: 'registerUser',
    tag: 'Autentikasi dan Akun',
    summary: 'Daftar akun baru',
    description:
      'Membuat akun wisatawan atau mitra. Pendaftaran admin tidak tersedia dari endpoint publik. Setelah berhasil, token Bearer langsung dikirim agar pengguna dapat masuk ke aplikasi.',
    roles: ['public'],
    public: true,
    kf: ['KF-03'],
    body: {
      required: true,
      schema: ref('RegisterInput'),
      example: {
        nama: 'Budi Santoso',
        email: 'budi.santoso@example.com',
        password: 'SecurePassword123!',
        password_confirmation: 'SecurePassword123!',
        nomor_telepon: '+6281234567890',
        role: 'tourist',
        preferensi_umum: 'Wisata Budaya & Kuliner',
      },
      description: 'Data akun baru. Isi preferensi_umum untuk wisatawan atau nama_perusahaan untuk mitra.',
    },
    success: detail(
      201,
      'Akun berhasil dibuat.',
      'AuthSession',
      registerExample,
    ),
    errors: [
      validation('Data pendaftaran belum lengkap atau formatnya belum benar.', [
        { field: 'email', message: 'Format email belum benar.' },
        { field: 'password', message: 'Kata sandi minimal 8 karakter.' },
      ]),
      conflict('EMAIL_ALREADY_USED', 'Email sudah dipakai oleh akun lain.'),
      rateLimited('Terlalu banyak percobaan pendaftaran. Coba lagi beberapa saat lagi.'),
      internal(),
    ],
  },
  {
    method: 'post',
    path: '/auth/login',
    operationId: 'loginUser',
    tag: 'Autentikasi dan Akun',
    summary: 'Masuk ke aplikasi',
    description:
      'Memeriksa email dan kata sandi, lalu membuat token Bearer dengan izin sesuai peran. Respons contoh tersedia untuk wisatawan, mitra, dan admin melalui pilihan peran pada halaman simulasi.',
    roles: ['public'],
    public: true,
    kf: ['KF-01', 'KF-02'],
    body: {
      required: true,
      schema: ref('LoginInput'),
      example: {
        email: 'alfian.hanif@example.com',
        password: 'RahasiaDemo123!',
      },
      description: 'Email dan kata sandi akun terdaftar.',
    },
    success: detail(
      200,
      'Login berhasil.',
      'AuthSession',
      touristSession,
      [
        { label: 'Wisatawan', value: touristSession },
        { label: 'Mitra', value: partnerSession },
        { label: 'Admin', value: adminSession },
      ],
    ),
    errors: [
      validation('Email atau kata sandi belum diisi dengan benar.', [
        { field: 'email', message: 'Email wajib diisi.' },
        { field: 'password', message: 'Kata sandi wajib diisi.' },
      ]),
      err(
        401,
        'INVALID_CREDENTIALS',
        'Email atau kata sandi tidak cocok. Periksa kembali data Anda.',
      ),
      rateLimited('Terlalu banyak percobaan login. Coba lagi setelah beberapa menit.'),
      internal(),
    ],
  },
  {
    method: 'post',
    path: '/auth/logout',
    operationId: 'logoutUser',
    tag: 'Autentikasi dan Akun',
    summary: 'Keluar dari aplikasi',
    description:
      'Mencabut token yang sedang dipakai. Setelah berhasil, token tidak dapat digunakan lagi.',
    roles: ['tourist', 'partner', 'admin'],
    kf: ['KF-01'],
    success: empty(204, 'Token berhasil dicabut. Tidak ada isi respons.'),
    errors: protectedErrors(),
  },
  {
    method: 'get',
    path: '/user/profile',
    operationId: 'getProfile',
    tag: 'Autentikasi dan Akun',
    summary: 'Lihat profil pengguna',
    description:
      'Mengembalikan data pengguna yang sedang masuk beserta profil tambahan sesuai peran. Respons menyesuaikan peran aktif pada halaman simulasi.',
    roles: ['tourist', 'partner', 'admin'],
    kf: ['KF-05'],
    success: detail(200, 'Profil berhasil diambil.', 'User', {
      data: touristUser,
    }),
    successExamples: [
      { label: 'Wisatawan', value: { data: touristUser } },
      { label: 'Mitra', value: { data: partnerUser } },
      { label: 'Admin', value: { data: adminUser } },
    ],
    errors: [...protectedErrors()],
  },
  {
    method: 'put',
    path: '/user/profile',
    operationId: 'updateProfile',
    tag: 'Autentikasi dan Akun',
    summary: 'Ubah profil pengguna',
    description:
      'Mengubah nama, kontak, atau profil tambahan sesuai peran. Peran akun tidak dapat diubah melalui endpoint ini.',
    roles: ['tourist', 'partner', 'admin'],
    kf: ['KF-04'],
    body: {
      required: true,
      schema: ref('ProfileUpdateInput'),
      example: {
        nama: 'Alfian Hanif',
        email: 'alfian.hanif@example.com',
        nomor_telepon: '+6281321001001',
        preferensi_umum: 'Wisata Budaya & Kuliner',
      },
      description: 'Field yang boleh diubah sesuai peran pengguna.',
    },
    success: detail(200, 'Profil berhasil diperbarui.', 'User', {
      data: {
        ...touristUser,
        nama: 'Alfian Hanif',
      },
      message: 'Profil berhasil diperbarui.',
    }),
    errors: [
      unauthenticated(),
      validation('Data profil belum lengkap atau formatnya belum benar.', [
        { field: 'email', message: 'Format email belum benar.' },
      ]),
      conflict('EMAIL_ALREADY_USED', 'Email sudah dipakai oleh akun lain.'),
      internal(),
    ],
  },
  {
    method: 'put',
    path: '/user/password',
    operationId: 'updatePassword',
    tag: 'Autentikasi dan Akun',
    summary: 'Ubah kata sandi',
    description:
      'Mengganti kata sandi setelah memeriksa kata sandi lama. Setelah berhasil, token lama tetap berlaku sampai dicabut melalui logout.',
    roles: ['tourist', 'partner', 'admin'],
    kf: ['KF-04'],
    body: {
      required: true,
      schema: ref('PasswordUpdateInput'),
      example: {
        password_lama: 'RahasiaDemo123!',
        password: 'RahasiaBaru456!',
        password_confirmation: 'RahasiaBaru456!',
      },
      description: 'Kata sandi lama dan kata sandi baru.',
    },
    success: custom(
      200,
      'Kata sandi berhasil diperbarui.',
      {
        type: 'object',
        required: ['data'],
        properties: {
          data: {
            type: 'object',
            properties: {
              diperbarui: { type: 'boolean', example: true },
            },
          },
          message: { type: 'string' },
        },
      },
      {
        data: { diperbarui: true },
        message: 'Kata sandi berhasil diperbarui.',
      },
    ),
    errors: [
      unauthenticated(),
      validation('Kata sandi baru belum memenuhi syarat.', [
        { field: 'password', message: 'Kata sandi minimal 8 karakter.' },
      ]),
      err(422, 'INVALID_PASSWORD', 'Kata sandi lama tidak cocok.'),
      internal(),
    ],
  },
  {
    method: 'delete',
    path: '/user/account',
    operationId: 'deleteAccount',
    tag: 'Autentikasi dan Akun',
    summary: 'Hapus akun pengguna',
    description:
      'Menghapus akun beserta data profil. Penghapusan akun wisatawan juga menghapus itinerary dan data turunannya sesuai aturan cascade pada basis data.',
    roles: ['tourist', 'partner', 'admin'],
    kf: ['KF-04', 'KNF-03'],
    success: empty(204, 'Akun berhasil dihapus. Tidak ada isi respons.'),
    errors: [
      unauthenticated(),
      conflict(
        'LAST_ADMIN',
        'Akun admin terakhir tidak dapat dihapus karena akan menghilangkan akses administrasi.',
      ),
      internal(),
    ],
  },
  {
    method: 'get',
    path: '/regions',
    operationId: 'listRegions',
    tag: 'Wilayah dan Konteks',
    summary: 'Daftar wilayah layanan',
    description:
      'Menampilkan wilayah yang tersedia beserta status cakupan. Dapat difilter berdasarkan provinsi dan status aktif.',
    roles: ['public'],
    public: true,
    kf: ['KF-06', 'KF-07'],
    parameters: [
      query('provinsi', 'Nama provinsi.', { type: 'string' }, 'Jawa Barat'),
      query('status_cakupan_aktif', 'Status cakupan.', {
        type: 'boolean',
      }),
      ...pageQuery(),
    ],
    success: listResponse(200, 'Daftar wilayah berhasil diambil.', 'Region', regionListExample),
    errors: [badRequest('Filter wilayah tidak valid.'), internal()],
  },
  {
    method: 'get',
    path: '/regions/{id}',
    operationId: 'getRegion',
    tag: 'Wilayah dan Konteks',
    summary: 'Detail wilayah',
    description:
      'Menampilkan satu wilayah beserta batas geografis dan jumlah destinasi.',
    roles: ['public'],
    public: true,
    kf: ['KF-07'],
    parameters: [pathId('id', IDS.regionBandung)],
    success: detail(200, 'Detail wilayah berhasil diambil.', 'Region', {
      data: regions[0],
    }),
    errors: [notFound('Wilayah tidak ditemukan.'), internal()],
  },
  {
    method: 'get',
    path: '/destinations',
    operationId: 'listDestinations',
    tag: 'Destinasi dan Ulasan',
    summary: 'Daftar destinasi',
    description:
      'Menampilkan destinasi dengan filter wilayah, kategori, kata kunci, dan urutan. Digunakan oleh halaman jelajah dan peta.',
    roles: ['public'],
    public: true,
    kf: ['KF-06', 'KF-07'],
    parameters: [
      query('wilayah_id', 'Filter berdasarkan ID wilayah.', {
        type: 'string',
        format: 'uuid',
      }, IDS.regionBandung),
      query('kategori_wisata', 'Filter kategori wisata.', { type: 'string' }, 'sejarah'),
      searchQuery('Cari nama atau alamat destinasi.'),
      sortQuery(['terbaru', 'rating', 'populer', 'nama']),
      ...pageQuery(),
    ],
    success: listResponse(
      200,
      'Daftar destinasi berhasil diambil.',
      'Destination',
      destinationListExample,
    ),
    errors: [badRequest('Filter destinasi tidak valid.'), internal()],
  },
  {
    method: 'get',
    path: '/destinations/popular',
    operationId: 'listPopularDestinations',
    tag: 'Destinasi dan Ulasan',
    summary: 'Destinasi populer',
    description:
      'Menampilkan destinasi populer berdasarkan rating dan jumlah ulasan. Cocok untuk kartu beranda dan penanda awal pada peta.',
    roles: ['public'],
    public: true,
    kf: ['KF-06', 'KF-07'],
    parameters: [
      query('wilayah_id', 'Batasi ke satu wilayah.', {
        type: 'string',
        format: 'uuid',
      }, IDS.regionBandung),
      query('limit', 'Jumlah destinasi yang diminta.', {
        type: 'integer',
        minimum: 1,
        maximum: 50,
        default: 10,
      }),
    ],
    success: listResponse(
      200,
      'Daftar destinasi populer berhasil diambil.',
      'Destination',
      destinationListExample,
    ),
    errors: [badRequest('Parameter limit atau wilayah tidak valid.'), internal()],
  },
  {
    method: 'get',
    path: '/destinations/{id}',
    operationId: 'getDestination',
    tag: 'Destinasi dan Ulasan',
    summary: 'Detail destinasi',
    description:
      'Menampilkan detail destinasi, lokasi, foto, fasilitas, dan informasi tiket. Data ini dipakai oleh panel peta dan halaman detail.',
    roles: ['public'],
    public: true,
    kf: ['KF-06', 'KF-07'],
    parameters: [pathId('id', IDS.gedungSate)],
    success: detail(200, 'Detail destinasi berhasil diambil.', 'Destination', {
      data: destinations[0],
    }),
    errors: [notFound('Destinasi tidak ditemukan.'), internal()],
  },
  {
    method: 'get',
    path: '/destinations/{id}/reviews',
    operationId: 'listDestinationReviews',
    tag: 'Destinasi dan Ulasan',
    summary: 'Daftar ulasan destinasi',
    description:
      'Menampilkan ulasan yang sudah dipublikasikan untuk satu destinasi. Ulasan yang menunggu moderasi tidak ditampilkan pada endpoint publik.',
    roles: ['public'],
    public: true,
    kf: ['KF-06'],
    parameters: [
      pathId('id', IDS.gedungSate),
      sortQuery(['terbaru', 'terlama', 'rating_tertinggi']),
      ...pageQuery(),
    ],
    success: listResponse(
      200,
      'Daftar ulasan berhasil diambil.',
      'Review',
      reviewListExample,
    ),
    errors: [notFound('Destinasi tidak ditemukan.'), internal()],
  },
  {
    method: 'post',
    path: '/destinations/{id}/reviews',
    operationId: 'createDestinationReview',
    tag: 'Destinasi dan Ulasan',
    summary: 'Tulis ulasan destinasi',
    description:
      'Menambahkan ulasan untuk destinasi. Ulasan baru masuk ke antrean moderasi sehingga status_publikasi bernilai false sampai disetujui admin.',
    roles: ['tourist'],
    kf: ['KF-06'],
    parameters: [pathId('id', IDS.gedungSate)],
    body: {
      required: true,
      schema: ref('ReviewInput'),
      example: {
        skor_rating: 5,
        isi_komentar:
          'Bangunan ikonik dengan taman yang tertata. Tur museum informatif dan petugas ramah.',
      },
      description: 'Nilai rating dan isi ulasan.',
    },
    success: detail(201, 'Ulasan berhasil dikirim dan menunggu moderasi.', 'Review', {
      data: createdReview,
      message: 'Ulasan berhasil dikirim dan menunggu moderasi.',
    }),
    errors: [
      unauthenticated(),
      forbidden('Hanya wisatawan yang dapat menulis ulasan.'),
      notFound('Destinasi tidak ditemukan.'),
      validation('Ulasan belum lengkap atau rating di luar rentang 1 sampai 5.', [
        { field: 'skor_rating', message: 'Rating harus antara 1 sampai 5.' },
        { field: 'isi_komentar', message: 'Ulasan minimal 10 karakter.' },
      ]),
      conflict(
        'REVIEW_ALREADY_EXISTS',
        'Anda sudah menulis ulasan untuk destinasi ini.',
      ),
      rateLimited('Terlalu banyak ulasan dalam waktu singkat.'),
      internal(),
    ],
  },
  {
    method: 'get',
    path: '/context/weather',
    operationId: 'getWeatherContext',
    tag: 'Wilayah dan Konteks',
    summary: 'Konteks cuaca wilayah',
    description:
      'Menampilkan cuaca terkini dan waktu pembaruan untuk satu wilayah. Bila layanan cuaca sedang bermasalah, kontrak menetapkan respons 503 agar aplikasi dapat menampilkan data terakhir yang tersimpan.',
    roles: ['public'],
    public: true,
    kf: ['KF-30', 'KNF-06'],
    parameters: [
      query('wilayah_id', 'ID wilayah yang diminta.', {
        type: 'string',
        format: 'uuid',
      }, IDS.regionBandung),
    ],
    success: detail(200, 'Konteks cuaca berhasil diambil.', 'Weather', weatherExample),
    errors: [
      validation('wilayah_id wajib diisi dengan format UUID yang benar.', [
        { field: 'wilayah_id', message: 'Wilayah wajib dipilih.' },
      ]),
      notFound('Wilayah tidak ditemukan atau belum memiliki data cuaca.'),
      upstream('Layanan cuaca pihak ketiga sedang tidak tersedia.'),
      internal(),
    ],
  },
  {
    method: 'get',
    path: '/context/environment',
    operationId: 'getEnvironmentContext',
    tag: 'Wilayah dan Konteks',
    summary: 'Konteks cuaca dan lalu lintas',
    description:
      'Menampilkan gabungan kondisi cuaca, kepadatan jalan, dan insiden kecelakaan untuk satu wilayah. Data ini menjadi masukan mesin rekomendasi.',
    roles: ['public'],
    public: true,
    kf: ['KF-26', 'KF-30'],
    parameters: [
      query('wilayah_id', 'ID wilayah yang diminta.', {
        type: 'string',
        format: 'uuid',
      }, IDS.regionBandung),
    ],
    success: detail(
      200,
      'Konteks lingkungan berhasil diambil.',
      'EnvironmentContext',
      environmentExample,
    ),
    errors: [
      validation('wilayah_id wajib diisi dengan format UUID yang benar.', [
        { field: 'wilayah_id', message: 'Wilayah wajib dipilih.' },
      ]),
      notFound('Wilayah tidak ditemukan atau belum memiliki data konteks.'),
      internal(),
    ],
  },
  {
    method: 'get',
    path: '/transport-modes',
    operationId: 'listTransportModes',
    tag: 'Transportasi',
    summary: 'Katalog moda transportasi',
    description:
      'Menampilkan seluruh moda transportasi beserta tarif, kapasitas, dan wilayah layanan. Filter jenis dan status membantu wisatawan mengenal pilihan yang tersedia.',
    roles: ['public'],
    public: true,
    kf: ['KF-20', 'KF-21'],
    parameters: [
      query('wilayah_id', 'Filter wilayah layanan.', {
        type: 'string',
        format: 'uuid',
      }, IDS.regionBandung),
      query('jenis_transportasi', 'Filter jenis transportasi.', {
        type: 'string',
        enum: [
          'BUS',
          'ANGKOT',
          'ONLINE_TAXI',
          'ONLINE_MOTOR',
          'RENTAL',
          'PEDESTRIAN',
          'SHUTTLE',
        ],
      }, 'ONLINE_TAXI'),
      query('status_aktif', 'Filter status aktif.', { type: 'boolean' }),
      searchQuery('Cari nama moda atau mitra.'),
      ...pageQuery(),
    ],
    success: listResponse(
      200,
      'Katalog moda transportasi berhasil diambil.',
      'TransportMode',
      transportListExample,
    ),
    errors: [badRequest('Filter moda transportasi tidak valid.'), internal()],
  },
  {
    method: 'get',
    path: '/transport-modes/{id}',
    operationId: 'getTransportMode',
    tag: 'Transportasi',
    summary: 'Detail moda transportasi',
    description:
      'Menampilkan detail satu moda, termasuk rincian tarif dan rute halte bila tersedia.',
    roles: ['public'],
    public: true,
    kf: ['KF-20', 'KF-21'],
    parameters: [pathId('id', IDS.gocar)],
    success: detail(
      200,
      'Detail moda transportasi berhasil diambil.',
      'TransportMode',
      {
        data: transportModes[2],
      },
    ),
    errors: [notFound('Moda transportasi tidak ditemukan.'), internal()],
  },
]

export const publicTagDescriptions = [
  {
    name: 'Sistem',
    description: 'Pemeriksaan kesehatan layanan untuk pemantauan dan deployment.',
  },
  {
    name: 'Autentikasi dan Akun',
    description:
      'Pendaftaran, login, profil, kata sandi, dan penghapusan akun. Semua endpoint selain register dan login memerlukan token Bearer.',
  },
  {
    name: 'Destinasi dan Ulasan',
    description:
      'Jelajah destinasi, peta, detail tempat, fasilitas, dan ulasan pengunjung.',
  },
  {
    name: 'Wilayah dan Konteks',
    description:
      'Data wilayah layanan, cuaca terkini, serta konteks lalu lintas yang dipakai mesin rekomendasi.',
  },
  {
    name: 'Transportasi',
    description:
      'Katalog moda transportasi, tarif, kapasitas, dan wilayah layanan.',
  },
]
