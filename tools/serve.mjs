import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const port = Number(process.env.PORT || 4173)
const host = process.env.HOST || '127.0.0.1'

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.yaml': 'application/yaml; charset=utf-8',
  '.yml': 'application/yaml; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.map': 'application/json; charset=utf-8',
}

const server = createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || host}`)
  let pathname
  try {
    pathname = decodeURIComponent(url.pathname)
  } catch {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Alamat tidak valid.')
    return
  }

  if (pathname === '/') pathname = '/index.html'
  const target = normalize(join(root, pathname))

  if (!target.startsWith(root + sep) && target !== root) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Akses ditolak.')
    return
  }

  const file = existsSync(target) && statSync(target).isDirectory()
    ? join(target, 'index.html')
    : target

  if (!existsSync(file)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Berkas tidak ditemukan.')
    return
  }

  response.writeHead(200, {
    'Content-Type': mime[extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  })
  createReadStream(file).pipe(response)
})

server.listen(port, host, () => {
  console.log(`Simulasi berjalan di http://${host}:${port}/`)
  console.log('Tekan Ctrl+C untuk menghentikan server.')
})
