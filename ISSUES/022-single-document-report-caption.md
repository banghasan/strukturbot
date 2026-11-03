# Issue 022 — Report dan JSON dalam satu message

Status: Selesai

## Tujuan

Menyederhanakan report saat bot masuk grup atau channel menjadi satu message
Telegram yang berisi file JSON dan report sebagai caption.

## Perubahan

- Mengirim hanya satu `sendDocument`.
- Memakai `telegram-chat-report.txt` sebagai file JSON pretty.
- Memindahkan report teks ke caption dokumen.
- Tidak lagi mengirim report sebagai message terpisah.
- Jika pengiriman dokumen gagal, error dicatat dan bot tetap mencoba keluar.
- `leaveChat` selalu dicoba setelah request pengiriman selesai.

## Alur

```text
buat caption report + file JSON
          ↓
    sendDocument
          ↓
      leaveChat
```

## File terkait

- `tgcloud/handlers/my_chat_member.js`
- `README.md`
