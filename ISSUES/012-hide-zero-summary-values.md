# Issue 012 — Menghilangkan nilai ringkasan yang nol

Status: Selesai

## Tujuan

Menghindari ringkasan kosong seperti:

```text
📄 Message
  └📏️ 0 char

📮 Entity: 0 buah
```

## Perubahan

- Baris jumlah karakter hanya ditampilkan jika nilainya lebih besar dari nol.
- Baris jumlah entity hanya ditampilkan jika nilainya lebih besar dari nol.
- Bagian `📄 Message` tidak ditampilkan jika tidak ada text/caption.
- Data JSON asli tetap dikirim lengkap ke API.

## File terkait

- `tgcloud/handlers/message.js`
