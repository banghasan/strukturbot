# Issue 024 — Selalu keluar setelah percobaan report

Status: Selesai

## Masalah

Jika terjadi exception saat menyiapkan bahasa, JSON, atau file sebelum blok
`try/finally`, proses bisa berhenti sebelum `leaveChat` dijalankan.

## Perubahan

- Memindahkan seluruh proses pembuatan report dan file ke dalam `try`.
- `leaveChat` sekarang berada pada `finally` yang mencakup seluruh proses.
- Kegagalan pengiriman report tidak menghentikan percobaan keluar.
- Kegagalan `leaveChat` dicatat sebagai error tanpa membuat proses report
  berhenti lebih awal.
- Menambahkan log tahap mulai, pengiriman file, dan akhir flow untuk diagnosis.

## File terkait

- `tgcloud/handlers/my_chat_member.js`
