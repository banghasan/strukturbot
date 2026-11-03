# Issue 019 — Respons bilingual berdasarkan bahasa user

Status: Selesai

## Aturan bahasa

Prioritas bahasa respons:

1. Pilihan manual yang disimpan melalui `/lang id` atau `/lang en`.
2. `from.language_code` dari Telegram (`id` menjadi Indonesia, `en` menjadi
   English).
3. Default Indonesia jika bahasa tidak tersedia atau belum didukung.

## Perubahan

- Menambahkan tabel `user_preferences` untuk menyimpan bahasa per `user_id`.
- Menambahkan module `lib/language.js` untuk deteksi, penyimpanan, dan
  terjemahan label.
- Menambahkan command `/lang id` dan `/lang en`.
- Menerjemahkan ringkasan text, caption, entity, media, resolusi, durasi, dan
  custom emoji.
- Bahasa manual mengalahkan `language_code` Telegram.

## Deployment database

Setelah deploy pertama dengan schema baru, jalankan:

```bash
npx tgcloud migrate
```

## File terkait

- `tgcloud/schema.js`
- `tgcloud/lib/language.js`
- `tgcloud/handlers/message.js`
