# Development

## Struktur project

```text
tgcloud/
├── handlers/       # entry point update Telegram
├── lib/            # module bersama
└── schema.js       # schema database
scripts/
└── prepare-serverless.mjs
deploy.sh           # deployment interaktif
ISSUES/             # histori perubahan per issue
```

## Pengujian lokal

```bash
npm run prepare:serverless
npm run run:message -- '{ chat: { id: 1 }, message_id: 1, text: "uji" }'
```

Validasi syntax:

```bash
node --check tgcloud/handlers/message.js
node --check tgcloud/handlers/my_chat_member.js
bash -n deploy.sh
```

## Issue tracking

Setiap perubahan dicatat sebagai file terpisah di [ISSUES](../ISSUES/README.md)
agar alasan perubahan dan file terkait mudah ditelusuri.
