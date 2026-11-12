import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'
import { marked } from 'marked'
import { schemas, ref } from './schemas.mjs'
import { publicEndpoints, publicTagDescriptions } from './endpoints-public.mjs'
import { touristEndpoints, touristTagDescriptions } from './endpoints-tourist.mjs'
import { partnerEndpoints, partnerTagDescriptions } from './endpoints-partner.mjs'
import { adminEndpoints, adminTagDescriptions } from './endpoints-admin.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const docsDir = join(root, 'docs')
const assetsDir = join(root, 'assets')

const rawEndpoints = [
  ...publicEndpoints,
  ...touristEndpoints,
  ...partnerEndpoints,
  ...adminEndpoints,
]

const tagOrder = [
  'Sistem',
  'Autentikasi dan Akun',
  'Destinasi dan Ulasan',
  'Wilayah dan Konteks',
  'Transportasi',
  'Itinerary',
  'Rekomendasi dan Riwayat',
  'Notifikasi',
  'Mitra',
  'Admin',
]

const tagDescriptions = new Map(
  [
    ...publicTagDescriptions,
    ...touristTagDescriptions,
    ...partnerTagDescriptions,
    ...adminTagDescriptions,
  ].map((item) => [item.name, item.description]),
)

const roleLabels = {
  public: 'Publik',
  tourist: 'Wisatawan',
  partner: 'Mitra',
  admin: 'Admin',
}

const enrichOperation = (operation) => {
  const existingStatuses = new Set((operation.errors ?? []).map((e) => e.status))
  const newErrors = [...(operation.errors ?? [])]
  const summaryLower = operation.summary ? operation.summary.toLowerCase() : 'operasi'
  const rolesText = (operation.roles ?? []).map((r) => roleLabels[r] || r).join(', ')

  // 1. 400 Bad Request
  if (!existingStatuses.has(400)) {
    let msg = `Format parameter pada permintaan ${summaryLower} tidak valid atau nilai query di luar batas yang diizinkan.`
    if (operation.path.includes('{')) {
      msg = `Identifier pada path URL '${operation.path}' tidak berformat UUID atau integer yang valid.`
    } else if (operation.body) {
      msg = `Struktur tubuh permintaan (request body) tidak dapat diproses atau format JSON rusak.`
    }
    newErrors.push({
      status: 400,
      code: 'BAD_REQUEST',
      message: msg,
    })
  }

  // 2. 401 Unauthorized (jika bukan endpoint publik)
  if (!operation.public && !existingStatuses.has(401)) {
    newErrors.push({
      status: 401,
      code: 'UNAUTHENTICATED',
      message: 'Sesi tidak valid, token kedaluwarsa, atau header Authorization Bearer tidak disertakan.',
    })
  }

  // 3. 403 Forbidden (jika bukan endpoint publik)
  if (!operation.public && !existingStatuses.has(403)) {
    newErrors.push({
      status: 403,
      code: 'FORBIDDEN_ROLE',
      message: `Akses ditolak. Peran aktif Anda tidak memiliki izin untuk ${summaryLower}. Endpoint ini dibatasi untuk peran: ${rolesText}.`,
    })
  }

  // 4. 404 Not Found (jika memiliki path parameter ID atau berorientasi detail/entitas spesifik)
  if (
    !existingStatuses.has(404) &&
    (operation.path.includes('{') || summaryLower.includes('detail') || summaryLower.includes('ambil'))
  ) {
    newErrors.push({
      status: 404,
      code: 'NOT_FOUND',
      message: `Data untuk ${summaryLower} dengan ID yang diminta tidak ditemukan dalam basis data.`,
    })
  }

  // 5. 409 Conflict (jika mutasi atau operasi dengan potensi benturan entitas/jadwal)
  if (
    !existingStatuses.has(409) &&
    (['post', 'put', 'patch', 'delete'].includes(operation.method.toLowerCase()) ||
      operation.path.includes('/auth/') ||
      operation.path.includes('/itineraries') ||
      operation.path.includes('/fleets') ||
      operation.path.includes('/places') ||
      operation.path.includes('/transport') ||
      operation.path.includes('/reviews') ||
      operation.path.includes('/regions'))
  ) {
    let conflictMsg = `Permintaan bertentangan dengan data atau kondisi sistem saat ini (misalnya duplikasi data unik atau benturan jadwal/relasi entitas).`
    if (operation.path.includes('/auth/register')) {
      conflictMsg = 'Alamat email atau nomor telepon sudah terdaftar pada akun lain.'
    } else if (operation.path.includes('/reviews')) {
      conflictMsg = 'Anda sudah mengirimkan ulasan untuk destinasi ini pada periode kunjungan yang sama.'
    } else if (operation.path.includes('/itineraries')) {
      conflictMsg = 'Jadwal kunjungan atau urutan destinasi bertabrakan dengan jadwal lain pada itinerary yang sama.'
    } else if (operation.path.includes('/fleets')) {
      conflictMsg = 'Plat nomor armada atau kode kendaraan sudah terdaftar oleh mitra lain.'
    } else if (operation.path.includes('/places')) {
      conflictMsg = 'Nama tempat wisata sudah ada di wilayah ini atau kode destinasi duplikat.'
    } else if (operation.path.includes('/regions')) {
      conflictMsg = 'Kode wilayah atau nama wilayah sudah terdaftar dalam sistem.'
    }
    newErrors.push({
      status: 409,
      code: 'CONFLICT',
      message: conflictMsg,
    })
  }

  // 6. 422 Unprocessable Entity (jika memiliki body atau method mutasi)
  if (
    !existingStatuses.has(422) &&
    (operation.body || ['post', 'put', 'patch'].includes(operation.method.toLowerCase()))
  ) {
    newErrors.push({
      status: 422,
      code: 'VALIDATION_ERROR',
      message: `Data input untuk ${summaryLower} tidak lolos validasi aturan bisnis atau format field.`,
      details: [
        {
          field: 'payload',
          message: 'Terdapat isian yang belum lengkap atau nilainya berada di luar batasan yang ditentukan.',
        },
      ],
    })
  }

  // 7. 429 Too Many Requests (pada seluruh endpoint / API rate limit)
  if (!existingStatuses.has(429)) {
    newErrors.push({
      status: 429,
      code: 'RATE_LIMITED',
      message: 'Frekuensi permintaan melampaui batas kuota API Find Holiday. Silakan tunggu beberapa saat sebelum mengirim permintaan kembali.',
    })
  }

  // 8. 500 Internal Server Error (seluruh endpoint)
  if (!existingStatuses.has(500)) {
    newErrors.push({
      status: 500,
      code: 'INTERNAL_ERROR',
      message: `Terjadi kesalahan internal pada server saat memproses ${summaryLower}.`,
    })
  }

  // 9. 503 Service Unavailable (endpoint yang terhubung ke layanan eksternal cuaca, rute/transport, rekomendasi ML, atau notifikasi/stream)
  const upstreamTags = ['Konteks', 'Rekomendasi', 'Notifikasi', 'Transportasi', 'Sistem', 'Wilayah']
  const isUpstreamCandidate =
    upstreamTags.some((t) => operation.tag.includes(t)) ||
    operation.path.includes('/recommendations') ||
    operation.path.includes('/context') ||
    operation.path.includes('/weather') ||
    operation.path.includes('/alerts') ||
    operation.path.includes('/strategies') ||
    operation.path.includes('/modes') ||
    operation.path.includes('/health')

  if (!existingStatuses.has(503) && isUpstreamCandidate) {
    let upstreamMsg = 'Layanan pendukung eksternal sedang mengalami gangguan atau tidak dapat dihubungi.'
    if (operation.path.includes('weather') || operation.path.includes('context')) {
      upstreamMsg = 'Layanan penyedia data cuaca (BMKG / Weather Service) sedang mengalami gangguan atau batas kuota habis.'
    } else if (operation.path.includes('recommendations') || operation.path.includes('strategies')) {
      upstreamMsg = 'Mesin rekomendasi mobilitas (Mobility ML Recommendation Engine) sedang offline atau membutuhkan waktu respons lebih lama.'
    } else if (operation.path.includes('alerts')) {
      upstreamMsg = 'Layanan pemantauan kondisi cuaca dan lalu lintas real-time (SSE Service) sedang terputus.'
    }
    newErrors.push({
      status: 503,
      code: 'UPSTREAM_UNAVAILABLE',
      message: upstreamMsg,
    })
  }

  newErrors.sort((a, b) => a.status - b.status)

  return {
    ...operation,
    errors: newErrors,
  }
}

const endpoints = rawEndpoints.map(enrichOperation)

const roleByExampleLabel = {
  Wisatawan: 'tourist',
  Mitra: 'partner',
  Admin: 'admin',
}

const statusDescription = {
  200: 'Permintaan berhasil diproses.',
  201: 'Data entitas baru berhasil dibuat.',
  204: 'Permintaan berhasil diproses. Tidak ada konten respons.',
  400: 'Parameter permintaan tidak valid atau format data salah.',
  401: 'Autentikasi gagal atau token Bearer tidak valid.',
  403: 'Peran pengguna aktif tidak memiliki izin untuk tindakan ini.',
  404: 'Data atau entitas yang diminta tidak ditemukan.',
  409: 'Terjadi konflik data atau tabrakan status entitas.',
  422: 'Validasi data masukan gagal.',
  429: 'Batas frekuensi permintaan terlampaui (Rate limited).',
  500: 'Terjadi kesalahan internal pada server.',
  502: 'Gateway menerima respons tidak valid dari layanan hulu.',
  503: 'Layanan pihak ketiga pendukung sedang tidak tersedia.',
  504: 'Batas waktu permintaan ke layanan hulu terlampaui.',
}

const errorEnvelope = (error, index = 0) => ({
  error: {
    code: error.code,
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
  },
  request_id: `req_demo_${String(index + 1).padStart(4, '0')}`,
})

const buildResponse = (operation) => {
  const success = operation.success
  const response = {
    description: success.description,
    headers: {
      'X-Request-Id': {
        description: 'ID permintaan untuk penelusuran log.',
        schema: { type: 'string', example: 'req_demo_0001' },
      },
    },
  }

  if (success.noContent) {
    delete response.headers
    return response
  }

  const media = {
    schema: success.schema,
  }

  if (success.contentType === 'text/event-stream') {
    media.example = success.example
    response.content = {
      'text/event-stream': media,
    }
    return response
  }

  media.example = success.example
  if (operation.successExamples?.length) {
    delete media.example
    media.examples = Object.fromEntries(
      operation.successExamples.map((item) => [
        roleByExampleLabel[item.label] ?? item.label.toLowerCase().replace(/\s+/g, '_'),
        {
          summary: item.label,
          value: item.value,
        },
      ]),
    )
  }

  response.content = {
    'application/json': media,
  }
  return response
}

const buildErrorResponses = (operation) => {
  const grouped = new Map()
  for (const error of operation.errors ?? []) {
    if (!grouped.has(error.status)) grouped.set(error.status, [])
    grouped.get(error.status).push(error)
  }

  const responses = {}
  let index = 0
  for (const status of [...grouped.keys()].sort((a, b) => a - b)) {
    const items = grouped.get(status)
    const media = {
      schema: ref('ErrorEnvelope'),
    }

    if (items.length === 1) {
      media.example = errorEnvelope(items[0], index)
    } else {
      media.examples = Object.fromEntries(
        items.map((item) => [
          item.code.toLowerCase(),
          {
            summary: `${item.code}: ${item.message}`,
            value: errorEnvelope(item, index),
          },
        ]),
      )
    }
    index += 1

    responses[status] = {
      description: items.map((item) => `${statusDescription[status] ?? 'Kesalahan'} [${item.code}]: ${item.message}`).join(' '),
      headers: {
        'X-Request-Id': {
          description: 'ID unik permintaan untuk penelusuran audit dan log server.',
          schema: { type: 'string', example: 'req_demo_0001' },
        },
        ...(status === 429
          ? {
              'Retry-After': {
                description: 'Jumlah detik untuk menunggu sebelum mengirimkan permintaan berikutnya.',
                schema: { type: 'integer', example: 60 },
              },
            }
          : {}),
      },
      content: {
        'application/json': media,
      },
    }
  }
  return responses
}

const buildOperation = (operation) => {
  const tags = [operation.tag]
  const parameters = [...(operation.parameters ?? [])]
  const built = {
    tags,
    summary: operation.summary,
    description: operation.description,
    operationId: operation.operationId,
    parameters: parameters.length ? parameters : undefined,
    responses: {
      [operation.success.status]: buildResponse(operation),
      ...buildErrorResponses(operation),
    },
    security: operation.public ? [] : undefined,
    'x-roles': operation.roles,
  }

  if (operation.kf?.length) built['x-kf'] = operation.kf
  if (operation.proposed) built['x-proposed'] = true

  if (operation.body) {
    built.requestBody = {
      required: Boolean(operation.body.required),
      description: operation.body.description,
      content: {
        'application/json': {
          schema: operation.body.schema,
          example: operation.body.example,
        },
      },
    }
  }

  return built
}

const buildSpec = () => {
  const paths = {}
  for (const operation of endpoints) {
    if (!paths[operation.path]) paths[operation.path] = {}
    if (paths[operation.path][operation.method]) {
      throw new Error(
        `Endpoint ganda: ${operation.method.toUpperCase()} ${operation.path}`,
      )
    }
    paths[operation.path][operation.method] = buildOperation(operation)
  }

  return {
    openapi: '3.0.3',
    info: {
      title: 'Find Holiday API',
      version: '1.0.0',
      description: `Kontrak API untuk aplikasi Find Holiday: Context Aware Tourist Mobility.

Kontrak ini disusun dari dokumen kebutuhan, dokumen DFD-01 sampai DFD-10, rencana arsitektur, dan skema basis data pada sql/db_ppl.sql.

## Cara mencoba tanpa backend

1. Pilih peran aktif pada bilah atas halaman Swagger.
2. Pilih skenario respons. Pilihan positif mengembalikan kode 2xx. Pilihan negatif mengembalikan contoh kesalahan yang relevan.
3. Buka salah satu endpoint, tekan Try it out, lalu tekan Execute.
4. Semua permintaan dijawab oleh lapisan simulasi di browser. Tidak ada permintaan yang dikirim ke server.

## Pola umum

- Base path: /api/v1
- Autentikasi: Bearer token dengan izin sesuai peran.
- Sukses: amplop data, pesan opsional, dan meta untuk daftar.
- Gagal: objek error berisi code dan message, ditambah request_id.
- Tanggal: YYYY-MM-DD. Waktu: YYYY-MM-DD HH:MM:SS pada zona Asia/Jakarta.
- Boolean pada API dipetakan dari nilai 0 atau 1 pada basis data.

Dokumentasi lengkap tersedia pada folder docs dan dapat dibuka dari tautan Dokumentasi pada halaman simulasi.`,
      contact: {
        name: 'Tim Find Holiday',
        email: 'tim@findholiday.id',
      },
      license: {
        name: 'Hak cipta Find Holiday',
      },
    },
    externalDocs: {
      description: 'Dokumentasi Markdown dan HTML',
      url: './docs/index.html',
    },
    servers: [
      {
        url: './api/v1',
        description: 'Simulasi di browser tanpa backend',
      },
    ],
    tags: tagOrder.map((name) => ({
      name,
      description: tagDescriptions.get(name) ?? '',
    })),
    security: [{ bearerAuth: [] }],
    paths,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Sanctum token',
          description:
            'Token Bearer Sanctum untuk autentikasi API Find Holiday. Pada simulasi Swagger ini, token diisi secara otomatis sesuai peran aktif yang Anda pilih pada panel bilah atas.\n\nContoh token demo siap pakai:\n- **Wisatawan**: `1|fh_demo_tourist_9f8e7d6c5b4a39281706`\n- **Mitra Transportasi**: `2|fh_demo_partner_4c3b2a1908f7e6d5c4b3`\n- **Administrator**: `3|fh_demo_admin_7a6b5c4d3e2f1908a7b6`',
        },
      },
      schemas,
    },
  }
}

const pretty = (value) => JSON.stringify(value, null, 2)

const roleText = (roles) =>
  roles.map((role) => roleLabels[role] ?? role).join(', ')

const negativeSummary = (operation) => {
  const unique = new Map()
  for (const error of operation.errors ?? []) {
    unique.set(`${error.status}-${error.code}`, `${error.status} ${error.code}`)
  }
  return [...unique.values()].join(', ')
}

const buildCatalog = () => {
  const lines = [
    '# Katalog Endpoint',
    '',
    'Dokumen ini dibuat otomatis dari openapi.json. Setiap endpoint mencantumkan peran yang diizinkan, kode sukses, dan kode kesalahan yang mungkin muncul.',
    '',
    `Total endpoint: **${endpoints.length}**.`,
    '',
  ]

  for (const tag of tagOrder) {
    const items = endpoints.filter((item) => item.tag === tag)
    if (!items.length) continue
    lines.push(`## ${tag}`, '')
    lines.push(
      '| No | Metode | Path | Peran | Sukses | Kasus negatif |',
      '| ---: | --- | --- | --- | --- | --- |',
    )
    items.forEach((item, index) => {
      lines.push(
        `| ${index + 1} | ${item.method.toUpperCase()} | \`${item.path}\` | ${roleText(
          item.roles,
        )} | ${item.success.status} | ${negativeSummary(item)} |`,
      )
    })
    lines.push('')
  }

  lines.push('## Catatan', '')
  lines.push(
    '- Kode 401 dan 403 hanya muncul pada endpoint yang memerlukan token atau peran tertentu.',
    '- Kode 422 dipakai untuk kesalahan validasi field.',
    '- Kode 409 dipakai untuk konflik data, misalnya email sudah dipakai atau armada masih dipakai.',
    '- Kode 429 dipakai pada endpoint yang memiliki batas permintaan.',
    '- Kode 503 dipakai saat layanan pihak ketiga, seperti cuaca atau mesin rekomendasi, tidak tersedia.',
    '- Endpoint bertanda usulan perluasan memerlukan penyesuaian skema basis data. Lihat dokumen pemetaan basis data.',
  )
  return lines.join('\n')
}

const buildPositiveNegativeDoc = () => {
  const lines = [
    '# Contoh Positif dan Negatif per Endpoint',
    '',
    'Setiap bagian memperlihatkan contoh respons positif dan daftar kasus negatif. Semua contoh dapat dicoba pada halaman Swagger dengan memilih peran dan skenario respons.',
    '',
  ]

  for (const tag of tagOrder) {
    const items = endpoints.filter((item) => item.tag === tag)
    if (!items.length) continue
    lines.push(`## ${tag}`, '')

    for (const item of items) {
      const title = `${item.method.toUpperCase()} ${item.path}`
      lines.push(`### ${title}`, '')
      lines.push(item.description, '')
      lines.push(`- Peran: **${roleText(item.roles)}**`)
      lines.push(`- Sukses: **${item.success.status}** ${item.success.description}`)
      if (item.proposed) lines.push('- Status: **usulan perluasan**')
      if (item.kf?.length) lines.push(`- Kebutuhan: ${item.kf.join(', ')}`)
      lines.push('')

      lines.push('**Contoh respons positif**', '')
      if (item.success.noContent) {
        lines.push('Tidak ada isi respons. Server hanya mengembalikan kode 204.', '')
      } else if (item.success.contentType === 'text/event-stream') {
        lines.push('```text', item.success.example, '```', '')
      } else if (item.successExamples?.length) {
        item.successExamples.forEach((example) => {
          lines.push(`_${example.label}_`, '')
          lines.push('```json', pretty(example.value), '```', '')
        })
      } else {
        lines.push('```json', pretty(item.success.example), '```', '')
      }

      lines.push('**Kasus negatif**', '')
      if (!item.errors?.length) {
        lines.push('Tidak ada kasus negatif khusus.', '')
      } else {
        lines.push('| Status | Kode | Pesan | Contoh respons |')
        lines.push('| ---: | --- | --- | --- |')
        item.errors.forEach((error, index) => {
          const body = pretty(errorEnvelope(error, index)).replace(/\n/g, ' ')
          lines.push(
            `| ${error.status} | \`${error.code}\` | ${error.message} | \`${body.replace(
              /`/g,
              "'",
            )}\` |`,
          )
        })
        lines.push('')
      }
    }
  }
  return lines.join('\n')
}

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const addHeadingIds = (html) =>
  html.replace(/<h([1-6])>(.*?)<\/h\1>/g, (match, level, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim()
    return `<h${level} id="${slugify(text)}">${inner}</h${level}>`
  })

const writeDocsIndex = () => {
  const files = [
    'README.md',
    '01-ringkasan-dan-konvensi.md',
    '02-katalog-endpoint.md',
    '03-contoh-positif-negatif.md',
    '04-pemetaan-basis-data.md',
    '05-simulasi-dan-deploy.md',
    '06-traceability-kf.md',
  ].filter((name) => existsSync(join(docsDir, name)))

  const sections = []
  const nav = []
  for (const file of files) {
    const source = readFileSync(join(docsDir, file), 'utf8')
    const titleMatch = source.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1].trim() : file
    const id = `doc-${file.replace(/\.md$/, '')}`
    let html = marked.parse(source)
    html = html.replace(
      /href="(?:\.\/)?([^"]+\.md)"/g,
      (match, target) => `href="#doc-${target.replace(/\.md$/, '')}"`,
    )
    html = addHeadingIds(html)
    sections.push(
      `<section class="docs-section" id="${id}" data-doc-title="${title}">\n${html}\n</section>`,
    )
    nav.push(
      `<a class="docs-nav-link" href="#${id}"><span>${title}</span></a>`,
    )
  }

  const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="Dokumentasi kontrak API Find Holiday" />
  <title>Dokumentasi API Find Holiday</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230b3f3b'/%3E%3Cpath d='M8 23c4-1.5 6-5 7-9 1-4 3-6 7-7 1 5-1 9-4 12-2.5 2.5-6 4-10 4Z' fill='%235eead4'/%3E%3C/svg%3E" />
  <link rel="stylesheet" href="./docs.css" />
</head>
<body>
  <header class="docs-topbar">
    <a class="docs-brand" href="../index.html">
      <span class="brand-mark" aria-hidden="true">FH</span>
      <span>
        <strong>Find Holiday API</strong>
        <small>Dokumentasi kontrak dan simulasi</small>
      </span>
    </a>
    <nav class="docs-actions" aria-label="Tautan utama">
      <a class="docs-action" href="../index.html">Buka Swagger</a>
      <a class="docs-action" href="../openapi.yaml" download>Unduh OpenAPI YAML</a>
    </nav>
  </header>
  <div class="docs-layout">
    <aside class="docs-sidebar" aria-label="Daftar dokumen">
      <p class="docs-sidebar-title">Isi dokumentasi</p>
      <nav class="docs-nav">
        ${nav.join('\n        ')}
      </nav>
      <div class="docs-sidebar-note">
        <strong>Mode simulasi</strong>
        <p>Semua endpoint pada halaman Swagger dijawab di browser. Tidak ada backend yang perlu dijalankan.</p>
      </div>
    </aside>
    <main class="docs-main">
      <div class="docs-intro">
        <p class="eyebrow">Kontrak API versi 1.0.0</p>
        <h1>Dokumentasi Find Holiday</h1>
        <p>Pelajari pola respons, daftar endpoint, contoh positif dan negatif, pemetaan basis data, serta cara menjalankan simulasi.</p>
      </div>
      ${sections.join('\n')}
      <footer class="docs-footer">
        <p>Dokumen ini dibuat dari openapi.json pada ${new Date().toISOString().slice(0, 10)}. Gunakan halaman Swagger untuk mencoba setiap endpoint.</p>
        <a href="../index.html">Kembali ke simulasi Swagger</a>
      </footer>
    </main>
  </div>
  <script>
    const links = [...document.querySelectorAll('.docs-nav-link')];
    const sections = [...document.querySelectorAll('.docs-section')];
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          links.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id));
        }
      }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
      sections.forEach((section) => observer.observe(section));
    }
  </script>
</body>
</html>`

  writeFileSync(join(docsDir, 'index.html'), html)
}

const writeMockData = (spec) => {
  const operations = endpoints.map((operation) => {
    const successByRole = {}
    for (const example of operation.successExamples ?? []) {
      const role = roleByExampleLabel[example.label]
      if (role) successByRole[role] = example.value
    }

    return {
      method: operation.method.toUpperCase(),
      path: operation.path,
      operationId: operation.operationId,
      tag: operation.tag,
      roles: operation.roles,
      success: {
        status: operation.success.status,
        contentType: operation.success.contentType ?? 'application/json',
        body: operation.success.noContent ? null : operation.success.example,
      },
      ...(Object.keys(successByRole).length ? { successByRole } : {}),
      errors: operation.errors ?? [],
    }
  })

  writeFileSync(
    join(root, 'mock-data.json'),
    `${JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        base_path: '/api/v1',
        operations,
      },
      null,
      2,
    )}\n`,
  )
}

const copyAssets = () => {
  const source = join(root, 'node_modules', 'swagger-ui-dist')
  const files = [
    'swagger-ui.css',
    'swagger-ui-bundle.js',
    'swagger-ui-standalone-preset.js',
  ]
  for (const file of files) {
    copyFileSync(join(source, file), join(assetsDir, file))
  }
}

const main = () => {
  mkdirSync(docsDir, { recursive: true })
  mkdirSync(assetsDir, { recursive: true })
  const spec = buildSpec()
  writeFileSync(
    join(root, 'openapi.yaml'),
    yaml.dump(spec, { noRefs: true, lineWidth: 120, sortKeys: false }),
  )
  writeFileSync(join(root, 'openapi.json'), `${JSON.stringify(spec, null, 2)}\n`)
  writeFileSync(join(docsDir, '02-katalog-endpoint.md'), `${buildCatalog()}\n`)
  writeFileSync(
    join(docsDir, '03-contoh-positif-negatif.md'),
    `${buildPositiveNegativeDoc()}\n`,
  )
  writeMockData(spec)
  copyAssets()
  writeDocsIndex()

  console.log(`Kontrak dibuat: ${endpoints.length} endpoint.`)
  console.log(`OpenAPI: ${join(root, 'openapi.yaml')}`)
  console.log(`Mock data: ${join(root, 'mock-data.json')}`)
}

main()
