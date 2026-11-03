# Issue 011 — URL tombol JSON dengan format pretty

Status: Selesai

## Tujuan

Membuat JSON lebih mudah dibaca ketika user menekan tombol `📄 json`.

## Perubahan

- Menambahkan parameter `pretty=true` pada URL tombol JSON.
- Menangani URL yang sudah memiliki query string dengan memakai `&pretty=true`.
- Berlaku untuk URL dari response API maupun URL fallback yang dibentuk dari ID.
- Data yang disimpan ke API tidak berubah.

## Contoh

```text
https://data.banghasan.com/json/d3128365-e5f3-4327-ae15-cb66f1cc68c0?pretty=true
```

## File terkait

- `tgcloud/handlers/message.js`
