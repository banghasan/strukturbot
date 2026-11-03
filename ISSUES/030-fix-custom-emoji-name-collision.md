# Issue 030 — Memperbaiki collision nama custom emoji

Status: Selesai

## Masalah

Helper `customEmoji()` untuk merender HTML `tg-emoji` memiliki nama yang sama
dengan variabel hasil deteksi custom emoji pesan. Variabel lokal menimpa helper,
sehingga handler message gagal saat memanggilnya sebagai function.

## Perubahan

- Mengganti nama variabel hasil deteksi menjadi `singleCustomEmoji`.
- Mempertahankan helper `customEmoji()` sebagai function renderer.
- Memastikan header dan detail custom emoji dapat dirender bersamaan.

## File terkait

- `tgcloud/handlers/message.js`
