import type { User, Session } from 'better-auth';
import { drizzle } from 'drizzle-orm/d1';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
			context: {
				waitUntil(promise: Promise<any>): void;
			};
		}

		interface Locals {
			user?: User;
			session?: Session;
		}

		// interface Error {}
		interface Locals {
			db: ReturnType<typeof drizzle>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
