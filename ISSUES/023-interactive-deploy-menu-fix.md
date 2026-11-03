# Issue 023 — Memperbaiki menu interaktif deploy

Status: Selesai

## Masalah

Menjalankan `./deploy.sh` tanpa argumen menampilkan usage, bukan menu pilihan
target. Prompt juga sempat tertangkap oleh command substitution.

## Perubahan

- `./deploy.sh` sekarang menampilkan pilihan Development/Production.
- `./deploy.sh --help`, `./deploy.sh -h`, dan `./deploy.sh help` menampilkan
  usage.
- Pilihan `q` membatalkan deployment dengan bersih.
- Prompt interaktif dikirim ke terminal dan tidak tertelan oleh command
  substitution.

## Verifikasi

```bash
./deploy.sh
./deploy.sh help
```

Syntax Bash sudah diperiksa dengan `bash -n deploy.sh`.
