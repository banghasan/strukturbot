# Issue 010 — Detail foto terbesar

Status: Selesai

## Tujuan

Jika message berisi foto, tampilkan informasi ukuran file dan dimensi foto
terbesar yang dikirim Telegram.

## Format tambahan

```text
📸 Foto (terbesar)
  ├⚖️ 30.08 KB (30,799 byte)
  └📐 460 x 375 pixel
```

Angka pada Telegram ditampilkan dengan format monospace.

## Perubahan

- Mendeteksi array `message.photo`.
- Memilih foto dengan `file_size` terbesar; jika tidak tersedia, memakai luas
  dimensi sebagai pembanding.
- Menampilkan ukuran dalam KB dengan dua angka desimal.
- Menampilkan ukuran byte dengan pemisah ribuan koma.
- Menampilkan lebar dan tinggi dalam pixel.

## File terkait

- `tgcloud/handlers/message.js`
