import { writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  PageBreak,
  PageNumber,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx'
import { TOKENS } from './data.mjs'
import { publicEndpoints, publicTagDescriptions } from './endpoints-public.mjs'
import { touristEndpoints, touristTagDescriptions } from './endpoints-tourist.mjs'
import { partnerEndpoints, partnerTagDescriptions } from './endpoints-partner.mjs'
import { adminEndpoints, adminTagDescriptions } from './endpoints-admin.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outFile = join(root, 'Find-Holiday-API-Contract.docx')

const endpoints = [
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

const roleTokens = {
  tourist: TOKENS.tourist,
  partner: TOKENS.partner,
  admin: TOKENS.admin,
}

const totalErrors = endpoints.reduce((sum, item) => sum + (item.errors?.length ?? 0), 0)

const monthNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]
const today = new Date()
const dateText = `${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`

const INK = '17303A'
const BRAND = '0B3F3B'
const ACCENT = '0F6B5F'
const MUTED = '5A6B72'
const CODE_FILL = 'F4F7F8'
const LINE = 'D7E0E4'
const HEAD_FILL = '0B3F3B'

const clean = (value) =>
  String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')

const pretty = (value) => clean(JSON.stringify(value, null, 2))

const errorEnvelope = (error, index = 0) => ({
  error: {
    code: error.code,
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
  },
  request_id: `req_demo_${String(index + 1).padStart(4, '0')}`,
})

const roleText = (roles) => roles.map((role) => roleLabels[role] ?? role).join(', ')

const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 2, color: LINE },
  bottom: { style: BorderStyle.SINGLE, size: 2, color: LINE },
  left: { style: BorderStyle.SINGLE, size: 2, color: LINE },
  right: { style: BorderStyle.SINGLE, size: 2, color: LINE },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: LINE },
  insideVertical: { style: BorderStyle.SINGLE, size: 2, color: LINE },
}

const body = (text, options = {}) => {
  const { size = 20, bold, italics, color = INK, font } = options
  return new Paragraph({
    spacing: { before: 60, after: 60, line: 276 },
    children: [
      new TextRun({ text: clean(text), size, bold, italics, color, font }),
    ],
  })
}

const label = (text) =>
  new Paragraph({
    spacing: { before: 160, after: 60 },
    keepNext: true,
    children: [new TextRun({ text, bold: true, size: 19, color: ACCENT })],
  })

const bullet = (text) =>
  new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 20, after: 20, line: 276 },
    children: [new TextRun({ text: clean(text), size: 20, color: INK })],
  })

const codeBlock = (text) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: CODE_FILL },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: clean(text)
              .split('\n')
              .map(
                (line) =>
                  new Paragraph({
                    spacing: { before: 0, after: 0, line: 240 },
                    children: [
                      new TextRun({
                        text: line.length ? line : ' ',
                        font: 'Consolas',
                        size: 15,
                        color: '1F3A42',
                      }),
                    ],
                  }),
              ),
          }),
        ],
      }),
    ],
  })

const cell = (children, options = {}) =>
  new TableCell({
    shading: options.fill
      ? { type: ShadingType.CLEAR, fill: options.fill }
      : undefined,
    width: options.width ? { size: options.width, type: WidthType.PERCENTAGE } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children,
  })

const headerCell = (text, width) =>
  cell(
    [
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text, bold: true, size: 17, color: 'FFFFFF' }),
        ],
      }),
    ],
    { fill: HEAD_FILL, width },
  )

const simpleCell = (text, width, options = {}) =>
  cell(
    [
      new Paragraph({
        spacing: { before: 20, after: 20, line: 240 },
        children: [
          new TextRun({
            text: clean(text),
            size: options.size ?? 17,
            bold: options.bold,
            font: options.mono ? 'Consolas' : undefined,
            color: options.color ?? INK,
          }),
        ],
      }),
    ],
    { width, fill: options.fill },
  )

const dataTable = (headers, widths, rows) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: headers.map((text, index) => headerCell(text, widths[index])),
      }),
      ...rows.map(
        (values) =>
          new TableRow({
            cantSplit: true,
            children: values.map((value, index) =>
              simpleCell(value.text ?? value, widths[index], value),
            ),
          }),
      ),
    ],
  })

const metaTable = (entries) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: entries.map(
      ([name, value]) =>
        new TableRow({
          cantSplit: true,
          children: [
            simpleCell(name, 24, { bold: true, fill: 'F1F5F6' }),
            simpleCell(value, 76),
          ],
        }),
    ),
  })

const parameterTable = (parameters) => {
  const rows = parameters.map((parameter) => {
    const schema = parameter.schema ?? {}
    const type = schema.enum
      ? `${schema.type ?? 'string'} (${schema.enum.join(', ')})`
      : schema.format
        ? `${schema.type ?? 'string'} ${schema.format}`
        : (schema.type ?? 'string')

    const example =
      parameter.example !== undefined
        ? JSON.stringify(parameter.example)
        : schema.default !== undefined
          ? String(schema.default)
          : schema.enum
            ? schema.enum[0]
            : '-'

    return [
      parameter.name,
      parameter.in,
      parameter.required ? 'Wajib' : 'Opsional',
      type,
      example,
      parameter.description ?? '',
    ]
  })

  return dataTable(
    ['Nama', 'Lokasi', 'Wajib', 'Tipe', 'Contoh', 'Keterangan'],
    [14, 8, 8, 14, 26, 30],
    rows,
  )
}

const resolvePath = (operation) => {
  const examples = new Map(
    (operation.parameters ?? [])
      .filter((parameter) => parameter.in === 'path')
      .map((parameter) => [parameter.name, parameter.example]),
  )

  return operation.path.replace(/\{([^}]+)\}/g, (match, name) => {
    const value = examples.get(name)
    return value === undefined || value === '' ? match : String(value)
  })
}

const queryString = (operation) => {
  const parts = (operation.parameters ?? [])
    .filter((parameter) => parameter.in === 'query')
    .map((parameter) => {
      const value =
        parameter.example !== undefined
          ? parameter.example
          : parameter.schema?.default !== undefined
            ? parameter.schema.default
            : undefined
      if (value === undefined) return null
      return `${parameter.name}=${encodeURIComponent(value)}`
    })
    .filter(Boolean)

  return parts.length ? `?${parts.join('&')}` : ''
}

const authLine = (operation) => {
  if (operation.public) return null
  const role = operation.roles.find((item) => item !== 'public')
  if (operation.roles.length === 1 && roleTokens[role]) {
    return `Authorization: Bearer ${roleTokens[role]}`
  }
  return 'Authorization: Bearer <token sesuai peran>'
}

const requestBlock = (operation) => {
  const lines = [`${operation.method.toUpperCase()} /api/v1${resolvePath(operation)}${queryString(operation)}`]

  const auth = authLine(operation)
  if (auth) lines.push(auth)
  lines.push('Accept: application/json')

  if (operation.body) {
    lines.push('Content-Type: application/json')
    lines.push('')
    lines.push(pretty(operation.body.example))
  }

  return lines.join('\n')
}

const endpointBlock = (operation, index) => {
  const children = [
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 320, after: 100 },
      keepNext: true,
      children: [
        new TextRun({
          text: `${operation.method.toUpperCase()} ${operation.path}`,
          bold: true,
          size: 23,
          color: BRAND,
        }),
      ],
    }),
    body(operation.description),
    metaTable([
      ['Peran', roleText(operation.roles)],
      ['Sukses', `${operation.success.status} ${operation.success.description}`],
      [
        'Kebutuhan',
        operation.kf?.length ? operation.kf.join(', ') : '-',
      ],
      ...(operation.proposed ? [['Status', 'Usulan perluasan, memerlukan penyesuaian skema basis data']] : []),
    ]),
    label('Pemanggilan'),
    codeBlock(requestBlock(operation)),
  ]

  if (operation.parameters?.length) {
    children.push(label('Parameter'), parameterTable(operation.parameters))
  }

  children.push(label(`Respons positif (${operation.success.status})`))

  if (operation.success.noContent) {
    children.push(body('Tidak ada isi respons. Server hanya mengembalikan kode 204.'))
  } else if (operation.successExamples?.length) {
    for (const example of operation.successExamples) {
      children.push(body(example.label, { bold: true, color: MUTED }))
      children.push(codeBlock(pretty(example.value)))
    }
  } else if (operation.success.contentType === 'text/event-stream') {
    children.push(
      body('Aliran Server-Sent Events. Contoh di bawah hanya memperlihatkan beberapa event.'),
    )
    children.push(codeBlock(operation.success.example))
  } else {
    children.push(codeBlock(pretty(operation.success.example)))
  }

  children.push(label('Kasus negatif'))

  if (!operation.errors?.length) {
    children.push(body('Tidak ada kasus negatif khusus untuk endpoint ini.'))
  } else {
    children.push(
      dataTable(
        ['Status', 'Kode', 'Pesan', 'Contoh isi respons'],
        [8, 18, 28, 46],
        operation.errors.map((error, errorIndex) => {
          const envelope = JSON.stringify(errorEnvelope(error, errorIndex))
          return [
            String(error.status),
            { text: error.code, mono: true, size: 15 },
            error.message,
            { text: envelope, mono: true, size: 14 },
          ]
        }),
      ),
    )
  }

  return children
}

const coverChildren = () => [
  new Paragraph({ spacing: { before: 1800, after: 0 }, children: [] }),
  new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: 'FIND HOLIDAY',
        bold: true,
        size: 30,
        color: ACCENT,
        characterSpacing: 60,
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 160 },
    children: [
      new TextRun({ text: 'Kontrak API', bold: true, size: 64, color: BRAND }),
    ],
  }),
  new Paragraph({
    spacing: { after: 360 },
    children: [
      new TextRun({
        text: 'Pemanggilan endpoint, respons positif, dan kasus negatif',
        size: 26,
        color: MUTED,
      }),
    ],
  }),
  metaTable([
    ['Versi kontrak', '1.0.0'],
    ['Format', 'OpenAPI 3.0.3'],
    ['Alamat dasar', 'https://<domain>/api/v1'],
    ['Jumlah endpoint', `${endpoints.length} pada ${tagOrder.length} kelompok`],
    ['Jumlah kasus negatif', `${totalErrors} contoh kesalahan`],
    ['Peran', 'Publik, Wisatawan, Mitra, Admin'],
    ['Autentikasi', 'Bearer token, pola Sanctum'],
    ['Tanggal', dateText],
  ]),
  new Paragraph({ spacing: { before: 320 }, children: [] }),
  body(
    'Dokumen ini dibuat otomatis dari sumber kontrak pada folder tools. Setiap endpoint memuat contoh pemanggilan, contoh respons positif, dan daftar kasus negatif beserta isi responsnya.',
    { color: MUTED, italics: true },
  ),
  new Paragraph({ children: [new PageBreak()] }),
]

const introChildren = () => [
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text: 'Cara memakai dokumen ini', bold: true, color: BRAND, size: 32 })],
  }),
  body(
    'Dokumen disusun per kelompok endpoint. Setiap endpoint memiliki empat bagian: keterangan singkat, contoh pemanggilan, respons positif, dan kasus negatif.',
  ),
  bullet('Pemanggilan memperlihatkan metode, alamat relatif terhadap /api/v1, header yang diperlukan, dan isi permintaan bila ada.'),
  bullet('Nilai pada {kurung kurawal} adalah parameter path. Contoh nilai sudah diisikan agar mudah dibaca.'),
  bullet('Respons positif memakai kode 2xx dan amplop data. Endpoint tanpa isi ditandai 204.'),
  bullet('Kasus negatif memuat kode status, kode kesalahan, pesan, dan contoh isi respons lengkap.'),
  bullet('Token pada contoh adalah token simulasi. Jangan dipakai pada lingkungan nyata.'),
  label('Ketentuan umum'),
  body('Alamat dasar: https://<domain>/api/v1'),
  body('Header autentikasi: Authorization: Bearer <token>'),
  body('Format isi: application/json dengan pengodean UTF-8.'),
  label('Token contoh per peran'),
  dataTable(
    ['Peran', 'Nilai header'],
    [24, 76],
    [
      ['Wisatawan', { text: `Authorization: Bearer ${TOKENS.tourist}`, mono: true, size: 15 }],
      ['Mitra', { text: `Authorization: Bearer ${TOKENS.partner}`, mono: true, size: 15 }],
      ['Admin', { text: `Authorization: Bearer ${TOKENS.admin}`, mono: true, size: 15 }],
    ],
  ),
  label('Amplop respons positif'),
  codeBlock(
    pretty({
      data: {
        user_id: '8c1a6f2e-5b7d-4a91-9f03-1a2b3c4d5e01',
        nama: 'Alfian Hanif',
        email: 'alfian.hanif@example.com',
        role: 'tourist',
      },
      message: 'Profil berhasil diambil.',
    }),
  ),
  label('Amplop respons kesalahan'),
  codeBlock(
    pretty({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Data yang dikirim belum lengkap atau formatnya belum benar.',
        details: [{ field: 'email', message: 'Format email belum benar.' }],
      },
      request_id: 'req_demo_0001',
    }),
  ),
  label('Kode status yang dipakai'),
  dataTable(
    ['Status', 'Arti'],
    [12, 88],
    [
      ['200', 'Berhasil dan mengembalikan data'],
      ['201', 'Data berhasil dibuat'],
      ['204', 'Berhasil tanpa isi respons'],
      ['400', 'Parameter permintaan tidak dapat diproses'],
      ['401', 'Token tidak ada, tidak valid, atau sudah dicabut'],
      ['403', 'Peran tidak sesuai atau data bukan milik pengguna'],
      ['404', 'Data tidak ditemukan'],
      ['409', 'Konflik dengan data yang sudah ada'],
      ['422', 'Validasi isi permintaan gagal'],
      ['429', 'Batas permintaan terlampaui'],
      ['500', 'Kesalahan pada server'],
      ['503', 'Layanan pihak ketiga tidak tersedia'],
    ],
  ),
]

const groupIndexChildren = () => {
  const rows = tagOrder.map((tag) => {
    const items = endpoints.filter((item) => item.tag === tag)
    const roles = [...new Set(items.flatMap((item) => item.roles))].map(
      (role) => roleLabels[role] ?? role,
    )
    return [tag, String(items.length), roles.join(', ')]
  })

  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      children: [new TextRun({ text: 'Daftar kelompok endpoint', bold: true, color: BRAND, size: 32 })],
    }),
    body(
      'Tabel berikut memperlihatkan sebaran endpoint pada setiap kelompok. Daftar rinci per kelompok ada pada awal bab masing-masing.',
    ),
    dataTable(['Kelompok', 'Jumlah', 'Peran'], [50, 12, 38], rows),
  ]
}

const groupChildren = (tag) => {
  const items = endpoints.filter((item) => item.tag === tag)
  const children = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      children: [new TextRun({ text: tag, bold: true, color: BRAND, size: 32 })],
    }),
    body(tagDescriptions.get(tag) ?? ''),
    body(`Jumlah endpoint pada kelompok ini: ${items.length}.`, { color: MUTED }),
    dataTable(
      ['No', 'Metode', 'Path', 'Peran', 'Sukses', 'Negatif'],
      [6, 12, 42, 22, 9, 9],
      items.map((item, index) => [
        String(index + 1),
        item.method.toUpperCase(),
        { text: item.path, mono: true, size: 15 },
        roleText(item.roles),
        String(item.success.status),
        String(item.errors?.length ?? 0),
      ]),
    ),
  ]

  for (const [index, item] of items.entries()) {
    children.push(...endpointBlock(item, index))
  }

  return children
}

const document = new Document({
  creator: 'Tim Find Holiday',
  title: 'Find Holiday API Contract',
  description: 'Pemanggilan endpoint, respons positif, dan kasus negatif',
  styles: {
    default: {
      document: {
        run: { font: 'Segoe UI', size: 20, color: INK },
        paragraph: { spacing: { line: 276 } },
      },
    },
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { font: 'Segoe UI', size: 32, bold: true, color: BRAND },
        paragraph: { spacing: { before: 0, after: 200 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { font: 'Segoe UI', size: 26, bold: true, color: BRAND },
        paragraph: { spacing: { before: 320, after: 140 }, outlineLevel: 1 },
      },
      {
        id: 'Heading3',
        name: 'Heading 3',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { font: 'Segoe UI', size: 23, bold: true, color: ACCENT },
        paragraph: { spacing: { before: 320, after: 100 }, outlineLevel: 2 },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE } },
              children: [
                new TextRun({
                  text: 'Find Holiday API  |  Kontrak dan Contoh Respons',
                  size: 15,
                  color: MUTED,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Halaman ', size: 15, color: MUTED }),
                new TextRun({ children: [PageNumber.CURRENT], size: 15, color: MUTED }),
                new TextRun({ text: ' dari ', size: 15, color: MUTED }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 15, color: MUTED }),
              ],
            }),
          ],
        }),
      },
      children: [
        ...coverChildren(),
        ...introChildren(),
        ...groupIndexChildren(),
        ...tagOrder.flatMap((tag) => groupChildren(tag)),
      ],
    },
  ],
})

const buffer = await Packer.toBuffer(document)
writeFileSync(outFile, buffer)

const size = (buffer.length / (1024 * 1024)).toFixed(2)
console.log(`Dokumen Word dibuat: ${outFile}`)
console.log(`Ukuran: ${size} MB`)
console.log(`Endpoint: ${endpoints.length}, kasus negatif: ${totalErrors}`)
