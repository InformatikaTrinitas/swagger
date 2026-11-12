import { ref } from './schemas.mjs'

export const json = (status, description, schema, example) => ({
  status,
  description,
  contentType: 'application/json',
  schema,
  example,
})

export const detail = (status, description, schemaName, example) =>
  json(
    status,
    description,
    {
      type: 'object',
      required: ['data'],
      properties: {
        data: ref(schemaName),
        message: {
          type: 'string',
          description: 'Pesan singkat untuk pengguna.',
        },
      },
    },
    example,
  )

export const list = (status, description, schemaName, example) =>
  json(
    status,
    description,
    {
      type: 'object',
      required: ['data', 'meta'],
      properties: {
        data: {
          type: 'array',
          items: ref(schemaName),
        },
        message: {
          type: 'string',
          description: 'Pesan singkat untuk pengguna.',
        },
        meta: ref('Meta'),
      },
    },
    example,
  )

export const custom = (status, description, schema, example) =>
  json(status, description, schema, example)

export const empty = (status, description) => ({
  status,
  description,
  noContent: true,
})

export const eventStream = (status, description, example) => ({
  status,
  description,
  contentType: 'text/event-stream',
  schema: {
    type: 'string',
    description: 'Aliran event Server-Sent Events.',
  },
  example,
})

export const err = (status, code, message, details) => ({
  status,
  code,
  message,
  ...(details ? { details } : {}),
})

export const validation = (
  message = 'Data yang dikirim belum lengkap atau formatnya belum benar.',
  details = [
    {
      field: 'email',
      message: 'Format email belum benar.',
    },
  ],
) => err(422, 'VALIDATION_ERROR', message, details)

export const unauthenticated = (
  message = 'Sesi tidak valid, token kedaluwarsa, atau token tidak dikirim.',
) => err(401, 'UNAUTHENTICATED', message)

export const forbidden = (
  message = 'Peran aktif tidak memiliki izin untuk mengakses sumber daya ini.',
) => err(403, 'FORBIDDEN_ROLE', message)

export const notFound = (
  message = 'Data yang diminta tidak ditemukan.',
  code = 'NOT_FOUND',
) => err(404, code, message)

export const conflict = (
  code = 'CONFLICT',
  message = 'Permintaan bertentangan dengan data yang sudah ada.',
) => err(409, code, message)

export const internal = (
  message = 'Terjadi kesalahan pada server saat memproses permintaan.',
) => err(500, 'INTERNAL_ERROR', message)

export const rateLimited = (
  message = 'Terlalu banyak permintaan. Coba lagi beberapa saat lagi.',
) => err(429, 'RATE_LIMITED', message)

export const upstream = (
  message = 'Layanan pihak ketiga sedang tidak tersedia.',
  code = 'UPSTREAM_UNAVAILABLE',
) => err(503, code, message)

export const badRequest = (
  message = 'Parameter permintaan tidak dapat diproses atau format data tidak valid.',
  code = 'BAD_REQUEST',
) => err(400, code, message)

export const protectedErrors = () => [
  badRequest(),
  unauthenticated(),
  forbidden(),
  rateLimited(),
  internal(),
]

export const pathId = (name = 'id', example = '') => ({
  in: 'path',
  name,
  required: true,
  description: `${name} pada URL.`,
  schema: { type: 'string', format: 'uuid' },
  example,
})

export const query = (name, description, schema = { type: 'string' }, example) => ({
  in: 'query',
  name,
  required: false,
  description,
  schema,
  ...(example !== undefined ? { example } : {}),
})

export const pageQuery = () => [
  query('page', 'Halaman data yang diminta.', {
    type: 'integer',
    minimum: 1,
    default: 1,
  }),
  query('per_page', 'Jumlah data per halaman.', {
    type: 'integer',
    minimum: 1,
    maximum: 100,
    default: 10,
  }),
]

export const searchQuery = (description = 'Kata kunci pencarian.') =>
  query('q', description, { type: 'string' }, 'bandung')

export const sortQuery = (values = ['terbaru', 'terlama']) =>
  query('sort', 'Urutan data.', { type: 'string', enum: values })
