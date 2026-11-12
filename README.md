# Find Holiday API Contract

Folder ini memuat kontrak OpenAPI dan simulasi Swagger untuk aplikasi Find Holiday. Seluruh halaman bersifat statis dan tidak memerlukan backend.

## Mulai cepat

```bash
cd api-contract
npm install
npm run serve
```

Buka `http://127.0.0.1:4173/`.

## Isi penting

| Berkas | Keterangan |
| --- | --- |
| `index.html` | Halaman simulasi Swagger |
| `openapi.yaml` | Kontrak OpenAPI 3.0.3 |
| `openapi.json` | Kontrak yang dipakai halaman Swagger |
| `mock.js` | Lapisan simulasi di browser |
| `mock-data.json` | Data jawaban simulasi |
| `docs/index.html` | Dokumentasi HTML |
| `Find-Holiday-API-Contract.docx` | Dokumen Word berisi seluruh pemanggilan endpoint dan contoh respons |
| `public/` | Salinan siap deploy yang dibuat oleh `npm run build` |
| `tools/` | Sumber kontrak dan skrip build |

## Perintah

| Perintah | Kegunaan |
| --- | --- |
| `npm run build` | Membuat ulang kontrak, data simulasi, aset, dokumentasi, dan folder `public` siap deploy |
| `npm run validate` | Memeriksa keabsahan kontrak |
| `npm run docx` | Membuat dokumen Word berisi pemanggilan dan contoh respons |
| `npm run serve` | Menjalankan server statis lokal |

## Dokumentasi

Dokumentasi lengkap tersedia pada `docs/index.html` dan berkas Markdown di dalam folder `docs`.

## Catatan

- Jangan mengubah berkas hasil build secara langsung. Ubah sumber pada `tools/` lalu jalankan `npm run build`.
- Simulasi tidak menyimpan perubahan dan tidak mengirim permintaan ke server.
- Token pada simulasi hanya contoh dan tidak boleh dipakai pada lingkungan nyata.
- `node_modules` tidak boleh masuk Git.

Kontrak ini disusun dari dokumen kebutuhan, dokumen DFD, rencana arsitektur, dan skema basis data pada repositori induk.
