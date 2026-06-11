import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { videos } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params }) => {
	const video = db.select().from(videos).where(eq(videos.id, params.id)).get();

	if (!video) {
		return json({ error: 'Video not found' }, { status: 404 });
	}

	if (existsSync(video.originalPath)) {
		await unlink(video.originalPath);
	}

	if (video.thumbnailPath && existsSync(video.thumbnailPath)) {
		await unlink(video.thumbnailPath);
	}

	db.delete(videos).where(eq(videos.id, params.id)).run();

	return json({ success: true });
};
