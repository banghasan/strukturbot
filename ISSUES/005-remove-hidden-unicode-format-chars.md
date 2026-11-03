# Issue 005 — Menghapus karakter Unicode tak terlihat

Status: Selesai

## Masalah

Nama pengirim dapat mengandung karakter format Unicode tak terlihat, seperti:

```text
U+200F RIGHT-TO-LEFT MARK
```

Akibatnya nama dapat terlihat seperti memiliki karakter asing sebelum teks,
contohnya `‏bangHasan`.

## Perubahan

- Menambahkan fungsi `cleanDisplayText`.
- Menghapus karakter Unicode kategori control dan format (`Cc` dan `Cf`).
- Membersihkan nama, username, title chat, text, dan caption sebelum ditampilkan.
- JSON asli yang diteruskan ke server data tetap tidak diubah.

## File terkait

- `tgcloud/handlers/message.js`

## Verifikasi

Karakter `U+200F` sudah diuji dan hasil tampilan menjadi `bangHasan`.
