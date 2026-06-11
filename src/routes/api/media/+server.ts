import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { videos } from '$lib/server/db/schema';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { generateThumbnail } from '$lib/video/processor';
import type { RequestHandler } from './$types';

const UPLOADS_DIR = 'uploads';

async function ensureUploadsDir() {
	if (!existsSync(UPLOADS_DIR)) {
		await mkdir(UPLOADS_DIR, { recursive: true });
	}
}

export const GET: RequestHandler = async () => {
	const all = db.select().from(videos).all();
	return json(all);
};

export const POST: RequestHandler = async ({ request }) => {
	await ensureUploadsDir();

	const formData = await request.formData();
	const file = formData.get('file') as File;

	if (!file) {
		return json({ error: 'No file provided' }, { status: 400 });
	}

	const filename = file.name;
	const buffer = Buffer.from(await file.arrayBuffer());
	const filePath = path.join(UPLOADS_DIR, filename);
	const thumbnailPath = path.join(UPLOADS_DIR, `${path.parse(filename).name}.jpg`);

	await writeFile(filePath, buffer);

	try {
		await generateThumbnail(filePath, thumbnailPath);
	} catch {
		// Thumbnail generation is best-effort
	}

	const inserted = db.insert(videos).values({
		filename,
		originalPath: filePath,
		thumbnailPath,
		status: 'uploaded'
	}).returning().get();

	return json(inserted, { status: 201 });
};
