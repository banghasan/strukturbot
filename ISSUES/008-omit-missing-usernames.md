# Issue 008 — Menghilangkan baris username kosong

Status: Selesai

## Aturan

Baris username hanya ditampilkan jika object Telegram memiliki username yang
valid. Jika tidak ada username, seluruh baris `├👤 @username` dihilangkan.

Aturan ini berlaku konsisten untuk:

- pengirim pesan utama;
- pengirim asli pada `Forward Origin`.

## Perubahan

- Mengubah nilai username yang tidak tersedia menjadi `null`.
- Membuat baris username secara kondisional.
- Menambahkan aturan format ini ke `README.md` sebagai pedoman perubahan
  berikutnya.

## File terkait

- `tgcloud/handlers/message.js`
- `README.md`
