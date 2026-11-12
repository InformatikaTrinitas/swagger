import { cp, mkdir, rm } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDirs = [
  join(root, 'public'),
  resolve(root, '../find-holiday-vue/public/swagger'),
  resolve(root, '../find-holiday-vue/public/api-docs'),
]

const files = [
  'index.html',
  'styles.css',
  'mock.js',
  'mock-data.json',
  'openapi.json',
  'openapi.yaml',
]

for (const out of outDirs) {
  await rm(out, { recursive: true, force: true })
  await mkdir(out, { recursive: true })

  for (const file of files) {
    await cp(join(root, file), join(out, file))
  }

  await cp(join(root, 'assets'), join(out, 'assets'), { recursive: true })
  await cp(join(root, 'docs'), join(out, 'docs'), { recursive: true })

  console.log(`Folder siap deploy dibuat: ${out}`)
}
