import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const videos = sqliteTable('videos', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	filename: text('filename').notNull(),
	originalPath: text('original_path').notNull(),
	status: text('status').notNull().default('uploaded'),
	createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString())
});

export const jobs = sqliteTable('jobs', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	videoId: text('video_id').references(() => videos.id),
	type: text('type').notNull(),
	status: text('status').notNull().default('queued'),
	progress: integer('progress').notNull().default(0),
	config: text('config').notNull().default('{}'),
	createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString())
});
