import { table, integer, text } from 'sdk/db';

export const userPreferences = table('user_preferences', {
  userId: integer('user_id').primaryKey(),
  lang: text('lang').notNull().default('id'),
});
