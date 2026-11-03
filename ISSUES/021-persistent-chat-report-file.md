# Issue 021 — Report join sebagai file JSON Telegram

Status: Selesai

## Masalah

URL JSON dari `data.banghasan.com` memiliki retensi tujuh hari. Untuk report
saat bot masuk grup atau channel, data perlu tersedia di riwayat chat lebih
lama dan tidak bergantung pada layanan eksternal.

## Perubahan

- Menghapus inline button URL dari report `my_chat_member`.
- Mengirim report teks terlebih dahulu.
- Mengirim file `telegram-chat-report.txt` berisi update Telegram dalam JSON
  pretty dengan indentasi dua spasi.
- Memakai `InputFile` dari Telegram Serverless SDK.
- Bot hanya menjalankan `leaveChat` setelah report dan file berhasil terkirim.
- Jika pengiriman file gagal, bot tidak keluar dari chat.

## Catatan retensi

File berada langsung di riwayat Telegram, sehingga tidak terkena retensi tujuh
hari API data. Pesan tetap bergantung pada kebijakan Telegram, auto-delete,
dan kemungkinan penghapusan oleh admin.

## File terkait

- `tgcloud/handlers/my_chat_member.js`
