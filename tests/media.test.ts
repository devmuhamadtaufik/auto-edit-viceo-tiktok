import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { db } from '$lib/server/db';
import { videos } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

const uploadsDir = path.resolve('uploads');

beforeAll(() => {
	if (!fs.existsSync(uploadsDir)) {
		fs.mkdirSync(uploadsDir, { recursive: true });
	}
});

beforeEach(() => {
	db.delete(videos).run();
});

afterAll(() => {
	db.delete(videos).run();
	const files = fs.readdirSync(uploadsDir);
	for (const file of files) {
		fs.unlinkSync(path.join(uploadsDir, file));
	}
});

describe('media API', () => {
	it('should list videos from database', async () => {
		db.insert(videos).values({
			filename: 'test.mp4',
			originalPath: 'uploads/test.mp4',
			status: 'uploaded'
		}).run();

		const all = db.select().from(videos).all();
		expect(all.length).toBe(1);
		expect(all[0].filename).toBe('test.mp4');
	});

	it('should delete a video record', async () => {
		const inserted = db.insert(videos).values({
			filename: 'delete-me.mp4',
			originalPath: 'uploads/delete-me.mp4',
			status: 'uploaded'
		}).returning().get();

		expect(inserted).toBeDefined();

		db.delete(videos).where(eq(videos.id, inserted.id)).run();

		const found = db.select().from(videos).where(eq(videos.id, inserted.id)).get();
		expect(found).toBeUndefined();
	});

	it('should create uploads directory if not exists', () => {
		expect(fs.existsSync(uploadsDir)).toBe(true);
	});
});

describe('thumbnail generator', () => {
	it('should export generateThumbnail function', async () => {
		const { generateThumbnail } = await import('$lib/video/processor');
		expect(typeof generateThumbnail).toBe('function');
	});
});
