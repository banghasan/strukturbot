# Issue 009 — Format monospace untuk angka

Status: Selesai

## Tujuan

Semua nilai angka pada balasan ringkasan ditampilkan dengan format monospace
Telegram menggunakan HTML `<code>...</code>`.

## Contoh

```text
🧢 From 213567634
  ├👤 @hasanudinhs
  └🙋🏽 bangHasan

📄 Text
  └📏️ 212 char

📮 Entity: 0 buah
```

Pada Telegram, angka `213567634`, `212`, dan `0` tampil sebagai monospace.

## Perubahan

- ID pengirim menggunakan `<code>`.
- Jumlah karakter menggunakan `<code>`.
- Jumlah entity menggunakan `<code>`.
- ID custom emoji dan ID `Forward Origin` tetap menggunakan `<code>`.

## File terkait

- `tgcloud/handlers/message.js`
