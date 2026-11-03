# Issue 026 — Retry webhook sync saat terkena rate limit

Status: Selesai

## Masalah

Deployment berhasil, tetapi tahap `webhook sync` dapat gagal dengan:

```text
Too Many Requests: retry after 1
```

## Perubahan

- Menambahkan retry maksimal tiga kali pada `deploy.sh`.
- Memberi jeda dua detik antar percobaan.
- Push yang sudah berhasil tidak diulang sebagai bagian dari retry.
- Deployment tetap gagal jika webhook sync tidak berhasil setelah seluruh
  percobaan.

## Catatan

Error pada tahap ini tidak membatalkan push yang sudah berhasil. Jika webhook
sebenarnya sudah sinkron, perintah berikut dapat digunakan secara manual:

```bash
npx tgcloud webhook sync
```

## File terkait

- `deploy.sh`
