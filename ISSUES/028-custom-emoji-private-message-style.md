# Issue 028 — Custom emoji untuk ringkasan private message

Status: Selesai

## Perubahan

Ringkasan private message sekarang memakai custom emoji Telegram untuk bagian:

| Fallback | Custom emoji ID |
|---|---:|
| 👤 From | `5256143829672672750` |
| 👤 Username | `5346136537123801643` |
| 🙋🏽 Nama | `5336809689223021530` |
| 📄 Text/Caption | `5370604433233177619` |
| 📏️ Jumlah karakter | `5343545160015829015` |
| 💌 Entity | `5988014288499903889` |
| 📡 Custom emoji | `5321141214735508486` |
| 📦 Dokumen | `5854908544712707500` |
| ☁️ Nama file | `5915834902074364776` |
| ⏱️ Durasi | `5262540380301191210` |
| 📝 Ukuran file | `5877618313139327986` |
| 💬 Forward Origin | `5443038326535759644` |

Emoji media lain yang belum memiliki mapping tetap menggunakan emoji standar.

## File terkait

- `tgcloud/handlers/message.js`
