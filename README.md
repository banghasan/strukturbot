# Telegram Serverless Bot

Bot Telegram serverless yang meneruskan pesan ke JSON API dan menampilkan
ringkasan informatif kepada pengguna.

## Fitur utama

- Meneruskan setiap pesan ke `https://data.banghasan.com/json`.
- Menampilkan metadata text, media, entity, dan pesan forward.
- Mendukung Bahasa Indonesia dan English.
- Mengirim report grup/channel sebagai file JSON Telegram.
- Mendukung deployment terpisah untuk bot development dan production.

Endpoint JSON yang digunakan berasal dari project
[banghasan/json-crud-server](https://github.com/banghasan/json-crud-server).

## Quick start

```bash
npm install
./deploy.sh
```

Gunakan [`.env.example`](.env.example) sebagai template credential lokal.

## Dokumentasi

- [Deployment](docs/deployment.md) — target dev/production, migration, webhook,
  dan `deploy.sh`.
- [Perilaku bot](docs/bot-behavior.md) — private message serta grup/channel.
- [Konfigurasi](docs/configuration.md) — credential, environment, dan state.
- [Development](docs/development.md) — struktur project, pengujian, dan issue.

## Struktur utama

```text
tgcloud/
├── handlers/       # handler update Telegram
├── lib/            # module bersama
└── schema.js       # schema database Serverless
scripts/            # script persiapan deployment
deploy.sh           # deployment interaktif
ISSUES/             # catatan perubahan per issue
```

## Sumber layanan

Bot ini menggunakan Telegram Serverless dan JSON API dari project
[banghasan/json-crud-server](https://github.com/banghasan/json-crud-server).

## Dukungan

Untuk dukungan, diskusi, dan bantuan penggunaan, silakan bergabung ke grup
Telegram [@botindonesia](https://t.me/botindonesia).
