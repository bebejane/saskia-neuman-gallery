'use server';

export async function signupToNewsletter(initialState: any, formData: FormData) {
	try {
		const email = formData.get('email') as string;
		if (!isEmail(email)) throw new Error('Invalid email address');

		const api_key = process.env.ARTLOGIC_MAILINGLIST_API_KEY!;
		const account_id = process.env.ARTLOGIC_MAILINGLIST_ACCOUNT_ID!;

		if (!api_key || !account_id)
			throw new Error(
				'ARTLOGIC_MAILINGLIST_API_KEY and ARTLOGIC_MAILINGLIST_ACCOUNT_ID are required',
			);

		const endpoint = new URL(`https://app.artlogic.net/${account_id}/public/api/mailings/signup`);
		const params = {
			api_key,
			email,
		};

		Object.entries(params).forEach(([k, v]) => endpoint.searchParams.append(k, v));

		const res = await fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams(params).toString(),
		});

		if (!res.ok) throw new Error(`Failed to subscribe: ${res.status} ${res.statusText}`);

		const body = await res.json();
		console.log('newsletter res', email, body);
		if (!body?.success) throw new Error(body.msg);
		return { success: true };
	} catch (e) {
		console.log('newsletter error', e);
		return {
			error: typeof e === 'string' ? e : (e as Error).message,
		};
	}
}

function isEmail(email: string) {
	const regexp = new RegExp(
		/(?:[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+(?:\.[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9\x2d]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
	);
	return regexp.test(email);
}
