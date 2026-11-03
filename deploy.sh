#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

usage() {
  cat <<'EOF'
Usage:
  ./deploy.sh          pilih target secara interaktif
  ./deploy.sh dev      deploy ke bot development
  ./deploy.sh pro      deploy ke bot production
EOF
}

sync_webhook() {
  local attempt

  for attempt in 1 2 3; do
    if npx tgcloud webhook sync; then
      return 0
    fi

    if [[ "$attempt" -lt 3 ]]; then
      printf '\nWebhook sync terkena rate limit atau gagal sementara. Mencoba lagi (%s/3)...\n' "$((attempt + 1))" >&2
      sleep 2
    fi
  done

  return 1
}

choose_target() {
  if [[ $# -gt 0 && -n "$1" ]]; then
    printf '%s' "$1"
    return
  fi

  printf '%s\n' 'Pilih target deployment:' >&2
  printf '%s\n' '  1) Development' >&2
  printf '%s\n' '  2) Production' >&2
  printf '%s' 'Pilihan [1-2/q]: ' >&2
  read -r choice

  case "$choice" in
    1|dev|DEV|development|DEVELOPMENT) printf '%s' 'dev' ;;
    2|pro|PRO|production|PRODUCTION) printf '%s' 'pro' ;;
    q|Q) printf '%s' '__cancel__' ;;
    *) printf '%s' '__invalid__' ;;
  esac
}

case "${1:-}" in
  --help|-h|help)
    usage
    exit 0
    ;;
  '')
    target="$(choose_target)"
    ;;
  *)
    target="$(choose_target "$1")"
    ;;
esac

case "$target" in
  dev) target_label='DEVELOPMENT'; state_dir='.tgcloud-dev' ;;
  pro) target_label='PRODUCTION'; state_dir='.tgcloud-pro' ;;
  *)
    if [[ "$target" == '__cancel__' ]]; then
      printf '%s\n' 'Deployment dibatalkan.'
      exit 0
    fi
    usage >&2
    exit 1
    ;;
esac

if [[ "$target" == 'pro' ]]; then
  printf '\nTarget PRODUCTION dipilih. Ketik PRODUCTION untuk melanjutkan: '
  read -r confirmation
  if [[ "$confirmation" != 'PRODUCTION' ]]; then
    printf '%s\n' 'Konfirmasi tidak sesuai. Deployment dibatalkan.' >&2
    exit 1
  fi
fi

if [[ ! -d "$state_dir" ]]; then
  mkdir -p "$state_dir"
fi

if [[ -e .tgcloud || -L .tgcloud ]]; then
  if [[ ! -L .tgcloud ]]; then
    printf '%s\n' 'ERROR: .tgcloud sudah ada tetapi bukan symlink. Tidak diubah.' >&2
    exit 1
  fi
  unlink .tgcloud
fi
ln -s "$state_dir" .tgcloud

printf '\n========================================\n'
printf ' Telegram Serverless Deployment\n'
printf ' Target: %s\n' "$target_label"
printf ' State : %s\n' "$state_dir"
printf '========================================\n\n'

if [[ ! -s "$state_dir/credentials" ]]; then
  printf '%s\n' "Credential $target_label belum ditemukan."
  printf '%s' 'Jalankan tgcloud login sekarang? [Y/n]: '
  read -r login_choice
  if [[ -z "$login_choice" || "$login_choice" =~ ^[Yy]$ ]]; then
    npx tgcloud login
  else
    printf '%s\n' 'Login dibatalkan. Deployment dihentikan.' >&2
    exit 1
  fi

  if [[ ! -s "$state_dir/credentials" ]]; then
    printf '%s\n' 'Credential belum tersedia setelah login. Deployment dihentikan.' >&2
    exit 1
  fi
fi

printf '\n[%s] Menyiapkan konfigurasi...\n' "$target_label"
npm run prepare:serverless
printf '\n[%s] Memeriksa perubahan...\n' "$target_label"
npx tgcloud status
printf '\n[%s] Menjalankan push...\n' "$target_label"
npx tgcloud push
printf '\n[%s] Sinkronisasi webhook...\n' "$target_label"
sync_webhook
printf '\n[%s] Memeriksa migration...\n' "$target_label"
npx tgcloud migrate --dry-run

printf '\nJalankan migration sekarang? [y/N]: '
read -r migrate_choice
if [[ "$migrate_choice" =~ ^[Yy]$ ]]; then
  npx tgcloud migrate
else
  printf '%s\n' 'Migration dilewati.'
fi

printf '\n========================================\n'
printf ' Deployment selesai\n'
printf ' Target: %s\n' "$target_label"
printf ' State : %s\n' "$state_dir"
printf '========================================\n'
