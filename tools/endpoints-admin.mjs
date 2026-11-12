import {
  IDS,
  adminUser,
  auditLogs,
  dashboard,
  destinations,
  environment,
  facilities,
  itineraries,
  itineraryDetail,
  list,
  listMeta,
  notifications,
  partnerUser,
  recommendations,
  regions,
  reviews,
  touristUser,
  transportModes,
  users,
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
  validation,
} from './helpers.mjs'

const adminDashboardExample = { data: dashboard }

const partnerUsers = users.filter((item) => item.role === 'partner')

const userListExample = list(users, listMeta(8, 10, 1))

const partnerListExample = list(partnerUsers, listMeta(2, 10, 1))

const verifiedPartnerExample = {
  data: {
    ...partnerUsers[1],
    profil: {
      ...partnerUsers[1].profil,
      status_verifikasi: true,
      verified_by_admin_id: IDS.admin,
    },
  },
  message: 'Mitra berhasil diverifikasi.',
}

const regionListExample = list(regions, listMeta(4, 10, 1))

const createdRegionExample = {
  data: {
    wilayah_id: 'a1000000-0000-4000-8000-000000000099',
    nama_wilayah: 'Kota Bogor',
    provinsi: 'Jawa Barat',
    boundary_coordinates: [
      [106.72, -6.65],
      [106.86, -6.65],
      [106.86, -6.52],
      [106.72, -6.52],
    ],
    status_cakupan_aktif: true,
    jumlah_destinasi: 0,
  },
  message: 'Wilayah berhasil ditambahkan.',
}

const updatedRegionExample = {
  data: {
    ...regions[0],
    status_cakupan_aktif: false,
  },
  message: 'Wilayah berhasil diperbarui.',
}

const placeListExample = list(destinations.slice(0, 3), listMeta(12, 10, 1))

const createdPlaceExample = {
  data: {
    ...destinations[0],
    place_id: 'b1000000-0000-4000-8000-000000000099',
    nama_tempat: 'Museum Kota Bandung',
    kategori_wisata: 'sejarah',
  },
  message: 'Destinasi berhasil ditambahkan.',
}

const updatedPlaceExample = {
  data: {
    ...destinations[0],
    harga_tiket_masuk: 7500,
  },
  message: 'Destinasi berhasil diperbarui.',
}

const facilityListExample = list(facilities, listMeta(2, 10, 1))

const createdFacilityExample = {
  data: {
    fasilitas_id: 'fa1000000-0000-4000-8000-000000000099',
    place_id: IDS.gedungSate,
    jenis: 'SPBU',
    is_gratis: false,
    fasilitas_tersedia: ['SPBU 24 jam', 'Minimarket'],
  },
  message: 'Fasilitas berhasil ditambahkan.',
}

const updatedFacilityExample = {
  data: {
    ...facilities[0],
    is_gratis: false,
  },
  message: 'Fasilitas berhasil diperbarui.',
}

const transportListExample = list(transportModes, listMeta(7, 10, 1))

const createdTransportExample = {
  data: {
    ...transportModes[2],
    transportasi_id: 'f1000000-0000-4000-8000-000000000099',
    nama_moda: 'GoCar Bandung Baru',
  },
  message: 'Moda transportasi berhasil ditambahkan.',
}

const updatedTransportExample = {
  data: {
    ...transportModes[2],
    kapasitas_penumpang: 6,
  },
  message: 'Moda transportasi berhasil diperbarui.',
}

const contextListExample = list([environment], listMeta(1, 10, 1))

const createdContextExample = {
  data: {
    ...environment,
    context_id: 'a2000000-0000-4000-8000-000000000099',
    kondisi_cuaca: 'Cerah Berawan',
    tingkat_curah_hujan: 0,
  },
  message: 'Konteks lingkungan berhasil ditambahkan.',
}

const updatedContextExample = {
  data: {
    ...environment,
    kondisi_lalu_lintas: 'Lancar',
    rata_rata_kepadatan_jalan: 0.42,
  },
  message: 'Konteks lingkungan berhasil diperbarui.',
}

const itineraryListExample = list(itineraries, listMeta(2, 10, 1))

const updatedItineraryExample = {
  data: {
    ...itineraryDetail,
    status_rencana: 'selesai',
  },
  message: 'Itinerary berhasil diperbarui oleh admin.',
}

const recommendationListExample = list(recommendations, listMeta(2, 10, 1))

const notificationListExample = list(notifications, listMeta(2, 10, 1))

const reviewListExample = list(reviews, listMeta(3, 10, 1))

const moderatedReviewExample = {
  data: {
    ...reviews[2],
    status_publikasi: true,
  },
  message: 'Ulasan berhasil dipublikasikan.',
}

const logListExample = list(auditLogs, listMeta(3, 10, 1))

const adminItineraryInput = {
  type: 'object',
  description: 'Perubahan data itinerary oleh admin.',
  properties: {
    judul_perjalanan: { type: 'string', example: 'Bandung Heritage & Kuliner Weekend' },
    tanggal_mulai: { type: 'string', format: 'date', example: '2026-11-14' },
    tanggal_selesai: { type: 'string', format: 'date', example: '2026-11-15' },
    jumlah_wisatawan: { type: 'integer', minimum: 1, example: 2 },
    total_anggaran: { type: 'number', example: 1500000 },
    status_rencana: {
      type: 'string',
      enum: ['draft', 'aktif', 'selesai', 'dibatalkan'],
      example: 'selesai',
    },
    prioritas_utama: {
      type: 'string',
      enum: ['kecepatan', 'biaya', 'kenyamanan'],
      example: 'kenyamanan',
    },
    hindari_jalan_kaki_jauh: { type: 'boolean', example: true },
    maksimal_transit: { type: 'integer', minimum: 0, maximum: 5, example: 2 },
    preferensi_biaya: {
      type: 'string',
      enum: ['hemat', 'standar', 'premium'],
      example: 'standar',
    },
  },
}

export const adminEndpoints = [
  {
    method: 'get',
    path: '/admin/dashboard',
    operationId: 'getAdminDashboard',
    tag: 'Admin',
    summary: 'Ringkasan operasional admin',
    description:
      'Menampilkan ringkasan jumlah pengguna, mitra, wilayah, destinasi, itinerary, rekomendasi, notifikasi, dan aktivitas terbaru.',
    roles: ['admin'],
    kf: ['KF-05', 'KF-14', 'KF-33'],
    success: detail(200, 'Ringkasan operasional berhasil diambil.', 'Dashboard', adminDashboardExample),
    errors: [...protectedErrors()],
  },
  {
    method: 'get',
    path: '/admin/users',
    operationId: 'listAdminUsers',
    tag: 'Admin',
    summary: 'Daftar pengguna',
    description:
      'Menampilkan seluruh pengguna dengan filter peran dan kata kunci. Data profil mengikuti peran masing-masing.',
    roles: ['admin'],
    kf: ['KF-02', 'KF-05'],
    parameters: [
      query('role', 'Filter peran.', {
        type: 'string',
        enum: ['tourist', 'partner', 'admin'],
      }, 'tourist'),
      searchQuery('Cari nama atau email pengguna.'),
      ...pageQuery(),
    ],
    success: listResponse(200, 'Daftar pengguna berhasil diambil.', 'User', userListExample),
    errors: [...protectedErrors(), badRequest('Filter pengguna tidak valid.')],
  },
  {
    method: 'get',
    path: '/admin/users/{id}',
    operationId: 'getAdminUser',
    tag: 'Admin',
    summary: 'Detail pengguna',
    description:
      'Menampilkan detail pengguna beserta profil, jumlah itinerary, dan informasi mitra bila ada.',
    roles: ['admin'],
    kf: ['KF-05'],
    parameters: [pathId('id', IDS.tourist)],
    success: detail(200, 'Detail pengguna berhasil diambil.', 'User', {
      data: touristUser,
    }),
    errors: [...protectedErrors(), notFound('Pengguna tidak ditemukan.')],
  },
  {
    method: 'put',
    path: '/admin/users/{id}',
    operationId: 'updateAdminUser',
    tag: 'Admin',
    summary: 'Ubah data pengguna',
    description:
      'Mengubah nama, email, nomor telepon, atau peran pengguna. Perubahan peran terakhir admin dilindungi agar akses administrasi tetap tersedia.',
    roles: ['admin'],
    kf: ['KF-04', 'KF-02'],
    parameters: [pathId('id', IDS.tourist2)],
    body: {
      required: true,
      schema: ref('UserUpdateInput'),
      example: {
        nama: 'Salsabila Putri',
        email: 'salsabila.putri@example.com',
        nomor_telepon: '+6281321001002',
        role: 'tourist',
      },
      description: 'Field pengguna yang boleh diubah admin.',
    },
    success: detail(200, 'Data pengguna berhasil diperbarui.', 'User', {
      data: {
        ...users[1],
        nama: 'Salsabila Putri',
      },
      message: 'Data pengguna berhasil diperbarui.',
    }),
    errors: [
      ...protectedErrors(),
      notFound('Pengguna tidak ditemukan.'),
      validation('Data pengguna belum lengkap atau formatnya belum benar.', [
        { field: 'email', message: 'Format email belum benar.' },
      ]),
      conflict('EMAIL_ALREADY_USED', 'Email sudah dipakai oleh pengguna lain.'),
      conflict('LAST_ADMIN', 'Peran admin terakhir tidak dapat diubah.'),
    ],
  },
  {
    method: 'delete',
    path: '/admin/users/{id}',
    operationId: 'deleteAdminUser',
    tag: 'Admin',
    summary: 'Hapus pengguna',
    description:
      'Menghapus akun pengguna beserta data terkait. Akun admin terakhir tidak dapat dihapus.',
    roles: ['admin'],
    kf: ['KF-02', 'KF-04'],
    parameters: [pathId('id', IDS.tourist2)],
    success: empty(204, 'Pengguna berhasil dihapus. Tidak ada isi respons.'),
    errors: [
      ...protectedErrors(),
      notFound('Pengguna tidak ditemukan.'),
      conflict('LAST_ADMIN', 'Akun admin terakhir tidak dapat dihapus.'),
      conflict(
        'USER_HAS_ACTIVE_DATA',
        'Pengguna masih memiliki itinerary aktif yang harus diselesaikan terlebih dahulu.',
      ),
    ],
  },
  {
    method: 'get',
    path: '/admin/partners',
    operationId: 'listAdminPartners',
    tag: 'Admin',
    summary: 'Daftar mitra',
    description:
      'Menampilkan mitra transportasi beserta status verifikasi dan jumlah armada. Digunakan untuk proses verifikasi.',
    roles: ['admin'],
    kf: ['KF-18', 'KF-19'],
    parameters: [
      query('status_verifikasi', 'Filter status verifikasi.', {
        type: 'boolean',
      }, false),
      searchQuery('Cari nama perusahaan atau email mitra.'),
      ...pageQuery(),
    ],
    success: listResponse(
      200,
      'Daftar mitra berhasil diambil.',
      'User',
      partnerListExample,
    ),
    errors: [...protectedErrors(), badRequest('Filter mitra tidak valid.')],
  },
  {
    method: 'patch',
    path: '/admin/partners/{id}/verify',
    operationId: 'verifyAdminPartner',
    tag: 'Admin',
    summary: 'Verifikasi mitra',
    description:
      'Mengubah status verifikasi mitra. Sistem mencatat admin yang memverifikasi dan menulis aktivitas ke data_log.',
    roles: ['admin'],
    kf: ['KF-18', 'KF-19'],
    parameters: [pathId('id', IDS.partner3)],
    body: {
      required: true,
      schema: ref('PartnerVerificationInput'),
      example: {
        status_verifikasi: true,
        catatan: 'Dokumen legalitas lengkap dan sesuai.',
      },
      description: 'Keputusan verifikasi dan catatan opsional.',
    },
    success: detail(
      200,
      'Status verifikasi mitra berhasil diperbarui.',
      'User',
      verifiedPartnerExample,
    ),
    errors: [
      ...protectedErrors(),
      notFound('Mitra tidak ditemukan.'),
      validation('Status verifikasi wajib berupa boolean.'),
      conflict(
        'ALREADY_VERIFIED',
        'Mitra ini sudah memiliki status verifikasi yang sama.',
      ),
    ],
  },
  {
    method: 'get',
    path: '/admin/regions',
    operationId: 'listAdminRegions',
    tag: 'Admin',
    summary: 'Daftar wilayah admin',
    description:
      'Menampilkan seluruh wilayah untuk pengelolaan cakupan layanan.',
    roles: ['admin'],
    kf: ['KF-06', 'KF-07'],
    parameters: [
      query('provinsi', 'Filter provinsi.', { type: 'string' }, 'Jawa Barat'),
      query('status_cakupan_aktif', 'Filter status cakupan.', { type: 'boolean' }),
      ...pageQuery(),
    ],
    success: listResponse(200, 'Daftar wilayah berhasil diambil.', 'Region', regionListExample),
    errors: [...protectedErrors(), badRequest('Filter wilayah tidak valid.')],
  },
  {
    method: 'post',
    path: '/admin/regions',
    operationId: 'createAdminRegion',
    tag: 'Admin',
    summary: 'Tambah wilayah',
    description:
      'Menambahkan wilayah layanan baru beserta batas geografis dan status cakupan.',
    roles: ['admin'],
    kf: ['KF-07'],
    body: {
      required: true,
      schema: ref('RegionInput'),
      example: {
        nama_wilayah: 'Kota Bogor',
        provinsi: 'Jawa Barat',
        boundary_coordinates: [
          [106.72, -6.65],
          [106.86, -6.65],
          [106.86, -6.52],
          [106.72, -6.52],
        ],
        status_cakupan_aktif: true,
      },
      description: 'Data wilayah baru.',
    },
    success: detail(201, 'Wilayah berhasil ditambahkan.', 'Region', createdRegionExample),
    errors: [
      ...protectedErrors(),
      validation('Data wilayah belum lengkap atau batas koordinat tidak valid.', [
        { field: 'nama_wilayah', message: 'Nama wilayah wajib diisi.' },
      ]),
      conflict('REGION_ALREADY_EXISTS', 'Wilayah dengan nama yang sama sudah ada.'),
    ],
  },
  {
    method: 'put',
    path: '/admin/regions/{id}',
    operationId: 'updateAdminRegion',
    tag: 'Admin',
    summary: 'Ubah wilayah',
    description:
      'Memperbarui nama, batas, atau status cakupan wilayah.',
    roles: ['admin'],
    kf: ['KF-07'],
    parameters: [pathId('id', IDS.regionBandung)],
    body: {
      required: true,
      schema: ref('RegionInput'),
      example: {
        nama_wilayah: 'Kota Bandung',
        provinsi: 'Jawa Barat',
        boundary_coordinates: regions[0].boundary_coordinates,
        status_cakupan_aktif: false,
      },
      description: 'Data wilayah yang diperbarui.',
    },
    success: detail(200, 'Wilayah berhasil diperbarui.', 'Region', updatedRegionExample),
    errors: [
      ...protectedErrors(),
      notFound('Wilayah tidak ditemukan.'),
      validation('Data wilayah belum lengkap atau batas koordinat tidak valid.'),
      conflict('REGION_ALREADY_EXISTS', 'Nama wilayah sudah dipakai.'),
    ],
  },
  {
    method: 'delete',
    path: '/admin/regions/{id}',
    operationId: 'deleteAdminRegion',
    tag: 'Admin',
    summary: 'Hapus wilayah',
    description:
      'Menghapus wilayah yang tidak lagi dilayani. Wilayah yang masih memiliki destinasi atau moda transportasi tidak dapat dihapus.',
    roles: ['admin'],
    kf: ['KF-07'],
    parameters: [pathId('id', IDS.regionCimahi)],
    success: empty(204, 'Wilayah berhasil dihapus. Tidak ada isi respons.'),
    errors: [
      ...protectedErrors(),
      notFound('Wilayah tidak ditemukan.'),
      conflict(
        'REGION_IN_USE',
        'Wilayah masih memiliki destinasi atau moda transportasi terkait.',
      ),
    ],
  },
  {
    method: 'get',
    path: '/admin/places',
    operationId: 'listAdminPlaces',
    tag: 'Admin',
    summary: 'Daftar destinasi admin',
    description:
      'Menampilkan seluruh tempat kunjungan dan destinasi untuk pengelolaan data.',
    roles: ['admin'],
    kf: ['KF-06', 'KF-07'],
    parameters: [
      query('wilayah_id', 'Filter wilayah.', {
        type: 'string',
        format: 'uuid',
      }, IDS.regionBandung),
      query('kategori_wisata', 'Filter kategori.', { type: 'string' }, 'sejarah'),
      searchQuery('Cari nama tempat.'),
      ...pageQuery(),
    ],
    success: listResponse(200, 'Daftar destinasi berhasil diambil.', 'Destination', placeListExample),
    errors: [...protectedErrors(), badRequest('Filter destinasi tidak valid.')],
  },
  {
    method: 'post',
    path: '/admin/places',
    operationId: 'createAdminPlace',
    tag: 'Admin',
    summary: 'Tambah destinasi',
    description:
      'Menambahkan tempat kunjungan sekaligus detail destinasi wisata. Fasilitas dapat ditambahkan melalui endpoint fasilitas.',
    roles: ['admin'],
    kf: ['KF-06', 'KF-07'],
    body: {
      required: true,
      schema: ref('PlaceInput'),
      example: {
        wilayah_id: IDS.regionBandung,
        nama_tempat: 'Museum Kota Bandung',
        alamat_lengkap: 'Jl. Merdeka No.1, Kec. Sumur Bandung',
        latitude: -6.9147,
        longitude: 107.6098,
        jam_buka: '08:00',
        jam_tutup: '16:00',
        daftar_foto_url: ['/media/museum-kota-1.jpg'],
        kategori_wisata: 'sejarah',
        estimasi_durasi_kunjungan: 60,
        harga_tiket_masuk: 5000,
      },
      description: 'Data tempat dan detail destinasi.',
    },
    success: detail(201, 'Destinasi berhasil ditambahkan.', 'Destination', createdPlaceExample),
    errors: [
      ...protectedErrors(),
      validation('Data destinasi belum lengkap atau koordinat tidak valid.', [
        { field: 'latitude', message: 'Latitude harus antara -90 sampai 90.' },
        { field: 'longitude', message: 'Longitude harus antara -180 sampai 180.' },
      ]),
      notFound('Wilayah tidak ditemukan.'),
      conflict('PLACE_ALREADY_EXISTS', 'Destinasi dengan nama dan alamat yang sama sudah ada.'),
    ],
  },
  {
    method: 'get',
    path: '/admin/places/{id}',
    operationId: 'getAdminPlace',
    tag: 'Admin',
    summary: 'Detail destinasi admin',
    description:
      'Menampilkan detail destinasi beserta seluruh fasilitas dan ulasan terbaru.',
    roles: ['admin'],
    kf: ['KF-06', 'KF-07'],
    parameters: [pathId('id', IDS.gedungSate)],
    success: detail(200, 'Detail destinasi berhasil diambil.', 'Destination', {
      data: destinations[0],
    }),
    errors: [...protectedErrors(), notFound('Destinasi tidak ditemukan.')],
  },
  {
    method: 'put',
    path: '/admin/places/{id}',
    operationId: 'updateAdminPlace',
    tag: 'Admin',
    summary: 'Ubah destinasi',
    description:
      'Memperbarui data tempat kunjungan dan detail destinasi, termasuk harga tiket dan durasi kunjungan.',
    roles: ['admin'],
    kf: ['KF-06', 'KF-07'],
    parameters: [pathId('id', IDS.gedungSate)],
    body: {
      required: true,
      schema: ref('PlaceInput'),
      example: {
        wilayah_id: IDS.regionBandung,
        nama_tempat: 'Gedung Sate',
        alamat_lengkap: 'Jl. Diponegoro No.22, Citarum, Kec. Bandung Wetan',
        latitude: -6.902484,
        longitude: 107.618765,
        jam_buka: '08:00',
        jam_tutup: '16:00',
        daftar_foto_url: destinations[0].daftar_foto_url,
        kategori_wisata: 'sejarah',
        estimasi_durasi_kunjungan: 90,
        harga_tiket_masuk: 7500,
      },
      description: 'Data destinasi yang diperbarui.',
    },
    success: detail(200, 'Destinasi berhasil diperbarui.', 'Destination', updatedPlaceExample),
    errors: [
      ...protectedErrors(),
      notFound('Destinasi atau wilayah tidak ditemukan.'),
      validation('Data destinasi belum lengkap atau koordinat tidak valid.'),
      conflict('PLACE_ALREADY_EXISTS', 'Nama dan alamat destinasi sudah dipakai.'),
    ],
  },
  {
    method: 'delete',
    path: '/admin/places/{id}',
    operationId: 'deleteAdminPlace',
    tag: 'Admin',
    summary: 'Hapus destinasi',
    description:
      'Menghapus destinasi yang tidak lagi dipakai. Destinasi yang masih menjadi perhentian itinerary aktif tidak dapat dihapus.',
    roles: ['admin'],
    kf: ['KF-06', 'KF-07'],
    parameters: [pathId('id', IDS.cihampelas)],
    success: empty(204, 'Destinasi berhasil dihapus. Tidak ada isi respons.'),
    errors: [
      ...protectedErrors(),
      notFound('Destinasi tidak ditemukan.'),
      conflict(
        'PLACE_IN_USE',
        'Destinasi masih dipakai pada itinerary atau memiliki data terkait.',
      ),
    ],
  },
  {
    method: 'get',
    path: '/admin/places/{id}/facilities',
    operationId: 'listAdminPlaceFacilities',
    tag: 'Admin',
    summary: 'Daftar fasilitas destinasi',
    description:
      'Menampilkan fasilitas utilitas pada satu destinasi. Kontrak memakai fasilitas_id karena satu tempat dapat memiliki beberapa fasilitas.',
    roles: ['admin'],
    kf: ['KF-07'],
    parameters: [pathId('id', IDS.gedungSate)],
    success: listResponse(
      200,
      'Daftar fasilitas berhasil diambil.',
      'Facility',
      facilityListExample,
    ),
    errors: [...protectedErrors(), notFound('Destinasi tidak ditemukan.')],
  },
  {
    method: 'post',
    path: '/admin/places/{id}/facilities',
    operationId: 'createAdminPlaceFacility',
    tag: 'Admin',
    summary: 'Tambah fasilitas destinasi',
    description:
      'Menambahkan fasilitas baru pada destinasi. Endpoint ini memerlukan kolom fasilitas_id pada tabel fasilitas_utilitas.',
    roles: ['admin'],
    kf: ['KF-07'],
    parameters: [pathId('id', IDS.gedungSate)],
    body: {
      required: true,
      schema: ref('FacilityInput'),
      example: {
        jenis: 'SPBU',
        is_gratis: false,
        fasilitas_tersedia: ['SPBU 24 jam', 'Minimarket'],
      },
      description: 'Data fasilitas baru.',
    },
    success: detail(
      201,
      'Fasilitas berhasil ditambahkan.',
      'Facility',
      createdFacilityExample,
    ),
    errors: [
      ...protectedErrors(),
      notFound('Destinasi tidak ditemukan.'),
      validation('Data fasilitas belum lengkap atau jenis tidak valid.', [
        { field: 'jenis', message: 'Jenis fasilitas harus salah satu nilai yang tersedia.' },
      ]),
      conflict('FACILITY_ALREADY_EXISTS', 'Fasilitas dengan jenis yang sama sudah ada.'),
    ],
  },
  {
    method: 'put',
    path: '/admin/places/{id}/facilities/{facilityId}',
    operationId: 'updateAdminPlaceFacility',
    tag: 'Admin',
    summary: 'Ubah fasilitas destinasi',
    description:
      'Memperbarui jenis, status gratis, atau daftar fasilitas yang tersedia.',
    roles: ['admin'],
    kf: ['KF-07'],
    parameters: [pathId('id', IDS.gedungSate), pathId('facilityId', IDS.facilityAtm)],
    body: {
      required: true,
      schema: ref('FacilityInput'),
      example: {
        jenis: 'ATM',
        is_gratis: false,
        fasilitas_tersedia: ['ATM BCA', 'ATM Mandiri', 'Area parkir'],
      },
      description: 'Data fasilitas yang diperbarui.',
    },
    success: detail(200, 'Fasilitas berhasil diperbarui.', 'Facility', updatedFacilityExample),
    errors: [
      ...protectedErrors(),
      notFound('Destinasi atau fasilitas tidak ditemukan.'),
      validation('Data fasilitas belum lengkap atau jenis tidak valid.'),
    ],
  },
  {
    method: 'delete',
    path: '/admin/places/{id}/facilities/{facilityId}',
    operationId: 'deleteAdminPlaceFacility',
    tag: 'Admin',
    summary: 'Hapus fasilitas destinasi',
    description:
      'Menghapus satu fasilitas dari destinasi tanpa menghapus destinasi induk.',
    roles: ['admin'],
    kf: ['KF-07'],
    parameters: [pathId('id', IDS.gedungSate), pathId('facilityId', IDS.facilityAtm)],
    success: empty(204, 'Fasilitas berhasil dihapus. Tidak ada isi respons.'),
    errors: [
      ...protectedErrors(),
      notFound('Destinasi atau fasilitas tidak ditemukan.'),
    ],
  },
  {
    method: 'get',
    path: '/admin/transport-modes',
    operationId: 'listAdminTransportModes',
    tag: 'Admin',
    summary: 'Daftar moda transportasi',
    description:
      'Menampilkan seluruh moda transportasi, termasuk yang tidak aktif, untuk pengelolaan data transportasi.',
    roles: ['admin'],
    kf: ['KF-13', 'KF-14', 'KF-20'],
    parameters: [
      query('mitra_id', 'Filter mitra.', {
        type: 'string',
        format: 'uuid',
      }, IDS.partner),
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
      }),
      query('status_aktif', 'Filter status aktif.', { type: 'boolean' }),
      searchQuery('Cari nama moda.'),
      ...pageQuery(),
    ],
    success: listResponse(
      200,
      'Daftar moda transportasi berhasil diambil.',
      'TransportMode',
      transportListExample,
    ),
    errors: [...protectedErrors(), badRequest('Filter moda transportasi tidak valid.')],
  },
  {
    method: 'post',
    path: '/admin/transport-modes',
    operationId: 'createAdminTransportMode',
    tag: 'Admin',
    summary: 'Tambah moda transportasi',
    description:
      'Menambahkan moda transportasi baru dan rincian tarifnya. Admin dapat menetapkan mitra pemilik armada.',
    roles: ['admin'],
    kf: ['KF-13', 'KF-17'],
    body: {
      required: true,
      schema: ref('TransportModeInput'),
      example: {
        wilayah_id: IDS.regionBandung,
        mitra_id: IDS.partner,
        nama_moda: 'GoCar Bandung Baru',
        jenis_transportasi: 'ONLINE_TAXI',
        kapasitas_penumpang: 4,
        status_aktif: true,
        sumber_data: 'Mitra Portal',
        detail: {
          tarif_dasar: 10000,
          tarif_per_km: 4500,
          surge_multiplier: 1.2,
        },
      },
      description: 'Data moda transportasi dan rincian tarif.',
    },
    success: detail(
      201,
      'Moda transportasi berhasil ditambahkan.',
      'TransportMode',
      createdTransportExample,
    ),
    errors: [
      ...protectedErrors(),
      notFound('Wilayah atau mitra tidak ditemukan.'),
      validation('Data moda transportasi belum lengkap atau tarif tidak valid.'),
      conflict('TRANSPORT_ALREADY_EXISTS', 'Nama moda sudah dipakai.'),
    ],
  },
  {
    method: 'put',
    path: '/admin/transport-modes/{id}',
    operationId: 'updateAdminTransportMode',
    tag: 'Admin',
    summary: 'Ubah moda transportasi',
    description:
      'Memperbarui data moda, kapasitas, status aktif, dan rincian tarif.',
    roles: ['admin'],
    kf: ['KF-15', 'KF-17'],
    parameters: [pathId('id', IDS.gocar)],
    body: {
      required: true,
      schema: ref('TransportModeInput'),
      example: {
        wilayah_id: IDS.regionBandung,
        mitra_id: IDS.partner,
        nama_moda: 'GoCar Bandung',
        jenis_transportasi: 'ONLINE_TAXI',
        kapasitas_penumpang: 6,
        status_aktif: true,
        sumber_data: 'Mitra Portal',
        detail: {
          tarif_dasar: 10000,
          tarif_per_km: 4500,
          surge_multiplier: 1.2,
        },
      },
      description: 'Data moda transportasi yang diperbarui.',
    },
    success: detail(
      200,
      'Moda transportasi berhasil diperbarui.',
      'TransportMode',
      updatedTransportExample,
    ),
    errors: [
      ...protectedErrors(),
      notFound('Moda transportasi, wilayah, atau mitra tidak ditemukan.'),
      validation('Data moda transportasi belum lengkap atau tarif tidak valid.'),
      conflict(
        'TRANSPORT_IN_USE',
        'Moda transportasi sedang dipakai pada itinerary aktif.',
      ),
    ],
  },
  {
    method: 'delete',
    path: '/admin/transport-modes/{id}',
    operationId: 'deleteAdminTransportMode',
    tag: 'Admin',
    summary: 'Hapus moda transportasi',
    description:
      'Menghapus moda transportasi yang tidak lagi dipakai. Moda yang masih dipakai pada segmen perjalanan tidak dapat dihapus.',
    roles: ['admin'],
    kf: ['KF-16', 'KF-17'],
    parameters: [pathId('id', IDS.shuttle)],
    success: empty(204, 'Moda transportasi berhasil dihapus. Tidak ada isi respons.'),
    errors: [
      ...protectedErrors(),
      notFound('Moda transportasi tidak ditemukan.'),
      conflict(
        'TRANSPORT_IN_USE',
        'Moda transportasi masih dipakai pada itinerary atau segmen perjalanan.',
      ),
    ],
  },
  {
    method: 'get',
    path: '/admin/context',
    operationId: 'listAdminContext',
    tag: 'Admin',
    summary: 'Daftar konteks lingkungan',
    description:
      'Menampilkan data cuaca dan lalu lintas yang tersimpan untuk setiap wilayah.',
    roles: ['admin'],
    kf: ['KF-30'],
    parameters: [
      query('wilayah_id', 'Filter wilayah.', {
        type: 'string',
        format: 'uuid',
      }, IDS.regionBandung),
      ...pageQuery(),
    ],
    success: listResponse(
      200,
      'Daftar konteks lingkungan berhasil diambil.',
      'EnvironmentContext',
      contextListExample,
    ),
    errors: [...protectedErrors(), badRequest('Filter konteks tidak valid.')],
  },
  {
    method: 'post',
    path: '/admin/context',
    operationId: 'createAdminContext',
    tag: 'Admin',
    summary: 'Tambah konteks lingkungan',
    description:
      'Menambahkan data konteks cuaca dan lalu lintas untuk satu wilayah. Data ini dipakai pada perhitungan rekomendasi berikutnya.',
    roles: ['admin'],
    kf: ['KF-30'],
    body: {
      required: true,
      schema: ref('ContextInput'),
      example: {
        wilayah_id: IDS.regionBarat,
        kondisi_cuaca: 'Cerah Berawan',
        suhu_celsius: 27.2,
        tingkat_curah_hujan: 0,
        kondisi_lalu_lintas: 'Lancar',
        ada_insiden_kecelakaan: false,
        rata_rata_kepadatan_jalan: 0.35,
      },
      description: 'Data konteks lingkungan baru.',
    },
    success: detail(
      201,
      'Konteks lingkungan berhasil ditambahkan.',
      'EnvironmentContext',
      createdContextExample,
    ),
    errors: [
      ...protectedErrors(),
      notFound('Wilayah tidak ditemukan.'),
      validation('Data konteks belum lengkap atau nilai di luar rentang.', [
        { field: 'rata_rata_kepadatan_jalan', message: 'Nilai harus antara 0 sampai 1.' },
      ]),
    ],
  },
  {
    method: 'put',
    path: '/admin/context/{id}',
    operationId: 'updateAdminContext',
    tag: 'Admin',
    summary: 'Ubah konteks lingkungan',
    description:
      'Memperbarui data cuaca, lalu lintas, atau insiden pada satu konteks lingkungan.',
    roles: ['admin'],
    kf: ['KF-30'],
    parameters: [pathId('id', IDS.contextBandung)],
    body: {
      required: true,
      schema: ref('ContextInput'),
      example: {
        wilayah_id: IDS.regionBandung,
        kondisi_cuaca: 'Berawan',
        suhu_celsius: 25.4,
        tingkat_curah_hujan: 0.2,
        kondisi_lalu_lintas: 'Lancar',
        ada_insiden_kecelakaan: false,
        rata_rata_kepadatan_jalan: 0.42,
      },
      description: 'Data konteks lingkungan yang diperbarui.',
    },
    success: detail(
      200,
      'Konteks lingkungan berhasil diperbarui.',
      'EnvironmentContext',
      updatedContextExample,
    ),
    errors: [
      ...protectedErrors(),
      notFound('Konteks lingkungan atau wilayah tidak ditemukan.'),
      validation('Data konteks belum lengkap atau nilai di luar rentang.'),
    ],
  },
  {
    method: 'delete',
    path: '/admin/context/{id}',
    operationId: 'deleteAdminContext',
    tag: 'Admin',
    summary: 'Hapus konteks lingkungan',
    description:
      'Menghapus data konteks yang tidak lagi dipakai. Konteks yang masih dirujuk rekomendasi tidak dapat dihapus.',
    roles: ['admin'],
    kf: ['KF-30'],
    parameters: [pathId('id', IDS.contextBarat)],
    success: empty(204, 'Konteks lingkungan berhasil dihapus. Tidak ada isi respons.'),
    errors: [
      ...protectedErrors(),
      notFound('Konteks lingkungan tidak ditemukan.'),
      conflict(
        'CONTEXT_IN_USE',
        'Konteks lingkungan masih dirujuk oleh rekomendasi yang tersimpan.',
      ),
    ],
  },
  {
    method: 'get',
    path: '/admin/itineraries',
    operationId: 'listAdminItineraries',
    tag: 'Admin',
    summary: 'Daftar seluruh itinerary',
    description:
      'Menampilkan itinerary seluruh wisatawan dengan filter status, pemilik, dan kata kunci.',
    roles: ['admin'],
    kf: ['KF-10'],
    parameters: [
      query('wisatawan_id', 'Filter pemilik itinerary.', {
        type: 'string',
        format: 'uuid',
      }, IDS.tourist),
      query('status_rencana', 'Filter status.', {
        type: 'string',
        enum: ['draft', 'aktif', 'selesai', 'dibatalkan'],
      }, 'aktif'),
      searchQuery('Cari judul itinerary.'),
      ...pageQuery(),
    ],
    success: listResponse(
      200,
      'Daftar itinerary berhasil diambil.',
      'ItinerarySummary',
      itineraryListExample,
    ),
    errors: [...protectedErrors(), badRequest('Filter itinerary tidak valid.')],
  },
  {
    method: 'get',
    path: '/admin/itineraries/{id}',
    operationId: 'getAdminItinerary',
    tag: 'Admin',
    summary: 'Detail itinerary admin',
    description:
      'Menampilkan detail itinerary beserta preferensi, perhentian, dan rekomendasi teratas.',
    roles: ['admin'],
    kf: ['KF-10', 'KF-28'],
    parameters: [pathId('id', IDS.itinerary)],
    success: detail(200, 'Detail itinerary berhasil diambil.', 'ItineraryDetail', {
      data: itineraryDetail,
    }),
    errors: [...protectedErrors(), notFound('Itinerary tidak ditemukan.')],
  },
  {
    method: 'put',
    path: '/admin/itineraries/{id}',
    operationId: 'updateAdminItinerary',
    tag: 'Admin',
    summary: 'Ubah itinerary admin',
    description:
      'Memperbarui data utama itinerary dan status rencana. Perubahan memicu perhitungan ulang rekomendasi bila data perjalanan berubah.',
    roles: ['admin'],
    kf: ['KF-09', 'KF-28'],
    parameters: [pathId('id', IDS.itinerary)],
    body: {
      required: true,
      schema: adminItineraryInput,
      example: {
        judul_perjalanan: 'Bandung Heritage & Kuliner Weekend',
        tanggal_mulai: '2026-11-14',
        tanggal_selesai: '2026-11-15',
        jumlah_wisatawan: 2,
        total_anggaran: 1500000,
        status_rencana: 'selesai',
        prioritas_utama: 'kenyamanan',
        hindari_jalan_kaki_jauh: true,
        maksimal_transit: 2,
        preferensi_biaya: 'standar',
      },
      description: 'Data itinerary yang dapat diubah admin.',
    },
    success: detail(
      200,
      'Itinerary berhasil diperbarui oleh admin.',
      'ItineraryDetail',
      updatedItineraryExample,
    ),
    errors: [
      ...protectedErrors(),
      notFound('Itinerary tidak ditemukan.'),
      validation('Data itinerary belum lengkap atau status tidak valid.'),
    ],
  },
  {
    method: 'delete',
    path: '/admin/itineraries/{id}',
    operationId: 'deleteAdminItinerary',
    tag: 'Admin',
    summary: 'Hapus itinerary admin',
    description:
      'Menghapus itinerary beserta seluruh data turunannya. Tindakan ini berlaku untuk semua status.',
    roles: ['admin'],
    kf: ['KF-12'],
    parameters: [pathId('id', IDS.itinerary2)],
    success: empty(204, 'Itinerary berhasil dihapus. Tidak ada isi respons.'),
    errors: [...protectedErrors(), notFound('Itinerary tidak ditemukan.')],
  },
  {
    method: 'get',
    path: '/admin/recommendations',
    operationId: 'listAdminRecommendations',
    tag: 'Admin',
    summary: 'Daftar seluruh rekomendasi',
    description:
      'Menampilkan rekomendasi seluruh itinerary untuk pemantauan kualitas dan audit hasil perhitungan.',
    roles: ['admin'],
    kf: ['KF-26', 'KF-27', 'KF-33'],
    parameters: [
      query('itinerary_id', 'Filter itinerary.', {
        type: 'string',
        format: 'uuid',
      }, IDS.itinerary),
      query('ranking', 'Filter peringkat.', { type: 'integer', minimum: 1 }, 1),
      ...pageQuery(),
    ],
    success: listResponse(
      200,
      'Daftar rekomendasi berhasil diambil.',
      'Recommendation',
      recommendationListExample,
    ),
    errors: [...protectedErrors(), badRequest('Filter rekomendasi tidak valid.')],
  },
  {
    method: 'get',
    path: '/admin/recommendations/{id}',
    operationId: 'getAdminRecommendation',
    tag: 'Admin',
    summary: 'Detail rekomendasi admin',
    description:
      'Menampilkan rincian skor dan penjelasan konteks satu rekomendasi untuk keperluan audit.',
    roles: ['admin'],
    kf: ['KF-27', 'KF-31', 'KF-33'],
    parameters: [pathId('id', IDS.recommendation)],
    success: detail(
      200,
      'Detail rekomendasi berhasil diambil.',
      'Recommendation',
      { data: recommendations[0] },
    ),
    errors: [...protectedErrors(), notFound('Rekomendasi tidak ditemukan.')],
  },
  {
    method: 'get',
    path: '/admin/notifications',
    operationId: 'listAdminNotifications',
    tag: 'Admin',
    summary: 'Daftar seluruh notifikasi',
    description:
      'Menampilkan notifikasi perjalanan dari seluruh wisatawan untuk pemantauan kendala.',
    roles: ['admin'],
    kf: ['KF-29'],
    parameters: [
      query('tingkat_urgensi', 'Filter urgensi.', {
        type: 'string',
        enum: ['info', 'peringatan', 'kritis'],
      }, 'peringatan'),
      query('is_dibaca', 'Filter status baca.', { type: 'boolean' }),
      ...pageQuery(),
    ],
    success: listResponse(
      200,
      'Daftar notifikasi berhasil diambil.',
      'Notification',
      notificationListExample,
    ),
    errors: [...protectedErrors(), badRequest('Filter notifikasi tidak valid.')],
  },
  {
    method: 'get',
    path: '/admin/reviews',
    operationId: 'listAdminReviews',
    tag: 'Admin',
    summary: 'Daftar ulasan untuk moderasi',
    description:
      'Menampilkan seluruh ulasan, termasuk yang belum dipublikasikan, untuk proses moderasi.',
    roles: ['admin'],
    kf: ['KF-06'],
    parameters: [
      query('status_publikasi', 'Filter status publikasi.', {
        type: 'boolean',
      }, false),
      query('place_id', 'Filter destinasi.', {
        type: 'string',
        format: 'uuid',
      }),
      searchQuery('Cari isi ulasan atau nama penulis.'),
      ...pageQuery(),
    ],
    success: listResponse(200, 'Daftar ulasan berhasil diambil.', 'Review', reviewListExample),
    errors: [...protectedErrors(), badRequest('Filter ulasan tidak valid.')],
  },
  {
    method: 'patch',
    path: '/admin/reviews/{id}',
    operationId: 'moderateAdminReview',
    tag: 'Admin',
    summary: 'Moderasi ulasan',
    description:
      'Mengubah status publikasi ulasan. Bila disetujui, ulasan langsung tampil pada endpoint publik.',
    roles: ['admin'],
    kf: ['KF-06'],
    parameters: [pathId('id', reviews[2].ulasan_id)],
    body: {
      required: true,
      schema: ref('ReviewModerationInput'),
      example: {
        status_publikasi: true,
        catatan_moderasi: 'Ulasan sudah diperiksa dan layak tampil.',
      },
      description: 'Keputusan moderasi dan catatan opsional.',
    },
    success: detail(200, 'Status publikasi ulasan berhasil diperbarui.', 'Review', moderatedReviewExample),
    errors: [
      ...protectedErrors(),
      notFound('Ulasan tidak ditemukan.'),
      validation('Status publikasi wajib berupa boolean.'),
    ],
  },
  {
    method: 'delete',
    path: '/admin/reviews/{id}',
    operationId: 'deleteAdminReview',
    tag: 'Admin',
    summary: 'Hapus ulasan',
    description:
      'Menghapus ulasan yang melanggar aturan. Tindakan ini tidak dapat dibatalkan.',
    roles: ['admin'],
    kf: ['KF-06'],
    parameters: [pathId('id', reviews[2].ulasan_id)],
    success: empty(204, 'Ulasan berhasil dihapus. Tidak ada isi respons.'),
    errors: [...protectedErrors(), notFound('Ulasan tidak ditemukan.')],
  },
  {
    method: 'get',
    path: '/admin/audit-logs',
    operationId: 'listAdminAuditLogs',
    tag: 'Admin',
    summary: 'Jejak audit seluruh sistem',
    description:
      'Menampilkan seluruh aktivitas perubahan data dari admin, mitra, dan layanan otomatis.',
    roles: ['admin'],
    kf: ['KF-19', 'KF-33'],
    parameters: [
      query('entitas_terdampak', 'Filter entitas.', { type: 'string' }, 'transportasi'),
      query('aktor_pelaksana', 'Filter nama pelaku.', { type: 'string' }, 'Dewi Lestari'),
      query('aksi', 'Filter aksi.', {
        type: 'string',
        enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'VERIFY'],
      }),
      query('dari', 'Tanggal awal.', { type: 'string', format: 'date' }),
      query('sampai', 'Tanggal akhir.', { type: 'string', format: 'date' }),
      ...pageQuery(),
    ],
    success: listResponse(200, 'Jejak audit berhasil diambil.', 'AuditLog', logListExample),
    errors: [...protectedErrors(), badRequest('Filter audit tidak valid.')],
  },
]

export const adminTagDescriptions = [
  {
    name: 'Admin',
    description:
      'Pengelolaan pengguna, mitra, wilayah, destinasi, fasilitas, transportasi, konteks, itinerary, rekomendasi, notifikasi, ulasan, dan jejak audit.',
  },
]
