import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import type { DrizzleDB } from './db';
import { sessions, users, accounts, verifications } from './db/auth.schema';

export const getAuth = (db: DrizzleDB) => {
	return betterAuth({
		baseURL: env.ORIGIN,
		secret: env.BETTER_AUTH_SECRET,
		database: drizzleAdapter(db, {
			provider: 'sqlite',
			usePlural: true,
			schema: {
				users: users,
				sessions: sessions,
				accounts: accounts,
				verifications: verifications
			}
		}),
		emailAndPassword: { enabled: true, autoSignIn: true, requireEmailVerification: false },
		session: {
			expiresIn: 60 * 60 * 24 * 7, // 7 days
			updateAge: 60 * 60 * 24 // 1 day
		},
		plugins: [sveltekitCookies(getRequestEvent)] // make sure this is the last plugin in the array
	});
};

export type BetterAuth = ReturnType<typeof getAuth>;
