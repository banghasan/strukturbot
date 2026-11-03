import { api, InputFile } from 'sdk';
import { getUserLanguage, tr } from '../lib/language.js';

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

function isBotPresent(member) {
  if (!member) return false;
  if (member.status === 'member' || member.status === 'administrator' || member.status === 'creator') {
    return true;
  }

  return member.status === 'restricted' && member.is_member === true;
}

export default async function (update) {
  const chat = update.chat;
  const oldMember = update.old_chat_member;
  const newMember = update.new_chat_member;

  if (!chat || !['group', 'supergroup', 'channel'].includes(chat.type)) return;
  if (!isBotPresent(newMember) || isBotPresent(oldMember)) return;

  console.log('Chat membership changed: preparing report', {
    chatId: chat.id,
    type: chat.type,
    oldStatus: oldMember?.status,
    newStatus: newMember?.status,
  });

  try {
    const language = await getUserLanguage(update.from);
    const title = chat.title ?? chat.username ?? '(tanpa title)';
    const text = [
      `${customEmoji('5402372957701946187', '📑')} ${tr(language, 'report')}`,
      `  ├${customEmoji('5956267526630412170', '🗝')} id: <code>${escapeHtml(chat.id)}</code>`,
      `  ├${customEmoji('5249053508681883137', '👤')} ${escapeHtml(title)}`,
      `  └${customEmoji('5274102582585877844', '💬')} tipe: ${escapeHtml(chat.type)}`,
      '',
      `${customEmoji('5247133031235329609', '👋')} ${tr(language, 'permission')}`,
      `  ├ ${customEmoji('5854748376792305958', '🤖')} ${tr(language, 'reportBot')}`,
      `  └ ${customEmoji('5368747224949857891', '🏃🏼‍♂️')} ${tr(language, 'reportLeave')}`,
    ].join('\n');

    const file = new InputFile(
      new TextEncoder().encode(JSON.stringify(update, null, 2)),
      'telegram-chat-report.txt',
      { type: 'text/plain' },
    );

    // One Telegram message: the report is the document caption and the full
    // update is attached as a durable text file.
    await api.sendDocument({
      chat_id: chat.id,
      document: file,
      caption: text,
      parse_mode: 'HTML',
    });
    console.log('Chat report document sent', { chatId: chat.id });
  } catch (error) {
    console.warn('Could not send the chat report document', error);

    // Keep the original report behavior as a fallback if document upload is
    // rejected by the runtime or by Telegram permissions.
    try {
      await api.sendMessage({
        chat_id: chat.id,
        text,
        parse_mode: 'HTML',
      });
      console.log('Chat report sent using text fallback', { chatId: chat.id });
    } catch (fallbackError) {
      console.error('Could not send the chat report fallback', fallbackError);
    }
  } finally {
    // Leaving is attempted regardless of whether Telegram accepted the file.
    try {
      await api.leaveChat({ chat_id: chat.id });
    } catch (error) {
      console.error('Could not leave chat after sending the report', error);
    }
  }

  console.log('Chat report flow finished', { chatId: chat.id, type: chat.type });
}
