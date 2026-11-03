# Issue 020 — Deployment interaktif dev/production

Status: Selesai

## Tujuan

Memungkinkan satu source code dideploy ke dua bot Telegram Serverless tanpa
mencampur state atau credential CLI.

## Struktur state

```text
.tgcloud-dev/    # state bot development
.tgcloud-pro/    # state bot production
.tgcloud         # symlink ke state aktif
.env             # sementara digunakan bersama
```

## Rancangan `deploy.sh`

Perintah utama:

```bash
./deploy.sh
```

Script menyediakan pilihan `dev`, `pro`, atau batal. Setelah target dipilih,
script harus:

1. Memvalidasi target.
2. Mengubah symlink `.tgcloud` ke state target.
3. Menampilkan banner target aktif.
4. Meminta konfirmasi ekstra untuk production.
5. Memeriksa credential target.
6. Menawarkan `npx tgcloud login` jika credential belum ada.
7. Berhenti jika login gagal atau dibatalkan.
8. Menjalankan persiapan konfigurasi dan deployment.
9. Menjalankan `npx tgcloud webhook sync` setelah push berhasil.
10. Menjalankan `npx tgcloud migrate --dry-run` setelah deployment.
11. Jika ada perubahan schema, menampilkan detail dan meminta konfirmasi
    sebelum migration sebenarnya dijalankan.
12. Menampilkan target pada output awal dan hasil akhir.

## Keputusan yang sudah ditetapkan

- Development dan production memakai source code yang sama.
- State CLI dipisahkan lewat `.tgcloud-dev` dan `.tgcloud-pro`.
- `.tgcloud` menjadi symlink ke target aktif.
- `.env` masih digunakan bersama.
- Login ditawarkan otomatis jika credential target belum tersedia.
- Production memerlukan konfirmasi tambahan.
- Deployment dibatalkan jika login gagal.
- `webhook sync` dijalankan otomatis setelah push berhasil.
- `webhook sync` tidak menggunakan `--drop-pending`.
- Migration tidak langsung dijalankan tanpa konfirmasi.
- `migrate --dry-run` dijalankan untuk memeriksa perubahan schema.
- Konfirmasi production wajib menggunakan kata `PRODUCTION`.

## Keputusan yang masih perlu ditegaskan

- Belum ada keputusan tambahan untuk implementasi dasar.
- Jika nanti credential API dev dan production berbeda, perlu memutuskan apakah
  `.env` dipisah menjadi `.env-dev` dan `.env-pro`.

## Status implementasi

Implementasi tersedia di `deploy.sh`. State `.tgcloud` yang sebelumnya aktif
telah dipindahkan menjadi `.tgcloud-dev`.
