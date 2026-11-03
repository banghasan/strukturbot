# Issue 003 — Menggunakan CLI Telegram Serverless yang benar

Status: Selesai

## Masalah

Perintah `npx tgcloud login` mengambil package npm `tgcloud` yang berbeda,
bukan CLI resmi Telegram Serverless. Akibatnya muncul error:

```text
error: unknown command 'login'
```

## Perubahan

- Menambahkan package resmi `@tgcloud/cli` sebagai dev dependency.
- Menggunakan versi CLI `0.2.0`.
- Memastikan `npx tgcloud` menggunakan binary lokal dari dependency project.

## Penggunaan

```bash
npm install
npx tgcloud --version
npx tgcloud login
```

## File terkait

- `package.json`
- `package-lock.json`
- `README.md`
