# Issue 013 — Report lalu otomatis keluar dari grup/channel

Status: Selesai

## Tujuan

Ketika bot ditambahkan ke grup, supergroup, atau channel, bot mengirim report
singkat lalu keluar otomatis.

## Format pesan

```text
📑 Report
  ├🗝 id: 123456789
  ├⚜️ Nama Grup
  └🗃 tipe: supergroup

🙏🏼 Permisi.. tetap tenang yak!
  ├ 🤖 Bot ini hanya memberikan informasi ID
  └ 🏃🏼‍♂️ dan akan pergi secara otomatis.
```

## Perubahan

- Menambahkan handler `handlers/my_chat_member.js`.
- Menangani `group`, `supergroup`, dan `channel`.
- Mengirim pesan report dengan ID dalam format monospace.
- Menunggu `sendMessage` selesai sebelum memanggil `leaveChat`.
- Jika pengiriman gagal, bot tidak melanjutkan proses keluar.
- Tidak bereaksi pada perubahan status bot yang bukan proses masuk pertama.

## File terkait

- `tgcloud/handlers/my_chat_member.js`
