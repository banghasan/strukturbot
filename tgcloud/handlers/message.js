import { api, fetch } from 'sdk';
import { BANGHASAN_AUTH_HEADER } from '../lib/config.js';
import { getUserLanguage, setUserLanguage, tr } from '../lib/language.js';

const DATA_API_URL = 'https://data.banghasan.com/json';

function cleanDisplayText(value) {
  if (typeof value !== 'string') return '';

  // Remove invisible Unicode control/format characters such as U+200F RLM,
  // while keeping normal non-Latin text and emoji intact.
  return value.replace(/[\p{Cc}\p{Cf}]/gu, '').trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function customEmoji(id, fallback) {
  return `<tg-emoji emoji-id="${id}">${fallback}</tg-emoji>`;
}

function withPrettyJson(url) {
  return `${url}${url.includes('?') ? '&' : '?'}pretty=true`;
}

function formatWibTime(unixTimestamp) {
  const timestamp = Number(unixTimestamp);
  if (!Number.isFinite(timestamp)) return '(waktu tidak diketahui)';

  const date = new Date((timestamp + 7 * 60 * 60) * 1000);
  const pad = (value) => String(value).padStart(2, '0');

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ` +
    `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} WIB`;
}

function getMessageText(message, lang) {
  if (typeof message.text === 'string') {
    return { label: tr(lang, 'text'), value: cleanDisplayText(message.text) };
  }

  if (typeof message.caption === 'string') {
    return { label: tr(lang, 'caption'), value: cleanDisplayText(message.caption) };
  }

  return { label: tr(lang, 'message'), value: '' };
}

function getSingleCustomEmoji(message) {
  const text = typeof message.text === 'string' ? message.text : message.caption;
  const entities = message.entities ?? message.caption_entities ?? [];

  if (typeof text !== 'string' || entities.length !== 1) return null;

  const [entity] = entities;
  if (
    entity.type !== 'custom_emoji' ||
    !entity.custom_emoji_id ||
    entity.offset !== 0 ||
    entity.length !== text.length
  ) {
    return null;
  }

  return {
    text: cleanDisplayText(text),
    id: entity.custom_emoji_id,
  };
}

function getLargestPhoto(message) {
  if (!Array.isArray(message.photo) || message.photo.length === 0) return null;

  return message.photo.reduce((largest, photo) => {
    const largestScore = largest.file_size ?? (largest.width ?? 0) * (largest.height ?? 0);
    const photoScore = photo.file_size ?? (photo.width ?? 0) * (photo.height ?? 0);
    return photoScore >= largestScore ? photo : largest;
  });
}

function formatPhotoDetails(message, lang) {
  const photo = getLargestPhoto(message);
  if (!photo) return null;

  const bytes = Number(photo.file_size);
  const size = Number.isFinite(bytes)
    ? `<code>${(bytes / 1024).toFixed(2)}</code> KB (<code>${bytes.toLocaleString('en-US')}</code> byte)`
    : '<code>-</code> KB (<code>-</code> byte)';

  return [
    `📸 ${tr(lang, 'photoLargest')}`,
    `  ├${customEmoji('5877618313139327986', '📝')} ${size}`,
    `  └📐 <code>${photo.width ?? '-'} x ${photo.height ?? '-'}</code> ${tr(lang, 'pixel')}`,
  ];
}

function formatDocumentDetails(message, lang) {
  const document = message.document;
  if (!document || typeof document !== 'object') return null;

  const bytes = Number(document.file_size);
  const size = Number.isFinite(bytes)
    ? `<code>${(bytes / 1024).toFixed(2)}</code> KB (<code>${bytes.toLocaleString('en-US')}</code> byte)`
    : '<code>-</code> KB (<code>-</code> byte)';

  return [
    `${customEmoji('5854908544712707500', '📦')} ${tr(lang, 'document')}`,
    `  ├${customEmoji('5915834902074364776', '☁️')} <code>${escapeHtml(document.file_name ?? '(tanpa nama file)')}</code>`,
    `  ├🔖 ${escapeHtml(document.mime_type ?? '(tipe tidak diketahui)')}`,
    `  └${customEmoji('5877618313139327986', '📝')} ${size}`,
  ];
}

function getResolutionLabel(width, height, lang) {
  const largestSide = Math.max(Number(width) || 0, Number(height) || 0);

  if (largestSide <= 480) return tr(lang, 'resolutionVeryLow');
  if (largestSide <= 720) return tr(lang, 'resolutionLow');
  if (largestSide <= 1280) return tr(lang, 'resolutionHigh');
  if (largestSide <= 1920) return tr(lang, 'resolutionFullHd');
  if (largestSide <= 2560) return tr(lang, 'resolution2k');
  if (largestSide <= 3840) return tr(lang, 'resolution4k');
  return tr(lang, 'resolution8k');
}

function formatDuration(secondsValue) {
  const seconds = Number(secondsValue);
  if (!Number.isFinite(seconds)) return { clock: '--:--:--', value: '-' };

  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainder = totalSeconds % 60;
  const pad = (value) => String(value).padStart(2, '0');

  return {
    clock: `${pad(hours)}:${pad(minutes)}:${pad(remainder)}`,
    value: totalSeconds,
  };
}

function formatAnimationDetails(message, lang) {
  const animation = message.animation;
  if (!animation || typeof animation !== 'object') return null;

  const bytes = Number(animation.file_size);
  const size = Number.isFinite(bytes)
    ? `<code>${(bytes / 1024).toFixed(1)}</code> KB (<code>${bytes.toLocaleString('en-US')}</code> byte)`
    : '<code>-</code> KB (<code>-</code> byte)';
  const duration = formatDuration(animation.duration);

  return [
    `🧬 ${tr(lang, 'animation')}`,
    `  ├${customEmoji('5915834902074364776', '☁️')} ${escapeHtml(animation.file_name ?? '(tanpa nama file)')}`,
    `  ├🗃 ${getResolutionLabel(animation.width, animation.height, lang)}`,
    `  ├🔖 ${escapeHtml(animation.mime_type ?? '(tipe tidak diketahui)')}`,
    `  ├📐 <code>${animation.width ?? '-'} x ${animation.height ?? '-'}</code> ${tr(lang, 'pixel')}`,
    `  ├${customEmoji('5262540380301191210', '⏱️')} <code>${duration.clock}</code> (<code>${duration.value}</code> ${tr(lang, 'seconds')})`,
    `  └${customEmoji('5877618313139327986', '📝')} ${size}`,
  ];
}

function formatVideoDetails(message, lang) {
  const video = message.video;
  if (!video || typeof video !== 'object') return null;

  const bytes = Number(video.file_size);
  const size = Number.isFinite(bytes)
    ? `<code>${(bytes / 1024).toFixed(2)}</code> KB (<code>${bytes.toLocaleString('en-US')}</code> byte)`
    : '<code>-</code> KB (<code>-</code> byte)';
  const duration = formatDuration(video.duration);

  return [
    `🎥 ${tr(lang, 'video')}`,
    `  ├${customEmoji('5915834902074364776', '☁️')} ${escapeHtml(video.file_name ?? '(tanpa nama file)')}`,
    `  ├🗃 ${getResolutionLabel(video.width, video.height, lang)}`,
    `  ├🔖 ${escapeHtml(video.mime_type ?? '(tipe tidak diketahui)')}`,
    `  ├📐 <code>${video.width ?? '-'} x ${video.height ?? '-'}</code> ${tr(lang, 'pixel')}`,
    `  ├${customEmoji('5262540380301191210', '⏱️')} <code>${duration.clock}</code> (<code>${duration.value}</code> ${tr(lang, 'seconds')})`,
    `  └${customEmoji('5877618313139327986', '📝')} ${size}`,
  ];
}

function formatVideoNoteDetails(message, lang) {
  const videoNote = message.video_note;
  if (!videoNote || typeof videoNote !== 'object') return null;

  const bytes = Number(videoNote.file_size);
  const size = Number.isFinite(bytes)
    ? `<code>${(bytes / 1024).toFixed(2)}</code> KB (<code>${bytes.toLocaleString('en-US')}</code> byte)`
    : '<code>-</code> KB (<code>-</code> byte)';
  const duration = formatDuration(videoNote.duration);

  return [
    `🎞 ${tr(lang, 'videoNote')}`,
    `  ├${customEmoji('5262540380301191210', '⏱️')} <code>${duration.clock}</code> (<code>${duration.value}</code> ${tr(lang, 'seconds')})`,
    `  └${customEmoji('5877618313139327986', '📝')} ${size}`,
  ];
}

function getForwardOrigin(message) {
  const origin = message.forward_origin;
  if (!origin || typeof origin !== 'object') return null;

  let sender = {};
  let hiddenName = '';

  if (origin.type === 'user') {
    sender = origin.sender_user ?? {};
  } else if (origin.type === 'chat') {
    sender = origin.sender_chat ?? {};
  } else if (origin.type === 'channel') {
    sender = origin.chat ?? {};
  } else if (origin.type === 'hidden_user') {
    hiddenName = cleanDisplayText(origin.sender_user_name);
  }

  const fullName =
    [sender.first_name, sender.last_name]
      .map(cleanDisplayText)
      .filter(Boolean)
      .join(' ') ||
    cleanDisplayText(sender.title) ||
    hiddenName ||
    '(nama tidak diketahui)';
  const usernameValue = cleanDisplayText(sender.username);

  return {
    id: sender.id ?? '(id tidak tersedia)',
    fullName,
    username: usernameValue ? `@${usernameValue}` : null,
    time: formatWibTime(origin.date),
  };
}

function formatSummary(message, lang) {
  const sender = message.from ?? message.sender_chat ?? {};
  const usernameValue = cleanDisplayText(sender.username);
  const username = usernameValue ? `@${usernameValue}` : null;
  const displayName =
    [sender.first_name, sender.last_name]
      .map(cleanDisplayText)
      .filter(Boolean)
      .join(' ') ||
    cleanDisplayText(sender.title) ||
    '(tanpa nama)';
  const content = getMessageText(message, lang);
  const entityCount = (message.entities ?? message.caption_entities ?? []).length;
  const characterCount = Array.from(content.value).length;
  const singleCustomEmoji = getSingleCustomEmoji(message);
  const photoDetails = formatPhotoDetails(message, lang);
  const documentDetails = formatDocumentDetails(message, lang);
  const animationDetails = formatAnimationDetails(message, lang);
  const videoDetails = formatVideoDetails(message, lang);
  const videoNoteDetails = formatVideoNoteDetails(message, lang);
  const forwardOrigin = getForwardOrigin(message);

  const lines = [
    `${customEmoji('5256143829672672750', '👤')} ${tr(lang, 'from')} ${sender.id != null ? `<code>${escapeHtml(sender.id)}</code>` : `(${tr(lang, 'unknown')})`}`,
    ...(username ? [`  ├${customEmoji('5346136537123801643', '👤')} ${escapeHtml(username)}`] : []),
    `  └${customEmoji('5336809689223021530', '🙋🏽')} ${escapeHtml(displayName)}`,
  ];

  if (characterCount > 0) {
    lines.push('', `${customEmoji('5370604433233177619', '📄')} ${content.label}`, `  └${customEmoji('5343545160015829015', '📏️')} <code>${characterCount}</code> ${tr(lang, 'char')}`);
  }

  if (entityCount > 0) {
    lines.push('', `${customEmoji('5988014288499903889', '💌')} ${tr(lang, 'entity')}: <code>${entityCount}</code>${tr(lang, 'entityUnit') ? ` ${tr(lang, 'entityUnit')}` : ''}`);
  }

  if (singleCustomEmoji) {
    lines.push(
      '',
      `${customEmoji('5321141214735508486', '📡')} ${tr(lang, 'customEmoji')}`,
      `  ├ ${tr(lang, 'textLabel')}: ${escapeHtml(singleCustomEmoji.text)}`,
      `  └ ${tr(lang, 'idLabel')}: <code>${escapeHtml(singleCustomEmoji.id)}</code>`,
    );
  }

  if (photoDetails) {
    lines.push('', ...photoDetails);
  }

  if (documentDetails) {
    lines.push('', ...documentDetails);
  }

  if (animationDetails) {
    lines.push('', ...animationDetails);
  }

  if (videoDetails) {
    lines.push('', ...videoDetails);
  }

  if (videoNoteDetails) {
    lines.push('', ...videoNoteDetails);
  }

  if (forwardOrigin) {
    lines.push('', `${customEmoji('5443038326535759644', '💬')} ${tr(lang, 'forwardOrigin')}`, `  ├${customEmoji('5956267526630412170', '🗝')} ${tr(lang, 'idLabel')}: <code>${escapeHtml(forwardOrigin.id)}</code>`);
    if (forwardOrigin.username) {
      lines.push(`  ├💁🏼 ${escapeHtml(forwardOrigin.fullName)}`, `  ├${customEmoji('5346136537123801643', '👤')} ${escapeHtml(forwardOrigin.username)}`);
    } else {
      lines.push(`  ├💁🏼 ${escapeHtml(forwardOrigin.fullName)}`);
    }
    lines.push(`  └${customEmoji('5262540380301191210', '⏱️')} ${escapeHtml(forwardOrigin.time)}`);
  }

  return lines.join('\n');
}

export default async function (message) {
  // The join service message is handled by my_chat_member.js. Do not send a
  // second summary when Telegram also delivers new_chat_members to message.
  if (Array.isArray(message.new_chat_members) && message.new_chat_members.some((member) => member.is_bot)) {
    return;
  }

  const user = message.from;
  const language = await getUserLanguage(user);
  const command = typeof message.text === 'string' && message.text.trim().match(/^\/lang(?:@\w+)?(?:\s+([a-z-]+))?$/i);

  if (command) {
    const requestedLanguage = command[1]?.toLowerCase();
    if (!requestedLanguage || !['id', 'en'].includes(requestedLanguage) || user?.id == null) {
      await api.sendMessage({ chat_id: message.chat.id, text: tr(language, 'invalidLanguage') });
      return;
    }

    await setUserLanguage(user.id, requestedLanguage);
    await api.sendMessage({
      chat_id: message.chat.id,
      text: tr(requestedLanguage, 'languageSaved'),
    });
    return;
  }

  if (!BANGHASAN_AUTH_HEADER) {
    throw new Error(
      'BANGHASAN_AUTH_HEADER belum tersedia. Jalankan npm run prepare:serverless sebelum deploy atau test.',
    );
  }

  const response = await fetch(DATA_API_URL, {
    method: 'POST',
    headers: {
      Authorization: BANGHASAN_AUTH_HEADER,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Gagal menyimpan message ke data.banghasan.com (${response.status}): ${details.slice(0, 500)}`,
    );
  }

  const saved = await response.json();
  const jsonUrl =
    typeof saved?.url === 'string'
      ? withPrettyJson(saved.url)
      : saved?.id
        ? withPrettyJson(`${DATA_API_URL}/${encodeURIComponent(saved.id)}`)
        : null;

  await api.sendMessage({
    chat_id: message.chat.id,
    text: formatSummary(message, language),
    parse_mode: 'HTML',
    ...(jsonUrl
      ? {
          reply_markup: {
            inline_keyboard: [[{ text: '📄 json', url: jsonUrl }]],
          },
        }
      : {}),
  });

  console.log('Telegram message forwarded', {
    chatId: message.chat?.id,
    messageId: message.message_id,
    remoteId: saved?.id,
    hasJsonButton: Boolean(jsonUrl),
  });
}
