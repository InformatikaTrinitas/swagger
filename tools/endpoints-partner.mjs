import {
  IDS,
  auditLogs,
  list,
  listMeta,
  partnerFleets,
} from './data.mjs'
import { ref } from './schemas.mjs'
import {
  badRequest,
  conflict,
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
  searchQuery,
  sortQuery,
  unauthenticated,
  validation,
} from './helpers.mjs'

const fleetListExample = list(partnerFleets, listMeta(2, 10, 1))

const fleetCreatedExample = {
  data: {
    ...partnerFleets[0],
    transportasi_id: 'f1000000-0000-4000-8000-000000000099',
    nama_moda: 'GoCar Bandung',
  },
  message: 'Armada berhasil ditambahkan.',
}

const fleetUpdatedExample = {
  data: {
    ...partnerFleets[0],
    detail: {
      ...partnerFleets[0].detail,
      tarif_per_km: 5000,
    },
  },
  message: 'Armada berhasil diperbarui.',
}

const auditListExample = list(auditLogs, listMeta(3, 10, 1))

export const partnerEndpoints = [
  {
    method: 'get',
    path: '/partner/fleets',
    operationId: 'listPartnerFleets',
    tag: 'Mitra',
    summary: 'Daftar armada mitra',
    description:
      'Menampilkan seluruh armada milik mitra yang sedang masuk. Data mencakup jenis transportasi, kapasitas, tarif, dan status aktif.',
    roles: ['partner'],
    kf: ['KF-14', 'KF-17'],
    parameters: [
      query('status_aktif', 'Filter status aktif.', { type: 'boolean' }),
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
      searchQuery('Cari nama armada.'),
      sortQuery(['terbaru', 'nama', 'kapasitas']),
      ...pageQuery(),
    ],
    success: listResponse(
      200,
      'Daftar armada berhasil diambil.',
      'TransportMode',
      fleetListExample,
    ),
    errors: [
      unauthenticated(),
      forbidden('Hanya mitra yang dapat melihat daftar armada.'),
      badRequest('Filter armada tidak valid.'),
      internal(),
    ],
  },
  {
    method: 'post',
    path: '/partner/fleets',
    operationId: 'createPartnerFleet',
    tag: 'Mitra',
    summary: 'Tambah armada mitra',
    description:
      'Menambahkan moda transportasi baru milik mitra. Sistem mencatat aktivitas pembuatan ke data_log secara otomatis.',
    roles: ['partner'],
    kf: ['KF-13', 'KF-17', 'KF-19'],
    body: {
      required: true,
      schema: ref('FleetInput'),
      example: {
        wilayah_id: IDS.regionBandung,
        nama_moda: 'GoCar Bandung',
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
      description:
        'Data armada dan rincian tarif sesuai jenis transportasi.',
    },
    success: detail(
      201,
      'Armada berhasil ditambahkan.',
      'TransportMode',
      fleetCreatedExample,
    ),
    errors: [
      unauthenticated(),
      forbidden('Hanya mitra yang dapat menambah armada.'),
      validation('Data armada belum lengkap atau tarif tidak valid.', [
        { field: 'nama_moda', message: 'Nama armada wajib diisi.' },
        { field: 'kapasitas_penumpang', message: 'Kapasitas minimal 1.' },
      ]),
      conflict(
        'FLEET_ALREADY_EXISTS',
        'Armada dengan nama dan jenis yang sama sudah terdaftar.',
      ),
      internal(),
    ],
  },
  {
    method: 'get',
    path: '/partner/fleets/{id}',
    operationId: 'getPartnerFleet',
    tag: 'Mitra',
    summary: 'Detail armada mitra',
    description:
      'Menampilkan detail satu armada beserta rincian tarif dan wilayah layanan.',
    roles: ['partner'],
    kf: ['KF-14', 'KF-17'],
    parameters: [pathId('id', IDS.gocar)],
    success: detail(200, 'Detail armada berhasil diambil.', 'TransportMode', {
      data: partnerFleets[0],
    }),
    errors: [
      unauthenticated(),
      forbidden('Armada ini bukan milik mitra yang sedang masuk.'),
      notFound('Armada tidak ditemukan.'),
      internal(),
    ],
  },
  {
    method: 'put',
    path: '/partner/fleets/{id}',
    operationId: 'updatePartnerFleet',
    tag: 'Mitra',
    summary: 'Ubah armada mitra',
    description:
      'Memperbarui data armada dan tarif. Setiap perubahan dicatat pada data_log untuk kebutuhan audit.',
    roles: ['partner'],
    kf: ['KF-15', 'KF-19'],
    parameters: [pathId('id', IDS.gocar)],
    body: {
      required: true,
      schema: ref('FleetInput'),
      example: {
        wilayah_id: IDS.regionBandung,
        nama_moda: 'GoCar Bandung',
        jenis_transportasi: 'ONLINE_TAXI',
        kapasitas_penumpang: 4,
        status_aktif: true,
        sumber_data: 'Mitra Portal',
        detail: {
          tarif_dasar: 10000,
          tarif_per_km: 5000,
          surge_multiplier: 1.2,
        },
      },
      description: 'Data armada yang diperbarui.',
    },
    success: detail(
      200,
      'Armada berhasil diperbarui.',
      'TransportMode',
      fleetUpdatedExample,
    ),
    errors: [
      unauthenticated(),
      forbidden('Armada ini bukan milik mitra yang sedang masuk.'),
      notFound('Armada tidak ditemukan.'),
      validation('Data armada belum lengkap atau tarif tidak valid.', [
        { field: 'tarif_per_km', message: 'Tarif per kilometer tidak boleh negatif.' },
      ]),
      conflict(
        'FLEET_IN_USE',
        'Armada sedang dipakai pada itinerary aktif sehingga tarif tidak dapat diubah.',
      ),
      internal(),
    ],
  },
  {
    method: 'delete',
    path: '/partner/fleets/{id}',
    operationId: 'deletePartnerFleet',
    tag: 'Mitra',
    summary: 'Hapus armada mitra',
    description:
      'Menghapus armada yang tidak lagi dipakai. Armada yang masih terhubung dengan segmen perjalanan aktif tidak dapat dihapus.',
    roles: ['partner'],
    kf: ['KF-16', 'KF-19'],
    parameters: [pathId('id', IDS.gocar)],
    success: empty(204, 'Armada berhasil dihapus. Tidak ada isi respons.'),
    errors: [
      unauthenticated(),
      forbidden('Armada ini bukan milik mitra yang sedang masuk.'),
      notFound('Armada tidak ditemukan.'),
      conflict(
        'FLEET_IN_USE',
        'Armada masih dipakai pada itinerary atau segmen perjalanan aktif.',
      ),
      internal(),
    ],
  },
  {
    method: 'get',
    path: '/partner/audit-logs',
    operationId: 'listPartnerAuditLogs',
    tag: 'Mitra',
    summary: 'Jejak audit mitra',
    description:
      'Menampilkan riwayat perubahan data yang dilakukan mitra, termasuk perubahan tarif, status armada, dan verifikasi.',
    roles: ['partner'],
    kf: ['KF-19'],
    parameters: [
      query('entitas_terdampak', 'Filter nama entitas.', {
        type: 'string',
      }, 'transportasi'),
      query('aksi', 'Filter jenis aksi.', {
        type: 'string',
        enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'VERIFY'],
      }),
      query('dari', 'Tanggal awal log.', { type: 'string', format: 'date' }),
      query('sampai', 'Tanggal akhir log.', { type: 'string', format: 'date' }),
      ...pageQuery(),
    ],
    success: listResponse(
      200,
      'Jejak audit berhasil diambil.',
      'AuditLog',
      auditListExample,
    ),
    errors: [
      unauthenticated(),
      forbidden('Hanya mitra yang dapat melihat jejak audit mitra.'),
      badRequest('Filter audit tidak valid.'),
      internal(),
    ],
  },
]

export const partnerTagDescriptions = [
  {
    name: 'Mitra',
    description:
      'Pengelolaan armada mitra beserta tarif, ketersediaan, dan jejak audit perubahan.',
  },
]
