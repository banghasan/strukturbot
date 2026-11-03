# Deployment

Project menggunakan satu source code dengan dua state Telegram Serverless:

```text
.tgcloud-dev/    # state bot development
.tgcloud-pro/    # state bot production
.tgcloud         # symlink ke target aktif
```

## Deployment interaktif

```bash
./deploy.sh
```

Script memilih target, menampilkan target aktif, memeriksa credential,
menjalankan push, menyinkronkan webhook, lalu memeriksa migration. Production
memerlukan konfirmasi dengan mengetik `PRODUCTION`.

## Deployment langsung

```bash
./deploy.sh dev
./deploy.sh pro
./deploy.sh --help
```

## Migration

```bash
./deploy.sh dev --yes  # jalankan migration tanpa prompt
./deploy.sh dev --no   # lewati migration tanpa prompt
./deploy.sh dev        # tanyakan secara interaktif
```

Alias `-y`, `/y`, `-n`, dan `/n` juga tersedia. `--yes` tidak melewati
konfirmasi production.

Bot production memiliki database terpisah. Pada deployment production pertama,
migration biasanya diperlukan untuk membuat tabel `user_preferences`.

## Webhook

`webhook sync` dijalankan otomatis setelah push tanpa `--drop-pending`. Jika
Telegram mengembalikan rate limit, script mencoba ulang maksimal tiga kali.
