import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { configureAuth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { drizzle } from 'drizzle-orm/d1';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	let auth;
	if (event.platform?.env?.DB) {
		const db = drizzle(event.platform.env.DB);
		auth = configureAuth(db);
	}

	if (!auth) {
		// handle missing auth (e.g. during build or if DB is missing)
		// for now we can arguably just proceed or return 500
		if (building) {
			// during build we might not have DB, which is fine
			return resolve(event);
		}
		// If we are not building and have no DB, we likely can't do auth.
		// However, svelteKitHandler needs auth.
		// Let's assume for now we might error or just skip auth logic?
		// But svelteKitHandler is the return.
		// Let's return resolve(event) if no auth to allow non-auth routes?
		return resolve(event);
	}

	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;
