import SwaggerParser from '@apidevtools/swagger-parser'

const file = new URL('../openapi.json', import.meta.url).pathname
const normalized = process.platform === 'win32' ? file.replace(/^\/([A-Za-z]:)/, '$1') : file

try {
  const api = await SwaggerParser.validate(normalized)
  const pathCount = Object.keys(api.paths).length
  const operationCount = Object.values(api.paths).reduce(
    (total, item) =>
      total +
      Object.keys(item).filter((key) => key !== 'parameters').length,
    0,
  )
  console.log(`Validasi berhasil. ${pathCount} path, ${operationCount} operasi.`)
} catch (error) {
  console.error('Validasi gagal.')
  console.error(error.message)
  process.exit(1)
}
