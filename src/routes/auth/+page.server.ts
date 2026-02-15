import type { Actions } from '@sveltejs/kit';

export const actions = {
	signup: async ({ cookies, request, locals }) => {
		const data = await request.formData();

		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();

		console.log(email, password);

		if (!email) {
			return { success: false, emailError: 'Email is required' };
		}

		if (!password) {
			return { success: false, passwordError: 'Password is required' };
		}

		try {
			await locals.auth.api.signUpEmail({
				body: {
					email,
					password,
					name: email
				}
			});

			return { success: true };
		} catch (error) {
			console.log('sign up error', error);
		}

		return { success: false };
	}
} satisfies Actions;
