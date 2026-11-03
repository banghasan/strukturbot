# Telegram Serverless bot

Bot ini meneruskan setiap `message` Telegram sebagai JSON ke:

```text
POST https://data.banghasan.com/json
```

Endpoint `data.banghasan.com` yang digunakan project ini berasal dari project
[banghasan/json-crud-server](https://github.com/banghasan/json-crud-server).

Header `Authorization` diambil dari `BANGHASAN_AUTH_HEADER` pada `.env` saat proses persiapan deployment.

## Credential

Credential disimpan lokal di file `.env`. File ini sudah masuk `.gitignore`,
sehingga tidak ikut repository Git dan tidak dikirim langsung saat deployment.
Gunakan [.env.example](/home/DATA/Telegram/strukturbot/.env.example) sebagai
template, lalu salin menjadi `.env` dan isi credential asli.

Sebelum deploy, `scripts/prepare-serverless.mjs` membuat
`tgcloud/lib/config.js` dari nilai tersebut. Karena file generated itu berada
di dalam folder `tgcloud/`, file tersebut ikut di-upload ke Telegram Serverless
agar handler dapat melakukan request ke API data. File generated ini juga sudah
masuk `.gitignore` dan tidak boleh di-commit.

Jika credential pernah terekspos, segera ganti nilai `BANGHASAN_AUTH_HEADER`
di server data dan perbarui `.env` lokal.

CLI `@tgcloud/cli` sudah tercantum sebagai dependency project. Jika project baru saja diambil dari repository, jalankan `npm install` terlebih dahulu.

## Menjalankan

Aktifkan Serverless untuk bot melalui @BotFather, lalu hubungkan project dengan CLI access token:

```bash
npx tgcloud login
```

Siapkan konfigurasi dari `.env` dan deploy:

```bash
npm run deploy
```

Jika CLI melaporkan webhook belum sinkron setelah handler baru dideploy, jalankan:

```bash
npx tgcloud webhook sync
```

Setelah deployment pertama atau perubahan schema, jalankan migrasi database:

```bash
npx tgcloud migrate
```

Untuk menguji handler lokal:

```bash
npm run run:message -- '{ chat: { id: 1 }, message_id: 1, text: "uji" }'
```

Token bot Telegram tidak disimpan di `.env`; koneksi bot dikelola Telegram
Serverless melalui CLI Access Token yang tersimpan di state `.tgcloud-*`.

## Bahasa

Respons otomatis mengikuti `language_code` Telegram: `id` menggunakan Bahasa
Indonesia, sedangkan `en` menggunakan English. Jika tidak tersedia, default-nya
Bahasa Indonesia.

User dapat menyimpan pilihan manual:

```text
/lang id
/lang en
```

Setelah schema bahasa dideploy, jalankan migrasi satu kali:

```bash
npx tgcloud migrate
```

## Aturan format balasan

- Baris username (`├👤 @username`) hanya ditampilkan jika Telegram menyediakan username.
- Jika username tidak tersedia, baris tersebut dihilangkan sepenuhnya.
- Aturan ini berlaku untuk pengirim pesan dan `Forward Origin`.

## Aturan pemilihan data media

- Jika Telegram mengirim beberapa variant media dalam bentuk array, gunakan
  variant terbesar.
- Prioritas penentuan terbesar adalah `file_size`.
- Jika `file_size` tidak tersedia, gunakan luas resolusi (`width × height`).
- Aturan ini berlaku untuk foto dan variant media lain yang berbentuk array.

Informasi media tetap ditampilkan meskipun message juga memiliki caption,
forward origin, atau metadata lain.

## Report saat masuk grup atau channel

Saat bot ditambahkan ke grup, supergroup, atau channel, bot mengirim satu
message berupa `telegram-chat-report.txt`. Report ditampilkan sebagai caption,
sedangkan file berisi update Telegram dalam format JSON pretty. Report ini
tidak lagi memakai inline button ke `data.banghasan.com`, sehingga tidak
bergantung pada retensi API tujuh hari.

Setelah request pengiriman selesai—berhasil maupun gagal—bot tetap mencoba
keluar dari chat.

Jika pengiriman file gagal, bot menggunakan report teks sebagai fallback agar
informasi tetap dikirim seperti perilaku sebelumnya.

## Strategi deployment dev dan production

Project menggunakan satu source code dengan dua state Telegram Serverless:

```text
.tgcloud-dev/    # state bot development
.tgcloud-pro/    # state bot production
.tgcloud         # symlink ke target aktif
.env             # sementara digunakan bersama
```

Deployment akan dilakukan melalui script interaktif:

```bash
./deploy.sh
```

Script memilih target `dev` atau `pro`, mengganti symlink `.tgcloud`, dan
menampilkan target aktif sebelum proses dimulai. Production memerlukan
konfirmasi tambahan.

Target juga dapat diberikan langsung:

```bash
./deploy.sh dev
./deploy.sh pro
./deploy.sh dev --yes
./deploy.sh dev --no
```

Flag migration yang tersedia:

- `--yes`, `-y`, `/y`: jalankan migration tanpa prompt.
- `--no`, `-n`, `/n`: lewati migration tanpa prompt.
- Tanpa flag: tanyakan keputusan setelah `migrate --dry-run`.

Flag ini hanya mengatur migration. Konfirmasi production tetap wajib mengetik
`PRODUCTION`.

Jika credential target belum tersedia, script menawarkan `npx tgcloud login`.
Deployment hanya dilanjutkan setelah login berhasil. Credential setiap target
harus berasal dari bot masing-masing.

Rancangan alur deployment:

1. Pilih target `dev` atau `pro`.
2. Ganti symlink `.tgcloud` dan tampilkan target aktif.
3. Untuk production, wajib mengetik `PRODUCTION` sebagai konfirmasi.
4. Jika credential target belum ada, tawarkan `npx tgcloud login`.
5. Jalankan persiapan konfigurasi dan `tgcloud push`.
6. Jalankan `tgcloud webhook sync` otomatis tanpa `--drop-pending`.
7. Jalankan `tgcloud migrate --dry-run`.
8. Jika ada migration, tampilkan detail dan minta konfirmasi sebelum
   menjalankan migration sebenarnya.

Jika state target belum memiliki credential, script menawarkan login otomatis.
Production wajib dikonfirmasi dengan mengetik `PRODUCTION`.
