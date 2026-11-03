# Issue 015 — Detail dokumen

Status: Selesai

## Tujuan

Jika message berisi dokumen, tampilkan nama file, MIME type, ukuran KB, dan
ukuran byte.

## Format tambahan

```text
📦 Dokumen
  ├📎 amcha-7571091084-12-20261103-143206.txt
  ├🔖 text/plain
  └⚖️ 3.21 KB (3,286 byte)
```

Nilai angka ditampilkan dengan format monospace Telegram.

## File terkait

- `tgcloud/handlers/message.js`
