# Issue 002 — Credential `.env` untuk deployment Serverless

Status: Selesai

## Masalah

File `.env` lokal tidak tersedia di runtime Telegram Serverless. Karena itu,
handler tidak dapat membaca `process.env` setelah dideploy.

## Solusi

- Menambahkan script persiapan deployment yang membaca `BANGHASAN_AUTH_HEADER`
  dari `.env`.
- Script membuat `tgcloud/lib/config.js` secara lokal sebelum deployment.
- File konfigurasi hasil generate tidak dimasukkan ke Git.
- Menambahkan `.env` dan konfigurasi hasil generate ke `.gitignore`.

## Penggunaan

```bash
npm run prepare:serverless
npm run deploy
```

## File terkait

- `scripts/prepare-serverless.mjs`
- `tgcloud/lib/config.js`
- `.gitignore`
- `package.json`

Credential tidak ditulis ke dokumentasi atau output log.
