import { api, fetch } from 'sdk';
import { BANGHASAN_AUTH_HEADER } from '../lib/config.js';
import { getUserLanguage, tr } from '../lib/language.js';

const DATA_API_URL = 'https://data.banghasan.com/json';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function isBotPresent(member) {
  if (!member) return false;
  if (member.status === 'member' || member.status === 'administrator' || member.status === 'creator') {
    return true;
  }

  return member.status === 'restricted' && member.is_member === true;
}

function withPrettyJson(url) {
  return `${url}${url.includes('?') ? '&' : '?'}pretty=true`;
}

export default async function (update) {
  const chat = update.chat;
  const oldMember = update.old_chat_member;
  const newMember = update.new_chat_member;

  if (!chat || !['group', 'supergroup', 'channel'].includes(chat.type)) return;
  if (!isBotPresent(newMember) || isBotPresent(oldMember)) return;

  const language = await getUserLanguage(update.from);
  const title = chat.title ?? chat.username ?? '(tanpa title)';
  const text = [
    `📑 ${tr(language, 'report')}`,
    `  ├🗝 id: <code>${escapeHtml(chat.id)}</code>`,
    `  ├⚜️ ${escapeHtml(title)}`,
    `  └🗃 tipe: ${escapeHtml(chat.type)}`,
    '',
    `🙏🏼 ${tr(language, 'permission')}`,
    `  ├ 🤖 ${tr(language, 'reportBot')}`,
    `  └ 🏃🏼‍♂️ ${tr(language, 'reportLeave')}`,
  ].join('\n');

  let jsonUrl = null;
  if (BANGHASAN_AUTH_HEADER) {
    const response = await fetch(DATA_API_URL, {
      method: 'POST',
      headers: {
        Authorization: BANGHASAN_AUTH_HEADER,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    });

    if (response.ok) {
      const saved = await response.json();
      const savedUrl =
        typeof saved?.url === 'string'
          ? saved.url
          : saved?.id
            ? `${DATA_API_URL}/${encodeURIComponent(saved.id)}`
            : null;
      jsonUrl = savedUrl ? withPrettyJson(savedUrl) : null;
    } else {
      console.warn('Could not save chat-join update for the report button', response.status);
    }
  }

  // Leave only after Telegram confirms the report message was sent.
  await api.sendMessage({
    chat_id: chat.id,
    text,
    parse_mode: 'HTML',
    ...(jsonUrl
      ? {
          reply_markup: {
            inline_keyboard: [[{ text: '📄 json', url: jsonUrl }]],
          },
        }
      : {}),
  });

  await api.leaveChat({ chat_id: chat.id });
  console.log('Bot reported and left chat', { chatId: chat.id, type: chat.type });
}
