# Issue 014 — Satu report dengan button JSON

Status: Selesai

## Masalah

Saat bot ditambahkan ke grup, Telegram dapat mengirim update ke dua handler:
`my_chat_member` dan `message` melalui service message `new_chat_members`. Hal
ini membuat bot mengirim report lalu mengirim ringkasan kedua.

## Perubahan

- `message.js` mengabaikan service message yang berisi bot pada
  `new_chat_members`.
- `my_chat_member.js` menyimpan update masuk ke JSON API.
- Report pertama mendapat inline button `📄 json` dengan `pretty=true`.
- Bot tetap menunggu report pertama berhasil dikirim sebelum `leaveChat`.

## File terkait

- `tgcloud/handlers/message.js`
- `tgcloud/handlers/my_chat_member.js`
