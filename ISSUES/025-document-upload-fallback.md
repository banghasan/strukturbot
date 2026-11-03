# Issue 025 — Fallback report teks jika upload file gagal

Status: Selesai

## Masalah

Setelah report diubah menjadi satu `sendDocument`, kegagalan upload file dapat
membuat report tidak terlihat, walaupun sebelumnya `sendMessage` berhasil.

## Perubahan

- Tetap mencoba mengirim `telegram-chat-report.txt` dengan caption report.
- Jika upload file gagal, mengirim report teks melalui `sendMessage` sebagai
  fallback.
- Setelah percobaan utama dan fallback selesai, bot tetap mencoba `leaveChat`.
- Migration tidak terkait dengan jalur pengiriman ini.

## File terkait

- `tgcloud/handlers/my_chat_member.js`
- `README.md`
