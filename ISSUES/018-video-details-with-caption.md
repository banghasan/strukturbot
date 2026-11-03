# Issue 018 — Detail video tetap tampil bersama caption

Status: Selesai

## Masalah

Message video yang memiliki caption sebelumnya hanya menampilkan bagian caption,
sementara detail video belum ditampilkan.

## Perubahan

- Menambahkan deteksi `message.video`.
- Menampilkan nama file, klasifikasi resolusi, MIME type, dimensi, durasi, dan
  ukuran video.
- Detail video tetap ditampilkan walaupun message memiliki caption,
  `forward_origin`, atau metadata lain.
- Format ukuran dan angka mengikuti aturan monospace yang sudah ditetapkan.

## File terkait

- `tgcloud/handlers/message.js`
- `README.md`
