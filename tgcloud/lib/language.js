import { db } from 'sdk';
import { eq } from 'sdk/db';
import { userPreferences } from '../schema.js';

export function normalizeLanguage(value) {
  return String(value).toLowerCase().startsWith('en') ? 'en' : 'id';
}

export async function getUserLanguage(user) {
  const userId = user?.id;
  if (userId == null) return 'id';

  const preference = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .get();

  if (preference?.lang) return normalizeLanguage(preference.lang);
  return normalizeLanguage(user.language_code);
}

export async function setUserLanguage(userId, lang) {
  await db
    .insert(userPreferences)
    .values({ userId, lang })
    .onConflictDoUpdate({
      target: userPreferences.userId,
      set: { lang },
    })
    .run();
}

export const translations = {
  id: {
    from: 'From', text: 'Text', caption: 'Caption', message: 'Message', char: 'char',
    entity: 'Entity', entityUnit: 'buah', customEmoji: 'Emoji Custom',
    forwardOrigin: 'Forward Origin', photoLargest: 'Foto (terbesar)', document: 'Dokumen',
    textLabel: 'text', idLabel: 'id', unknown: 'tidak diketahui',
    animation: 'Animasi', video: 'Video', videoNote: 'Video Note',
    resolutionVeryLow: 'Resolusi Sangat Rendah (Sub-SD)', resolutionLow: 'Resolusi Rendah (SD)',
    resolutionHigh: 'Resolusi Tinggi (HD)', resolutionFullHd: 'Resolusi Full HD',
    resolution2k: 'Resolusi 2K (QHD)', resolution4k: 'Resolusi 4K (UHD)',
    resolution8k: 'Resolusi Sangat Tinggi (8K atau lebih)',
    pixel: 'pixel', seconds: 'detik', kb: 'KB', byte: 'byte',
    languageSaved: 'Bahasa disimpan: Indonesia.', invalidLanguage: 'Gunakan: /lang id atau /lang en.',
    report: 'Report', permission: 'Permisi.. tetap tenang yak!',
    reportBot: 'Bot ini hanya memberikan informasi ID', reportLeave: 'dan akan pergi secara otomatis.',
  },
  en: {
    from: 'From', text: 'Text', caption: 'Caption', message: 'Message', char: 'chars',
    entity: 'Entity', entityUnit: '', customEmoji: 'Custom Emoji',
    forwardOrigin: 'Forward Origin', photoLargest: 'Photo (largest)', document: 'Document',
    textLabel: 'text', idLabel: 'id', unknown: 'unknown',
    animation: 'Animation', video: 'Video', videoNote: 'Video Note',
    resolutionVeryLow: 'Very Low Resolution (Sub-SD)', resolutionLow: 'Low Resolution (SD)',
    resolutionHigh: 'High Resolution (HD)', resolutionFullHd: 'Full HD Resolution',
    resolution2k: '2K Resolution (QHD)', resolution4k: '4K Resolution (UHD)',
    resolution8k: 'Very High Resolution (8K or higher)',
    pixel: 'pixel', seconds: 'seconds', kb: 'KB', byte: 'bytes',
    languageSaved: 'Language saved: English.', invalidLanguage: 'Use: /lang id or /lang en.',
    report: 'Report', permission: 'Sorry.. please stay calm!',
    reportBot: 'This bot only provides ID information', reportLeave: 'and will leave automatically.',
  },
};

export function tr(lang, key) {
  return translations[lang]?.[key] ?? translations.id[key] ?? key;
}
