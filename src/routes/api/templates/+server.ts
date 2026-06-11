import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { templates } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const all = db.select().from(templates).all();
	return json(all);
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	if (!body.name) {
		return json({ error: 'Name is required' }, { status: 400 });
	}

	const inserted = db.insert(templates).values({
		name: body.name,
		ratio: body.ratio || 'portrait',
		config: JSON.stringify(body.config || [])
	}).returning().get();

	return json(inserted, { status: 201 });
};
