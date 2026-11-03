# Konfigurasi

## Environment

Buat `.env` berdasarkan [`.env.example`](../.env.example):

```env
BANGHASAN_AUTH_HEADER=your-auth-header
```

`.env` hanya digunakan secara lokal dan sudah masuk `.gitignore`.

`TELEGRAM_BOT_TOKEN` tidak diperlukan. Telegram Serverless menghubungkan bot
melalui CLI Access Token yang dikelola oleh `tgcloud login`.

## Credential Telegram Serverless

Credential dan state CLI dipisahkan berdasarkan target:

```text
.tgcloud-dev/
.tgcloud-pro/
.tgcloud -> target aktif
```

Login dilakukan setelah target dipilih melalui `deploy.sh`. Credential tidak
boleh dipindahkan antar-target.

## Generated configuration

Sebelum deployment, `scripts/prepare-serverless.mjs` membuat
`tgcloud/lib/config.js` dari `.env`. File ini dibutuhkan oleh runtime dan ikut
dikirim ke Telegram Serverless, tetapi sudah masuk `.gitignore` dan tidak boleh
di-commit.

Jika credential API pernah terekspos, segera ganti credential di server data dan
perbarui `.env` lokal.
