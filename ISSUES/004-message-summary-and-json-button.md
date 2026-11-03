# Issue 004 — Balasan ringkasan dan tombol inline JSON

Status: Selesai

## Tujuan

Setelah pesan berhasil disimpan, bot membalas di chat dengan ringkasan informasi
pengirim dan isi pesan.

## Format balasan

```text
🧢 From <user_id>
  ├👤 @<username>
  └🙋🏽 <nama>

📄 Text
  └📏️ <jumlah> char

📮 Entity: <jumlah> buah
```

## Perubahan

- Menggunakan `api.sendMessage` dari SDK.
- Menampilkan ID dan nama pengirim; baris username hanya ditampilkan jika username tersedia.
- Menghitung karakter text atau caption.
- Menghitung jumlah entity Telegram.
- Menambahkan inline button `📄 json`.
- Button membuka URL item JSON yang baru dibuat di server data.

## File terkait

- `tgcloud/handlers/message.js`
