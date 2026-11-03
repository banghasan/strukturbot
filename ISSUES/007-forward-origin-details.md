# Issue 007 — Detail asal pesan forward

Status: Selesai

## Tujuan

Jika message merupakan hasil forward dan memiliki `forward_origin`, tampilkan
identitas pengirim asli serta waktu asli pesan tersebut.

## Format tambahan

```text
💬 Forward Origin
  ├🗝 id: 123456789
  ├💁🏼 Nama Pengirim
  ├👤 @username
  └⏱️ 2026-11-03 12:54:12 WIB
```

## Perubahan

- Mendukung origin dari user, chat, channel, dan hidden user.
- Mengambil ID dari pengirim atau chat asal.
- Mengambil nama lengkap dan username jika tersedia.
- Menghilangkan baris username jika username tidak tersedia.
- Mengubah `forward_origin.date` dari Unix timestamp ke waktu WIB.
- Menampilkan ID dengan format monospace Telegram.
- Blok hanya ditambahkan jika `forward_origin` tersedia.

## File terkait

- `tgcloud/handlers/message.js`

## Verifikasi

Syntax handler sudah diperiksa dengan `node --check`.
