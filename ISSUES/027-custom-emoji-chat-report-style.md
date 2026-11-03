# Issue 027 — Custom emoji untuk style report chat

Status: Selesai

## Perubahan

Caption report saat bot masuk grup atau channel sekarang memakai custom emoji
Telegram melalui format HTML `tg-emoji`.

| Fallback | Custom emoji ID |
|---|---:|
| 📑 | `5402372957701946187` |
| 🗝 | `5956267526630412170` |
| 👤 | `5249053508681883137` |
| 💬 | `5274102582585877844` |
| 👋 | `5247133031235329609` |
| 🤖 | `5854748376792305958` |
| 🏃🏼‍♂️ | `5368747224949857891` |

`⚜️` diganti menjadi `👤`, dan `🗃` diganti menjadi `💬`.

## File terkait

- `tgcloud/handlers/my_chat_member.js`
