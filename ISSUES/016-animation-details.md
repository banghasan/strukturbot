# Issue 016 — Detail animasi

Status: Selesai

## Tujuan

Jika message berisi animasi, tampilkan nama file, klasifikasi resolusi, MIME
type, dimensi, durasi, dan ukuran file.

## Format tambahan

```text
🧬 Animasi
  ├📎 giphy.mp4
  ├🗃 Resolusi Sangat Rendah (Sub-SD)
  ├🔖 video/mp4
  ├📐 480 x 354 pixel
  ├⏱️ 00:00:03 (3 detik)
  └⚖️ 354.6 KB (363,114 byte)
```

## Perubahan

- Mendeteksi `message.animation`.
- Mengklasifikasikan resolusi berdasarkan sisi terpanjang video.
- Memformat durasi ke `HH:MM:SS`.
- Menghitung ukuran KB dengan satu angka desimal.
- Menampilkan nilai angka dengan format monospace Telegram.

## File terkait

- `tgcloud/handlers/message.js`
