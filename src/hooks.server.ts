import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { getAuth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { getDB } from '$lib/server/db';

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.platform?.env?.DB) {
		return new Response('Internal Server Error', { status: 500 });
	}

	event.locals.db = getDB(event.platform.env.DB);

	if (!event.locals.db) {
		return new Response('Internal Server Error', { status: 500 });
	}

	event.locals.auth = getAuth(event.locals.db);

	if (!event.locals.auth) {
		return new Response('Internal Server Error', { status: 500 });
	}

	const session = await event.locals.auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	} else {
		event.locals.session = undefined;
		event.locals.user = undefined;
	}

	return svelteKitHandler({ event, resolve, auth: event.locals.auth, building });
};
