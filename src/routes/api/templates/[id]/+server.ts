import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { templates } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const template = db.select().from(templates).where(eq(templates.id, params.id)).get();

	if (!template) {
		return json({ error: 'Template not found' }, { status: 404 });
	}

	return json(template);
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	const existing = db.select().from(templates).where(eq(templates.id, params.id)).get();

	if (!existing) {
		return json({ error: 'Template not found' }, { status: 404 });
	}

	const updated = db
		.update(templates)
		.set({
			name: body.name ?? existing.name,
			ratio: body.ratio ?? existing.ratio,
			config: body.config ? JSON.stringify(body.config) : existing.config,
			updatedAt: new Date().toISOString()
		})
		.where(eq(templates.id, params.id))
		.returning()
		.get();

	return json(updated);
};

export const DELETE: RequestHandler = async ({ params }) => {
	const existing = db.select().from(templates).where(eq(templates.id, params.id)).get();

	if (!existing) {
		return json({ error: 'Template not found' }, { status: 404 });
	}

	db.delete(templates).where(eq(templates.id, params.id)).run();

	return json({ success: true });
};
