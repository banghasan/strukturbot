# Issue 029 — Flag untuk konfirmasi migration deploy

Status: Selesai

## Perubahan

`deploy.sh` sekarang mendukung pilihan migration melalui argument:

| Flag | Perilaku |
|---|---|
| `--yes`, `-y`, `/y` | Jalankan migration tanpa prompt |
| `--no`, `-n`, `/n` | Lewati migration tanpa prompt |
| tanpa flag | Tanyakan setelah `migrate --dry-run` |

## Contoh

```bash
./deploy.sh dev --yes
./deploy.sh dev --no
./deploy.sh pro -y
```

Flag migration tidak melewati konfirmasi production. Target production tetap
memerlukan input `PRODUCTION`.

`--yes` dan `--no` tidak boleh digunakan bersamaan; script akan berhenti
sebelum proses deployment dimulai.
