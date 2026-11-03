# Issue 001 — Forward Telegram messages to JSON API

Status: Selesai

## Tujuan

Setiap pesan yang diterima bot Telegram diteruskan sebagai JSON ke server:

```text
POST https://data.banghasan.com/json
```

## Perubahan

- Menambahkan handler `handlers/message.js`.
- Menggunakan `fetch` dari Telegram Serverless SDK.
- Mengirim object `message` Telegram secara utuh sebagai JSON.
- Menggunakan header `Authorization` untuk API tujuan.
- Error dari API tujuan dilempar agar kegagalan tidak dianggap sukses.

## File terkait

- `tgcloud/handlers/message.js`

## Verifikasi

Syntax handler sudah diperiksa dengan `node --check`.
