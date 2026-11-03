# Issue 017 — Detail video note dan rule media terbesar

Status: Selesai

## Format tambahan

```text
🎞 Video Note
  ├⏱️ 00:00:02 (2 detik)
  └⚖️ 188.36 KB (192,882 byte)
```

## Perubahan

- Mendeteksi `message.video_note`.
- Menampilkan durasi dalam format `HH:MM:SS` dan jumlah detik.
- Menampilkan ukuran KB dengan dua angka desimal dan ukuran byte.
- Jika media dikirim sebagai array beberapa variant, memilih variant terbesar.
- Prioritas ukuran variant: `file_size`, lalu `width × height` sebagai fallback.

## Aturan permanen media

Setiap handler media yang menerima array variant harus memilih data terbesar
dengan aturan yang sama. Jangan memilih item pertama hanya karena posisinya
berada di awal array.

## File terkait

- `tgcloud/handlers/message.js`
- `README.md`
