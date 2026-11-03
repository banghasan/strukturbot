# Issue 006 — Detail custom emoji tunggal

Status: Selesai

## Tujuan

Jika isi pesan hanya terdiri dari satu custom emoji Telegram, tampilkan teks
emoji dan ID custom emoji pada balasan bot.

## Format tambahan

```text
📡 Emoji Custom
  ├ text: 😍
  └ id: `6300844064069651734`
```

## Perubahan

- Mendeteksi entity Telegram bertipe `custom_emoji`.
- Memastikan entity tersebut mencakup seluruh isi text/caption.
- Mengambil ID dari field `custom_emoji_id`.
- Menampilkan blok detail hanya untuk satu custom emoji tanpa teks tambahan.
- Menampilkan `custom_emoji_id` dengan format monospace Telegram melalui tag
  HTML `<code>...</code>`.
- Message JSON asli yang dikirim ke API tetap tidak diubah.

## File terkait

- `tgcloud/handlers/message.js`

## Verifikasi

Syntax handler sudah diperiksa dengan `node --check`.
