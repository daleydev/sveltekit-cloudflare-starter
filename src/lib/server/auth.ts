import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

export const configureAuth = (db: DrizzleD1Database) => {
	return betterAuth({
		baseURL: env.ORIGIN,
		secret: env.BETTER_AUTH_SECRET,
		database: drizzleAdapter(db, {
			provider: 'sqlite',
			usePlural: true
		}),
		emailAndPassword: { enabled: true, autoSignIn: true, requireEmailVerification: false },
		session: {
			expiresIn: 60 * 60 * 24 * 7, // 7 days
			updateAge: 60 * 60 * 24 // 1 day
		},
		plugins: [sveltekitCookies(getRequestEvent)] // make sure this is the last plugin in the array
	});
};
