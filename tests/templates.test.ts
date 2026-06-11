import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { db } from '$lib/server/db';
import { templates } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

beforeEach(() => {
	db.delete(templates).run();
});

afterAll(() => {
	db.delete(templates).run();
});

describe('templates API', () => {
	it('should list templates from database', () => {
		db.insert(templates).values({
			name: 'Intro Portrait',
			ratio: 'portrait',
			config: '[]'
		}).run();

		const all = db.select().from(templates).all();
		expect(all.length).toBe(1);
		expect(all[0].name).toBe('Intro Portrait');
		expect(all[0].ratio).toBe('portrait');
	});

	it('should create a template with default ratio', () => {
		const inserted = db.insert(templates).values({
			name: 'Outro',
			config: '[]'
		}).returning().get();

		expect(inserted.ratio).toBe('portrait');
	});

	it('should delete a template', () => {
		const inserted = db.insert(templates).values({
			name: 'Delete Me',
			ratio: 'landscape',
			config: '[]'
		}).returning().get();

		db.delete(templates).where(eq(templates.id, inserted.id)).run();

		const found = db.select().from(templates).where(eq(templates.id, inserted.id)).get();
		expect(found).toBeUndefined();
	});
});
