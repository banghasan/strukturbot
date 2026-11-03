# Perilaku bot

## Private message

Setiap pesan diteruskan sebagai JSON ke:

```text
POST https://data.banghasan.com/json
```

Bot membalas dengan ringkasan pengirim, text/caption, entity, dan metadata media
yang tersedia. Informasi media tetap ditampilkan walaupun pesan memiliki
caption atau `forward_origin`.

Jika username tidak tersedia, baris username dihilangkan sepenuhnya.

## Bahasa

Prioritas bahasa respons:

1. Preferensi manual melalui `/lang id` atau `/lang en`.
2. `from.language_code` Telegram.
3. Bahasa Indonesia sebagai default.

## Pemilihan media

Jika Telegram mengirim beberapa variant dalam array, bot memilih variant
terbesar. Prioritasnya adalah `file_size`, kemudian `width × height` jika ukuran
file tidak tersedia.

## Grup dan channel

Saat bot ditambahkan ke group, supergroup, atau channel, bot mengirim satu
message berupa `telegram-chat-report.txt`. Report ditampilkan sebagai caption,
sedangkan file berisi update Telegram dalam JSON pretty.

Bot selalu mencoba `leaveChat` setelah request pengiriman selesai, baik berhasil
maupun gagal. Jika upload file gagal, bot menggunakan report teks sebagai
fallback.
